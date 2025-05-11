'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserGroupManager = require(path.join(MANAGER.getManagersDir(), 'UserGroupManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /user-group/detail/{groupId}:
 *   get:
 *     summary: Get a user group by ID
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
 *         description: Group data
 *       404:
 *         description: Not found
 */
class GetUserGroupAction extends AbstractAction {
    async action(data, req, res) {
        const item = await UserGroupManager.getById(data.groupId);
        if (!item) {
            this.notFound(`Group with id ${data.groupId} not found`);
        }
        return item;
    }

    async getRequestDataFormat() {
        return {
            groupId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new GetUserGroupAction();
