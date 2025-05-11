'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const LabManager = require(path.join(MANAGER.getManagersDir(), 'LabManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /lab/delete/{labId}:
 *   delete:
 *     description: Delete a lab by ID.
 *     tags:
 *       - Lab
 *     parameters:
 *       - $ref: '#/components/schemas/AuthorizationParameter'
 *       - name: labId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab successfully deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       404:
 *         description: Lab not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Lab by given id 123 not found"
 */
class DeleteLabAction extends AbstractAction {
    async action(data, req, res) {
        const lab = await LabManager.getById(data.labId);
        if (!lab) {
            this.notFound(`Lab by given id ${data.labId} not found`);
        }

        await LabManager.delete(data.labId);
        return { success: true };
    }

    async getRequestDataFormat() {
        return {
            labId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new DeleteLabAction();
