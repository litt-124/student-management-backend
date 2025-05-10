'use strict';

class IdValidator {
    constructor() {
    }

    async validate(data) {
        const regexp = /^[0-9a-fA-F]{24}$/;
        let valid = regexp.test(data.toLowerCase());
        if(!valid) {
            throw new Error('not valid id');
        }
    }
}

module.exports = new IdValidator();