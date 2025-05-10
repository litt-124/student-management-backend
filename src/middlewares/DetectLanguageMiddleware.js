'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const LanguageManager = require(path.join(MANAGER.getManagersDir(), 'LanguageManager'));

class DetectLanguageMiddleware {

    constructor() {
        this.MANAGER = MANAGER;
    }

    /**
     * set current language in request
     *
     * @param req
     * @param res
     * @param next
     *
     * @returns {Promise<*>}
     */
    async detect(req, res, next) {
        let languages = await LanguageManager.getList();

        let locales = [];
        for(let i=0; i<languages.length; i++) {
            locales.push(languages[i].code);
        }

        let requestedLocale = req.originalUrl.split('/')[1];
        let locale = null;
        if(!locales.includes(requestedLocale)) {
            requestedLocale = req.headers['lang'] ? req.headers['lang'] : null;
        }
        if(locales.includes(requestedLocale)) {
            locale = requestedLocale;
        }

        let currentLanguage = null;
        if(!locale) {
            currentLanguage = await LanguageManager.getDefaultLanguage();
        }
        else {
            currentLanguage = await LanguageManager.getLanguageByCode(locale);
            if(!currentLanguage) {
                currentLanguage = await LanguageManager.getDefaultLanguage();
            }
        }

        req.currentLanuageId = currentLanguage._id.toString();
        req.currentLanuageCode = currentLanguage.code;
        return next();
    }
}

module.exports = new DetectLanguageMiddleware();