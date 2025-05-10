'use strict';

class EmailValidator {
    constructor() {
    }

    async validate(data) {
        const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = regexp.test(data.toLowerCase());
        if(!valid) {
            throw new Error('not valid email');
        }
    }
}

module.exports = new EmailValidator();