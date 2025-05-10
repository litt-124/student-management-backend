'use strict';

class PasswordValidator {
    constructor() {
    }

    async validate(data) {
        if(data.length < 6) {
            throw new Error('length should be at least 6');
        }
    }
}

module.exports = new PasswordValidator();