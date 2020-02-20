import * as gun from '@gooddollar/gun-appendonly'
import 'gun/lib/rindexed'

let gunDb: any;

const initGunDB = () => {

    if (!gunDb) {
        gunDb = gun({
            localStorage: false,
            peers: ['http://localhost:3003/gun']
        })
    }

  return gunDb
};

export default initGunDB()
