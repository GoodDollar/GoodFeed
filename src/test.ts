import feedClass from './feedClass'
import {FeedInfo, FeedItem} from "index";

(async ()=>{

    const feedItem: FeedItem = {
        id: 'string_priv',
        type: 'string_priv',
        status: 'string_priv',
        createdDate: 'string_priv',
        data: {
            from: 'string_priv',
            amount: 666,
            code: 'string',
            reason: 'string',
            counterPartyDisplayName: 'string',
            paymentLink: 'string',
            otplStatus: 'string',
            customName: 'string',
            subtitle: 'string',
        }
    };

    const ne = new feedClass();
    const result = await ne.login('test_user', 'test_user');
    const date = new Date();
    let day = `${date.toISOString().slice(0, 10)}`;
    // await ne.addPrivateItem("test_feed_2", feedItem,'private_key_3');

    const feeds = await ne.getFeeds();
    console.log('***************************')
    console.log(feeds['test_feed_2'])
    console.log('***************************')

    const feedItem2: FeedItem = {
        id: 'string2',
        type: 'string2',
        status: 'string2',
        createdDate: 'string2',
        data: {
            from: 'string2',
            amount: 555,
            code: 'string2',
            reason: 'string2',
            counterPartyDisplayName: 'string2',
            paymentLink: 'string2',
            otplStatus: 'string2',
            customName: 'string2',
            subtitle: 'string2',
        }
    };

    const itemInfo: FeedInfo = {
        name: "Test feed 2",
        id: "test_feed_2",
        owner: "1"
    };

    // ne.createFeed({
    //     info: itemInfo,
    //     items: {
    //         [day]: {
    //             [feedItem.id]: feedItem
    //         },
    //         [`${day}_2`]: {
    //             [feedItem2.id]: feedItem2
    //         }
    //     },
    //     privateItems: {
    //         privatKey:{
    //             [day]: {
    //                 [feedItem.id]: feedItem
    //             },
    //             [`${day}_2`]: {
    //                 [feedItem2.id]: feedItem2
    //             }
    //         }
    //     }
    // })

    console.log('=======================================')
})()
