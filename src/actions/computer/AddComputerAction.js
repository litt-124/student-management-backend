'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ComputerManager = require(path.join(MANAGER.getManagersDir(), 'ComputerManager'));

/**
 * @swagger
 * /computer/add:
 *   post:
 *     description: Add new computer.
 *     tags:
 *       - Lab
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Computer Model Y"
 *             ipAddress: "192.168.1.1"
 *             labId: "6622e7e01c46d8c4cf01d034"
 *     responses:
 *       200:
 *         description: Successfully created computer
 *         content:
 *           application/json:
 *             example:
 *               id: "6622e7e01c46d8c4cf01d033"
 *               name: "Computer Model Y"
 *               ipAddress: "192.168.1.1"
 *               labId: "6622e7e01c46d8c4cf01d034"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 */


class AddComputerAction extends AbstractAction {
    async action(data, req, res) {
        const computer = await ComputerManager.create(data, req.currentUser);
        return computer;
    }

    async getRequestDataFormat() {
        return {
            name: { type: 'text', required: true, from: 'body' },
            ipAddress: { type: 'text', required: true, from: 'body' },
            labId: { type: 'text', ref: 'Lab', default: null }        };
    }
}

module.exports = new AddComputerAction();

