'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserGroupManager = require(path.join(MANAGER.getManagersDir(), 'UserGroupManager'));

/**
 * @swagger
 * /user-group/add:
 *   post:
 *     summary: Create a new user group
 *     tags:
 *       - UserGroup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Group A"
 *             description: "Optional group description"
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Validation error
 */
class AddUserGroupAction extends AbstractAction {
    async action(data, req, res) {
        return await UserGroupManager.create(data, req.currentUser);
    }

    async getRequestDataFormat() {
        return {
            name: { type: 'text', required: true, from: 'body' },
            description: { type: 'text', required: false, from: 'body' },
            userId: { type: 'text', from: 'body' },
            members: { type: 'array', from: 'body' }

        };
    }
}

module.exports = new AddUserGroupAction();
