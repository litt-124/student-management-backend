'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /user/detail/{userId}:
 *   get:
 *     description: Get user detail.
 *     tags:
 *       - User
 *     parameters:
 *         - $ref: '#/components/schemas/AuthorizationParameter'
 *         - $ref: '#/components/schemas/UserIdParameter'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *                 id: "65a1593d090b9d3c5b0a0c80"
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
class GetUserAction extends AbstractUserAction {

    /**
     * get user by id
     *
     * @param data
     * @param req
     * @param res
     *
     * @returns {Promise<*[]>}
     */
    async action(data, req, res) {
        let user = await UserManager.getById(data.userId);
        if(!user) {
            this.notFound("User by given id " + data.userId + " not found");
        }
        return UserManager.formatUserToResponse(user);
    }


    /**
     *
     * @returns {Promise<{businessId: {validator: *, from: string, type: string, required: boolean}}>}
     */
    async getRequestDataFormat() {
        return {
            userId: {type: 'text', required: true, from: 'params', validator: IdValidator}
        }
    }
}

module.exports = new GetUserAction();