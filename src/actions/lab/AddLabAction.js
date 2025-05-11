'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const LabManager = require(path.join(MANAGER.getManagersDir(), 'LabManager'));

/**
 * @swagger
 * /lab/add:
 *   post:
 *     description: Add new lab.
 *     tags:
 *       - Lab
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Physics Lab"
 *     responses:
 *       200:
 *         description: Successfully created lab
 *         content:
 *           application/json:
 *             example:
 *               id: "6622e7e01c46d8c4cf01d033"
 *               name: "Physics Lab"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 */
class AddLabAction extends AbstractAction {
    async action(data, req, res) {
        const lab = await LabManager.create(data, req.currentUser);
        return lab;
    }

    async getRequestDataFormat() {
        return {
            name: { type: 'text', required: true, from: 'body' }
        };
    }
}

module.exports = new AddLabAction();
