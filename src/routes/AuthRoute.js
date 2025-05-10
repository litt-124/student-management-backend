'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const SignInAction = require(path.join(MANAGER.getActionsDir(), 'auth/SignInAction'));
const SignUpAction = require(path.join(MANAGER.getActionsDir(), 'auth/SignUpAction'));

class AuthRoute extends AbstractRoute {

    /**
     * @returns {string}
     */
    getPrefix() {
        return "/auth";
    }


    setActions() {
        this.router.post('/sign-in', SignInAction.service.bind(SignInAction));
        this.router.post('/sign-up', SignUpAction.service.bind(SignUpAction));
    }
}

module.exports = new AuthRoute();