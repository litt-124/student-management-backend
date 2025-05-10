'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();

class AbstractManager {
    constructor() {
        this.MANAGER = MANAGER;
    }


    /**
     * returns array of ids from entities
     *
     * @param entities
     *
     * @returns {*[]}
     */
    getIdsFromEntities(entities) {
        let result = [];
        for(let i=0; i<entities.length; i++) {
            result.push(entities[i]._id.toString());
        }

        return result;
    }


    /**
     * return items by field
     *
     * @param entities
     * @param field
     * @param value
     *
     * @returns {*[]}
     */
    getItemsFromListByField(entities, field, value) {
        let result = [];

        for(let i=0; i<entities.length; i++) {
            if(field === '_id' && entities[i]._id.toString() === value) {
                result.push(entities[i]);
            }
            else if(entities[i][field] === value){
                result.push(entities[i]);
            }
        }

        return result;
    }
}

module.exports = AbstractManager;