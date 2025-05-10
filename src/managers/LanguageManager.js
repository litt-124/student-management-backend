'use strict';

const mongoose = require( 'mongoose' );
const LanguageDto = mongoose.model( 'Language' );
const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));

class LanguageManager extends AbstractManager {

    /**
     * returns all languages
     *
     * @returns {Promise<array>}
     */
    async getList() {
        return LanguageDto.find({});
    }
    /**
     * returns language found by code
     *
     * @returns {Promise<[LanguageDto]>}
     */
    async getLanguageByCode(code) {
        return LanguageDto.findOne( { code: code} );
    }


    /**
     * returns default language
     *
     * @returns {Promise<[LanguageDto]>}
     */
    async getDefaultLanguage() {
        return LanguageDto.findOne( { isDefault: true } );
    }
}

module.exports = new LanguageManager();