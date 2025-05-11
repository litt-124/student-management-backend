'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const LabManager = require(path.join(MANAGER.getManagersDir(), 'LabManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /lab/detail/{labId}:
 *   get:
 *     description: Get lab details
 *     tags:
 *       - Lab
 *     parameters:
 *       - name: labId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the lab
 */
class GetLabAction extends AbstractAction {
    async action(data, req, res) {
        const lab = await LabManager.getById(data.labId);
        if (!lab) {
            this.notFound(`Lab by id ${data.labId} not found`);
        }
        return lab;
    }

    async getRequestDataFormat() {
        return {
            labId: { type: 'text', from: 'params', required: true, validator: IdValidator }
        };
    }
}

module.exports = new GetLabAction();
