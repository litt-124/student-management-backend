'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ComputerManager = require(path.join(MANAGER.getManagersDir(), 'ComputerManager'));
/**
 * @swagger
 * /computer/list:
 *   get:
 *     summary: Get list of computers
 *     tags:
 *       - Computer
 *     parameters:
 *       - name: offset
 *         in: query
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *       - name: searchText
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of computers
 */

class GetComputersListAction extends AbstractAction {
    async action(data, req, res) {
        const { offset = 0, limit = 100, searchText = '' } = data;
        const result = await ComputerManager.getList(offset, limit, searchText);
        return result;
    }

    async getRequestDataFormat() {
        return {
            offset: { type: 'number', from: 'query' },
            limit: { type: 'number', from: 'query' },
            searchText: { type: 'text', from: 'query' }
        };
    }
}

module.exports = new GetComputersListAction();
