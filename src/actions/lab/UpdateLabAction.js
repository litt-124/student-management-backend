'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const LabManager = require(path.join(MANAGER.getManagersDir(), 'LabManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /lab/update/{labId}:
 *   put:
 *     description: Update lab.
 *     tags:
 *       - Lab
 *     parameters:
 *       - name: labId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Lab Name"
 *     responses:
 *       200:
 *         description: Lab updated
 */
class UpdateLabAction extends AbstractAction {
    async action(data, req, res) {
        const labId = data.labId;
        delete data.labId;
        const lab = await LabManager.update(labId, data, req.currentUser);
        return lab;
    }

    async getRequestDataFormat() {
        return {
            labId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            name: { type: 'text', from: 'body' }
        };
    }
}

module.exports = new UpdateLabAction();
