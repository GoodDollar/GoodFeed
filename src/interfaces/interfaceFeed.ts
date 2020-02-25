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

    getFeeds(): Promise<any> ;

    updateFeedInfo(feedInfo: FeedInfo): Feed;

    addItem(feedInfoID: string, feedItem: FeedItem): Promise<boolean>;

    addPrivateItem(feedInfoID: string, feedItem: FeedItem, publicKey: string): Promise<boolean>;

}