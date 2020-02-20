import Gun from 'gun'
import {
    Feeds,
    Feed,
    FeedInfo,
    FeedItem
} from '../types'

export default interface InterfaceFeed {

    gun: Gun;

    gunUser: Gun;

    feeds: Gun;

    login(login: string, password: string): Promise<Feeds | boolean>;

    createFeed(Feed: Feed): Feed | any;

    getFeed(name: string): Feed | any;

    getFeeds(): Feeds;

    updateFeedInfo(feedInfo: FeedInfo): Feed;

    addItem(feedItem: FeedItem): FeedItem;

    addPrivateItem(feedItem: FeedItem, publicKey: string): FeedItem;

}