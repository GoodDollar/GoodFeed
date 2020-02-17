import Gun from 'gun'
import {
    Feeds,
    Feed,
    FeedInfo,
    FeedItem
} from '../types'

export interface InterfaceFeed {

    gun: Gun;

    ready: Promise<boolean>;

    init(): Promise<boolean>;

    login(login: string, password: string): Feeds;

    createFeed(feedInfo: FeedInfo): Feed;

    getFeed(name: string): Feed;

    updateFeedInfo(feedInfo: FeedInfo): Feed;

    addItem(feedItem: FeedItem): FeedItem;

    addPrivateItem(feedItem: FeedItem, publicKey: string): FeedItem;

}