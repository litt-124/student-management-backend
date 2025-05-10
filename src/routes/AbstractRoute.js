'use strict';

const express = require('express');
const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const LanguageManager = require(path.join(MANAGER.getManagersDir(), 'LanguageManager'));

class AbstractRoute {
    constructor() {
        this.MANAGER = MANAGER;
        this.router = express.Router();
    }

    /**
     * @returns {string}
     */
    getPrefix() {
        return "";
    }

    /**
     * indicates if route supports multi-language
     * @returns {boolean}
     */
    hasMultiLanguageSupport() {
        return false;
    }


    setActions() {

    }


    getRouter() {
        this.setActions();
        return this.router;
    }


    async initialize() {
        let uriPrefix = process.env.URI_PREFIX ? process.env.URI_PREFIX : "";
        this.MANAGER.getApp().use(uriPrefix + this.getPrefix(), this.getRouter());

        if(this.hasMultiLanguageSupport()) {
            let languages = await LanguageManager.getList();

            for(let i=0; i<languages.length; i++) {
                this.MANAGER.getApp().use(uriPrefix + '/' + languages[i].code + this.getPrefix(), this.getRouter());
            }
        }



    }
}

module.exports = AbstractRoute;