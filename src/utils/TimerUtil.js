'use strict';

class TimerUtil {
    constructor() {
    }
    async sleep(millisecond) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, millisecond);
        })
    }
}

module.exports = new TimerUtil();