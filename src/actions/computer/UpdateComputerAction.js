'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ComputerManager = require(path.join(MANAGER.getManagersDir(), 'ComputerManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));
/**
 * @swagger
 * /computer/update/{computerId}:
 *   put:
 *     summary: Update computer
 *     tags:
 *       - Computer
 *     parameters:
 *       - name: computerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated PC Name"
 *             ipAddress: "10.0.0.50"
 *             labId: "662b3abc1234567890abcdef"
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Computer not found
 */

class UpdateComputerAction extends AbstractAction {
    async action(data, req, res) {
        const id = data.computerId;
        delete data.computerId;
        const updated = await ComputerManager.update(id, data, req.currentUser);
        return updated;
    }

    async getRequestDataFormat() {
        return {
            computerId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            name: { type: 'text', from: 'body' },
            ipAddress: { type: 'text', from: 'body' },
            labId: { type: 'text', from: 'body',default:null }
        };
    }
}

module.exports = new UpdateComputerAction();
