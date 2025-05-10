'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));
const EmailValidator = require(path.join(MANAGER.getValidatorsDir(), 'EmailValidator'));
const PasswordValidator = require(path.join(MANAGER.getValidatorsDir(), 'PasswordValidator'));

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     description: Sign Up User.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "test@test.test"
 *             password: "Barev123"
 *             firstName: "Test"
 *             lastName: "Test"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVhMTVhNzM1NTYyNDBhYmY4ODNkMjA4IiwiZW1haWwiOiJ0ZXN0QHRlc3QudGVzdCIsImlhdCI6MTcwNTA3MzYxMSwiZXhwIjoxNzA2MjgzMjExfQ.6ebxg_3FDw-SytLDJwczOYxaWfXJtxwQ4tJINiRPRgU"
 *               userData:
 *                 id: "65a1593d090b9d3c5b0a0c80"
 *                 firstName: "Test"
 *                 lastName: "Test"
 *                 email: "test@test.test"
 *                 phone: "123456789"
 *                 active: true
 *                 role: "user"
 *                 allowedCategories: []
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             example:
 *               message: "validation failed"
 */
class SignUpAction extends AbstractAction {

    /**
     *
     * @param data
     * @param req
     * @param res
     *
     * @returns {Promise<{token: *}>}
     */
    async action(data, req, res) {
        const user = await UserManager.create(data);
        let userData = UserManager.formatUserToResponse(user);
        return {
            token: await UserManager.getToken(user),
            userData: userData
        };
    }

    /**
     *
     * @returns {Promise<{firstName: {from: string, type: string, required: boolean}, lastName: {from: string, type: string, required: boolean}, password: {validator: *, from: string, type: string, required: boolean}, phone: {from: string, type: string, required: boolean}, allowedCategories: {from: string, type: string, required: boolean}, email: {validator: *, from: string, type: string, required: boolean}}>}
     */
    async getRequestDataFormat() {
        return {
            email: {type: 'text', required: true, from: 'body', validator: EmailValidator},
            password: {type: 'text', required: true, from: 'body', validator: PasswordValidator},
            firstName: {type: 'text', required: true, from: 'body'},
            lastName: {type: 'text', required: true, from: 'body'},
            phone: {type: 'text', required: false, from: 'body'},
            allowedCategories: {type: 'array', required: false, from: 'body'}
        }
    }
}

module.exports = new SignUpAction();