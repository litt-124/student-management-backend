'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserGroupManager = require(path.join(MANAGER.getManagersDir(), 'UserGroupManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /user-group/update/{groupId}:
 *   put:
 *     summary: Update a user group
 *     tags:
 *       - UserGroup
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Group Name"
 *             description: "Updated description"
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Group not found
 */
class UpdateUserGroupAction extends AbstractAction {
    async action(data, req, res) {
        const id = data.groupId;
        delete data.groupId;
        return await UserGroupManager.update(id, data, req.currentUser);
    }

    async getRequestDataFormat() {
        return {
            groupId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            name: { type: 'text', from: 'body' },
            description: { type: 'text', from: 'body' },
            userId: { type: 'text', from: 'body' }

        };
    }
}

module.exports = new UpdateUserGroupAction();
