'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

/**
 * @swagger
 * /user/list:
 *   get:
 *     description: Get Users List.
 *     tags:
 *       - User
 *     parameters:
 *         - $ref: '#/components/schemas/AuthorizationParameter'
 *         - $ref: '#/components/schemas/OffsetParameter'
 *         - $ref: '#/components/schemas/LimitParameter'
 *         - $ref: '#/components/schemas/SearchParameter'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               totalCount: 24
 *               users:
 *               - id: "65a1593d090b9d3c5b0a0c80"
 *                 firstName: "Test"
 *                 lastName: "Test"
 *                 email: "test@test.test"
 *                 phone: "123456789"
 *                 active: true
 *                 role: "user"
 *                 allowedCategories: []
 *       401:
 *         description: Error
 *         content:
 *           application/json:
 *             example:
 *               message: "not allowed"
 *       404:
 *         description: Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 */
class GetUsersListAction extends AbstractUserAction {

    /**
     * creates new user
     *
     * @param data
     * @param req
     * @param res
     *
     * @returns {Promise<*[]>}
     */
    async action(data, req, res) {
        const users = await UserManager.getList(data.offset, data.limit, data.searchText);
        let usersToResponse = UserManager.formatUsersToResponse(users);
        let totalCount = await UserManager.getCount(data.searchText);
        return {
            totalCount: totalCount,
            users: usersToResponse
        };
    }

    /**
     *
     * @returns {Promise<{businessId: {validator: *, from: string, type: string, required: boolean}}>}
     */
    async getRequestDataFormat() {
        return {
            offset: {type: 'number', required: true, from: 'query'},
            limit: {type: 'number', required: true, from: 'query'},
            searchText: {type: 'text', from: 'query'}
        }
    }
}

module.exports = new GetUsersListAction();