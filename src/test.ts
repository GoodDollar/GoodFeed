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
    await ne.login('test_user2', 'test_user2');
    const date = new Date();
    let day = date.toISOString();

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
        name: "Test feed SOLD 222",
        id: "",
        owner: ""
    };

    // await ne.createFeed({
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
    //         privateKey:{
    //             [day]: {
    //                 [feedItem.id]: feedItem
    //             },
    //             [`${day}_2`]: {
    //                 [feedItem2.id]: feedItem2
    //             }
    //         }
    //     }
    // })

    const feeds = await ne.getFeeds();
    console.log('***************************')
    console.log(feeds['Test feed SOLD 222']['privateItems']['privateKey'])
    console.log('***************************')
    console.log('=======================================')
})()
