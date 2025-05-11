'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserGroupManager = require(path.join(MANAGER.getManagersDir(), 'UserGroupManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /user-group/delete/{groupId}:
 *   delete:
 *     summary: Delete a user group
 *     tags:
 *       - UserGroup
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Group not found
 */
class DeleteUserGroupAction extends AbstractAction {
    async action(data, req, res) {
        const existing = await UserGroupManager.getById(data.groupId);
        if (!existing) {
            this.notFound(`Group with id ${data.groupId} not found`);
        }
        await UserGroupManager.delete(data.groupId);
        return { success: true };
    }

    async getRequestDataFormat() {
        return {
            groupId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new DeleteUserGroupAction();
