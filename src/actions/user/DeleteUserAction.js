'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /user/delete/{userId}:
 *   delete:
 *     description: Delete a user by ID.
 *     tags:
 *       - User
 *     parameters:
 *       - $ref: '#/components/schemas/AuthorizationParameter'
 *       - $ref: '#/components/schemas/UserIdParameter'
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User by given id 123 not found"
 */
class DeleteUserAction extends AbstractUserAction {

    async action(data, req, res) {
        const user = await UserManager.getById(data.userId);
        if (!user) {
            this.notFound(`User by given id ${data.userId} not found`);
        }

        await UserManager.delete(data.userId);
        return { success: true };
    }

    async getRequestDataFormat() {
        return {
            userId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new DeleteUserAction();
