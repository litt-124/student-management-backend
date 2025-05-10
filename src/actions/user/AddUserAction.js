'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const EmailValidator = require(path.join(MANAGER.getValidatorsDir(), 'EmailValidator'));
const PasswordValidator = require(path.join(MANAGER.getValidatorsDir(), 'PasswordValidator'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

/**
 * @swagger
 * /user/add:
 *   post:
 *     description: Add new user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "admin"
 *             firstName: "Admin"
 *             lastName: "User"
 *             email: "admin@admin.com"
 *             password: "SecurePass123"
 *             type: "admin"
 *     responses:
 *       200:
 *         description: Successfully created user
 *         content:
 *           application/json:
 *             example:
 *               id: "65a1593d090b9d3c5b0a0c80"
 *               username: "admin"
 *               firstName: "Admin"
 *               lastName: "User"
 *               email: "admin@admin.com"
 *               type: "admin"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 */
class AddUserAction extends AbstractUserAction {
    async action(data, req, res) {
        const user = await UserManager.create(data, req.currentUser);
        return UserManager.formatUserToResponse(user);
    }

    async getRequestDataFormat() {
        return {
            username: { type: 'text', required: true, from: 'body' },
            firstName: { type: 'text', required: true, from: 'body' },
            lastName: { type: 'text', required: true, from: 'body' },
            email: { type: 'text', required: true, from: 'body', validator: EmailValidator },
            password: { type: 'text', required: true, from: 'body', validator: PasswordValidator },
            type: { type: 'enum', required: true, from: 'body', possibleValues: ['admin', 'teacher', 'student'] }
        };
    }
}

module.exports = new AddUserAction();
