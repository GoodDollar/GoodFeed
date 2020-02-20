import * as _ from 'lodash'
import InterfaceFeed from './interfaces/interfaceFeed'
import {Feed, FeedInfo, FeedItem, Feeds} from './types'
import gunDB from './lib/gundb'
import logger from './lib/logger'


export default class feedClass implements InterfaceFeed {
    gun = gunDB;
    gunUser = this.gun.user();
    feeds = null;

    feedItemDataFields = [
        'rom',
        'amount',
        'code',
        'reason',
        'counterPartyDisplayName',
        'paymentLink',
        'otplStatus',
        'customName',
        'subtitle',
    ];
    feedInfoFields = [
        'name',
        'id',
        'owner',
    ];
    feedItemFields = [
        'id',
        'type',
        'status',
        'createdDate',
        'data',
    ];

    /**
     * Auth in gun and return all feeds
     *
     * @param {string} username
     * @param {string} password
     *
     * @return Feeds | boolean
     */
    async login(username: string, password: string): Promise<Feeds | boolean>
    {
        logger.info('class login');
        const user = await this.gunAuthInitFeed(username, password);
        if (!user) {
            return false
        }

        return this.getFeeds()
    }

    addItem(feedItem: FeedItem): FeedItem {
        return undefined;
    }

    addPrivateItem(feedItem: FeedItem, publicKey: string): FeedItem {
        return undefined;
    }

    /**
     * Create new feed
     *
     * @param {Feed} feed
     */
    async createFeed(feed: Feed): Promise<Feed | any>{
        logger.info('class createFeed');
        await this.feeds.get(feed.info.id).put(feed);
        return await this.getFeed(feed.info.id)
    }

    /**
     * Get feed by id
     *
     * @param {string} id
     */
    async getFeed(id: string): Promise<Feed | any>{
        logger.info('class getFeed');
        let result: any = {
            info: {},
            items: {},
            privateItems: {}
        };

        try {
            await this.feeds.get(id).get('info').on(async (dataInfo:any) => {
                result.info= _.pick(dataInfo, this.feedInfoFields)
            });
            result.items = await this.getFeedItems(id)
        } catch (e) {
            logger.error(e);
        }

        console.log(result);
        return result
    }

    /**
     * Return array items
     *
     * @param {string} id
     */
    async getFeedItems(id):Promise<FeedItem | any> {
        let result:any = {};
        await this.feeds.get(id).get('items').map().on(async (dataItems:any, itemKey: any) => {
            await this.feeds.get(id).get('items').get(itemKey).map().on((dataItem:any) => {
                result[itemKey] = _.pick(dataItem, this.feedItemFields)
            });
            await this.feeds.get(id).get('items').get(itemKey).get('data').map().on((dataItem:any) => {
                result[itemKey].data = _.pick(dataItem, this.feedItemDataFields)
            });
        });

        return result
    }

    /**
     * Get all feeds user's
     */
    getFeeds(): Feeds {
        return undefined;
    }


    updateFeedInfo(feedInfo: FeedInfo): Feed {
        return undefined;
    }

    /**
     * Auth in gun
     *
     * @param {string} username
     * @param {string} password
     */
    gunAuthInitFeed(username: string, password: string): Promise<any> {
        logger.info('class gunAuthInitFeed');
        return new Promise((res, rej) => {
            this.gunUser.auth(username, password, user => {
                if (user.err) {
                    console.log(user.err);
                    return rej(user.err)
                }
                this.feeds = this.gunUser.get('feed');
                res(user)
            })
        })
    }

    /**
     * Create new user in gun (Only for testing)
     *
     * @param {string} username
     * @param {string} password
     */
    gunCreateUser(username: string, password: string): Promise<any> {
        logger.info('class gunCreateUser');
        return new Promise((res, rej) => {
            this.gunUser.create(username, password, user => {
                res(user)
            })
        })
    }
}
