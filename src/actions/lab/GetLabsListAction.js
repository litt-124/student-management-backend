'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const LabManager = require(path.join(MANAGER.getManagersDir(), 'LabManager'));

/**
 * @swagger
 * /lab/list:
 *   get:
 *     description: Get list of labs.
 *     tags:
 *       - Lab
 *     responses:
 *       200:
 *         description: List of labs
 *         content:
 *           application/json:
 *             example:
 *               labs:
 *                 - id: "6622e7e01c46d8c4cf01d033"
 *                   name: "Physics Lab"
 *               count: 1
 */
class GetLabsListAction extends AbstractAction {
    async action(data, req, res) {
        const labs = await LabManager.getList(data.offset, data.limit, data.searchText);
        let labsToResponse = LabManager.formatLabsToResponse(labs);
        let totalCount = await LabManager.getCount(data.searchText);
        return {
            totalCount: totalCount,
            labs: labsToResponse
        };
    }

    async getRequestDataFormat() {
        return {
            offset: { type: 'number', from: 'query' },
            limit: { type: 'number', from: 'query' },
            searchText: {type: 'text', from: 'query'}
        };
    }
}

module.exports = new GetLabsListAction();
