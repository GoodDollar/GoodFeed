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
    async login(username: string, password: string): Promise<Feeds | boolean> {
        logger.info('class login');
        const user = await this.gunAuthInitFeed(username, password);
        return (user)
    }

    /**
     * add item to feed
     * @param feedInfoID
     * @param feedItem
     */
    async addItem(feedInfoID: string, feedItem: FeedItem): Promise<boolean> {
        const date = new Date();
        const day = `${date.toISOString().slice(0, 10)}`;

        await this.feeds.get(feedInfoID).get('items').get(day).put(feedItem);
        return true
    }

    /**
     * Add private item to feed
     * @param feedInfoID
     * @param feedItem
     * @param privateKey
     */
    async addPrivateItem(feedInfoID: string, feedItem: FeedItem, privateKey: string): Promise<boolean> {
        const date = new Date();
        const day = `${date.toISOString().slice(0, 10)}`;

        await this.feeds.get(feedInfoID).get('privateItems').get(privateKey).get(day).put(feedItem);
        return true
    }

    /**
     * Create new feed
     *
     * @param {Feed} feed
     */
    async createFeed(feed: Feed): Promise<Feed | any> {
        logger.info('class createFeed');
        const res = await this.feeds.get(feed.info.id).put(feed);
        return res;
    }

    /**
     * Get feed by id
     *
     * @param feedInfoID
     */
    async getFeed(feedInfoID: string): Promise<Feed | any> {
        logger.info('class getFeed', {feedInfoID});
        let result: any = {
            info: {},
            items: {},
            privateItems: {}
        };

        try {
            const info = await this.feeds.get(feedInfoID).get('info').then()

            if (info) {
                result.info = _.pick(info, this.feedInfoFields);
                result.items = await this.getFeedItems(feedInfoID);
                result.privateItems = await this.getFeedPrivateItems(feedInfoID)
            }

        } catch (e) {
            logger.error(e);
        }

        return result
    }

    /**
     * Return array items
     *
     * @param feedInfoID
     */
    async getFeedItems(feedInfoID: string): Promise<FeedItem | any> {
        let result: any = {};
        logger.info('class getFeedItems', {feedInfoID});
        const items = await this.feeds.get(feedInfoID).get('items').then();
        if (items) {
            for (let keyItem in items) {
                if (keyItem !== '_') {
                    const mainFields = await this.feeds
                        .get(feedInfoID)
                        .get('items')
                        .get(keyItem).map();
                    result[keyItem] = _.pick(mainFields, this.feedItemFields);
                    const dataItem = await this.feeds
                        .get(feedInfoID)
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
     * @param feedInfoID
     */
    async getFeedPrivateItems(feedInfoID: string): Promise<FeedItem | any> {
        let result: any = {};
        logger.info('class getFeedPrivateItems', {feedInfoID});
        const privateItems = await this.feeds.get(feedInfoID).get('privateItems').then();
        if (privateItems) {
            for (let privateKey in privateItems) {
                if (privateKey == 'private_key_3') {
                    result[privateKey] = {};
                    let items = await this.feeds
                        .get(feedInfoID)
                        .get('privateItems')
                        .get(privateKey)
                        .then();
                    if (items) {
                        for (let keyItem in items) {
                            if (keyItem !== '_') {
                                const mainFields = await this.feeds
                                    .get(feedInfoID)
                                    .get('privateItems')
                                    .get(privateKey)
                                    .get(keyItem)
                                result[privateKey][keyItem] = _.pick(mainFields, this.feedItemFields);
                                const dataItem = await this.feeds
                                    .get(feedInfoID)
                                    .get('privateItems')
                                    .get(privateKey)
                                    .get(keyItem)
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
