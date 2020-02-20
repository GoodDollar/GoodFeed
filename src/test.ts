import feedClass from './feedClass'
import {FeedInfo, FeedItem} from "index";

(async ()=>{
    const ne = new feedClass();
    const result = await ne.login('0x1adb8bdad4d24bc809', '0x97fc1b7bf822982de9');
    const date = new Date();
    let day = `${date.toISOString().slice(0, 10)}`;

    const feedItem: FeedItem = {
        id: 'string',
        type: 'string',
        status: 'string',
        createdDate: 'string',
        data: {
            from: 'string',
            amount: 555,
            code: 'string',
            reason: 'string',
            counterPartyDisplayName: 'string',
            paymentLink: 'string',
            otplStatus: 'string',
            customName: 'string',
            subtitle: 'string',
        }
    };
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
        name: "Test feed",
        id: "test_feed",
        owner: "1"
    };

    ne.createFeed({
        info: itemInfo,
        items: {
            [day]: {
                [feedItem.id]: feedItem
            },
            [`${day}_2`]: {
                [feedItem2.id]: feedItem2
            }
        },
        privateItems: {
            privatKey:{
                [day]: {
                    [feedItem.id]: feedItem
                },
                [`${day}_2`]: {
                    [feedItem2.id]: feedItem2
                }
            }
        }
    })

    console.log('=======================================')
})()
