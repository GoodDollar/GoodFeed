export type Feeds = {
    [name: string]: Feed
}

export type Feed = {
    info: FeedInfo,
    items: FeedItems,
    privateItems: {
        [publickey: string]: EncryptedFeedItems
    }

}

export type FeedInfo = {
    name: string,
    id: string,
    owner: string
}

export type FeedItem = {
    id: string
}

export type FeedItems = {
    [date: string]: {
        [id: string]: FeedItem
    }
}

export type EncryptedFeedItems = {
    [date: string]: {
        [id: string]: FeedItem
    }
}