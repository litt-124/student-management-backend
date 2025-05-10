'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));
const EmailValidator = require(path.join(MANAGER.getValidatorsDir(), 'EmailValidator'));
const PasswordValidator = require(path.join(MANAGER.getValidatorsDir(), 'PasswordValidator'));

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     description: Sign In User.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "admin@admin.com"
 *             password: "SecurePass123"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               token: "JWT_TOKEN_HERE"
 *               userData:
 *                 id: "65a1593d090b9d3c5b0a0c80"
 *                 firstName: "Admin"
 *                 lastName: "User"
 *                 email: "admin@admin.com"
 *                 type: "admin"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid credentials"
 */
class SignInAction extends AbstractAction {
    async action(data, req, res) {
        const user = await UserManager.getByEmailAndPassword(data.email, data.password);
        let userData = UserManager.formatUserToResponse(user);
        return {
            token: await UserManager.getToken(user),
            userData
        };
    }

    async getRequestDataFormat() {
        return {
            email: { type: 'text', required: true, from: 'body', validator: EmailValidator },
            password: { type: 'text', required: true, from: 'body', validator: PasswordValidator },
        };
    }
}

module.exports = new SignInAction();
