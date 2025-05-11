'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ComputerManager = require(path.join(MANAGER.getManagersDir(), 'ComputerManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));
/**
 * @swagger
 * /computer/delete/{computerId}:
 *   delete:
 *     summary: Delete computer
 *     tags:
 *       - Computer
 *     parameters:
 *       - name: computerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Computer not found
 */

class DeleteComputerAction extends AbstractAction {
    async action(data, req, res) {
        const item = await ComputerManager.getById(data.computerId);
        if (!item) {
            this.notFound(`Computer with id ${data.computerId} not found`);
        }
        await ComputerManager.delete(data.computerId);
        return { success: true };
    }

    async getRequestDataFormat() {
        return {
            computerId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new DeleteComputerAction();
