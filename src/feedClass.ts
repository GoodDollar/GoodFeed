import * as _ from 'lodash'
import Gun from 'gun'
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
    async login(username: string, password: string): Promise<Feeds | boolean> {
        logger.info('class login');
        const user = await this.gunAuthInitFeed(username, password);
        return (user)
    }

    /**
     * add item to feed
     * @param {string} feedInfoName
     * @param {FeedItem} feedItem
     */
    async addItem(feedInfoName: string, feedItem: FeedItem): Promise<boolean> {
        const date = new Date();
        const day = `${date.toISOString().slice(0, 10)}`;

        await this.feeds.get(feedInfoName).get('items').get(day).put(feedItem);
        return true
    }

    /**
     * Add private item to feed
     * @param {string} feedInfoName
     * @param {FeedItem} feedItem
     * @param {string} privateKey
     */
    async addPrivateItem(feedInfoName: string, feedItem: FeedItem, privateKey: string): Promise<boolean> {
        const date = new Date();
        const day = `${date.toISOString().slice(0, 10)}`;

        await this.feeds.get(feedInfoName).get('privateItems').get(privateKey).get(day).put(feedItem);
        return true
    }

    /**
     * Create new feed
     *
     * @param {Feed} feed
     */
    async createFeed(feed: Feed): Promise<Feed | any> {
        logger.info('class createFeed');

        feed.info.owner = await this.getOwnerSoul();
        const gunNewFeed = this.feeds.get(feed.info.name).put(feed);
        const id = await this.getSoul(gunNewFeed);
        await gunNewFeed.get('info').get('id').put(id);
        return gunNewFeed;
    }


    /**
     * Return user soul
     */
    async getOwnerSoul(): Promise<string> {
        return await this.getSoul(this.gunUser)
    }


    /**
     * Return soul gun object
     * @param {Gun} gunInstance
     */
    async getSoul(gunInstance: Gun): Promise<string> {
        return (await gunInstance)['_']['#']
    }

    /**
     * Get feed by id
     *
     * @param {string} feedInfoName
     */
    async getFeed(feedInfoName: string): Promise<Feed | any> {
        logger.info('class getFeed', {feedInfoName});
        let result: any = {
            info: {},
            items: {},
            privateItems: {}
        };

        try {
            const info = await this.feeds.get(feedInfoName).get('info').then()

            if (info) {
                result.info = _.pick(info, this.feedInfoFields);
                result.items = await this.getFeedItems(feedInfoName);
                result.privateItems = await this.getFeedPrivateItems(feedInfoName)
            }

        } catch (e) {
            logger.error(e);
        }

        return result
    }

    /**
     * Return array items
     *
     * @param {string} feedInfoName
     */
    async getFeedItems(feedInfoName: string): Promise<FeedItem | any> {
        let result: any = {};
        logger.info('class getFeedItems', {feedInfoName});
        const items = await this.feeds.get(feedInfoName).get('items').then();
        if (items) {
            for (let keyItem in items) {
                if (keyItem !== '_') {
                    const mainFields = await this.feeds
                        .get(feedInfoName)
                        .get('items')
                        .get(keyItem).map();
                    result[keyItem] = _.pick(mainFields, this.feedItemFields);
                    const dataItem = await this.feeds
                        .get(feedInfoName)
                        .get('items')
                        .get(keyItem)
                        .map()
                        .get('data')
                    result[keyItem].data = _.pick(dataItem, this.feedItemDataFields)
                }
            }
        }
        return result
    }

    /**
     * Return array items
     *
     * @param {string} feedInfoName
     */
    async getFeedPrivateItems(feedInfoName: string): Promise<FeedItem | any> {
        let result: any = {};
        logger.info('class getFeedPrivateItems', {feedInfoName});
        const privateItems = await this.feeds.get(feedInfoName).get('privateItems').then();
        if (privateItems) {
            for (let privateKey in privateItems) {
                if (privateKey !== '_') {
                    result[privateKey] = {};
                    let items = await this.feeds
                        .get(feedInfoName)
                        .get('privateItems')
                        .get(privateKey)
                        .then();
                    if (items) {
                        for (let keyItem in items) {
                            if (keyItem !== '_') {
                                const mainFields = await this.feeds
                                    .get(feedInfoName)
                                    .get('privateItems')
                                    .get(privateKey)
                                    .get(keyItem)
                                    .map()
                                console.log('**********************')
                                console.log(mainFields)
                                console.log('**********************')
                                result[privateKey][keyItem] = _.pick(mainFields, this.feedItemFields);
                                const dataItem = await this.feeds
                                    .get(feedInfoName)
                                    .get('privateItems')
                                    .get(privateKey)
                                    .get(keyItem)
                                    .map()
                                    .get('data')
                                result[privateKey][keyItem].data = _.pick(dataItem, this.feedItemDataFields)
                            }
                        }
                    }
                }
            }
        }
        return result
    }

    /**
     * Get all feeds user's
     */
    async getFeeds(): Promise<any> {
        logger.info('class getFeeds');
        let result = {};
        try {
            const feeds = await this.feeds.then();

            if (feeds) {
                for (let feeedKey in feeds) {
                    if (feeedKey !== '_') {
                        result[feeedKey] = await this.getFeed(feeedKey)
                    }

                }
            }
        } catch (e) {
            logger.error(e);
        }

        return result
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
