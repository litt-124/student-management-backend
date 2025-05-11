'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserGroupManager = require(path.join(MANAGER.getManagersDir(), 'UserGroupManager'));

/**
 * @swagger
 * /user-group/list:
 *   get:
 *     summary: Get list of user groups
 *     tags:
 *       - UserGroup
 *     parameters:
 *       - name: offset
 *         in: query
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *       - name: searchText
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List returned
 */
class GetUserGroupsListAction extends AbstractAction {
    async action(data, req, res) {
        const { offset = 0, limit = 100, searchText = '' } = data;
        return await UserGroupManager.getList(offset, limit, searchText);
    }

    async getRequestDataFormat() {
        return {
            offset: { type: 'number', from: 'query' },
            limit: { type: 'number', from: 'query' },
            searchText: { type: 'text', from: 'query' }
        };
    }
}

module.exports = new GetUserGroupsListAction();
