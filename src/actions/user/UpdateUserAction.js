'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const EmailValidator = require(path.join(MANAGER.getValidatorsDir(), 'EmailValidator'));
const PasswordValidator = require(path.join(MANAGER.getValidatorsDir(), 'PasswordValidator'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

/**
 * @swagger
 * /user/update/{userId}:
 *   put:
 *     description: Update user.
 *     tags:
 *       - User
 *     parameters:
 *       - $ref: '#/components/schemas/AuthorizationParameter'
 *       - $ref: '#/components/schemas/UserIdParameter'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "updated_admin"
 *             firstName: "Updated"
 *             lastName: "Admin"
 *             email: "new_admin@admin.com"
 *             password: "UpdatedPass123"
 *             type: "teacher"
 *     responses:
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             example:
 *               id: "65a1593d090b9d3c5b0a0c80"
 *               username: "updated_admin"
 *               firstName: "Updated"
 *               lastName: "Admin"
 *               email: "new_admin@admin.com"
 *               type: "teacher"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 */
class UpdateUserAction extends AbstractUserAction {
    async action(data, req, res) {
        const userId = data.userId;
        delete data.userId;
        const user = await UserManager.update(userId, data, req.currentUser);
        return UserManager.formatUserToResponse(user);
    }

    async getRequestDataFormat() {
        return {
            userId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            username: { type: 'text', from: 'body' },
            firstName: { type: 'text', from: 'body' },
            lastName: { type: 'text', from: 'body' },
            email: { type: 'text', from: 'body', validator: EmailValidator },
            password: { type: 'text', from: 'body', validator: PasswordValidator },
            type: { type: 'enum', from: 'body', possibleValues: ['admin', 'teacher', 'student'] }
        };
    }
}

module.exports = new UpdateUserAction();
