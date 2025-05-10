'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AbstractUserAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

/**
 * @swagger
 * /user/my-info:
 *   get:
 *     description: Get My Info.
 *     tags:
 *       - User
 *     parameters:
 *         - $ref: '#/components/schemas/AuthorizationParameter'
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
class GetMyInfoAction extends AbstractUserAction {


    /**
     * get user by token
     *
     * @param data
     * @param req
     * @param res
     *
     * @returns {Promise<*[]>}
     */
    async action(data, req, res) {
        return UserManager.formatUserToResponse(req.currentUser);
    }
}

module.exports = new GetMyInfoAction();