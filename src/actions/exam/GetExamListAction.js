'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ExamManager = require(path.join(MANAGER.getManagersDir(), 'ExamManager'));

/**
 * @swagger
 * /exam/list:
 *   get:
 *     summary: List exams with pagination
 *     tags:
 *       - Exam
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
 *         description: List of exams returned
 */
class GetExamListAction extends AbstractAction {
    async action(data, req, res) {
        const { offset = 0, limit = 100, searchText = '' } = data;
        return await ExamManager.getList(offset, limit, searchText);
    }

    async getRequestDataFormat() {
        return {
            offset: { type: 'number', from: 'query' },
            limit: { type: 'number', from: 'query' },
            searchText: { type: 'text', from: 'query' }
        };
    }
}

module.exports = new GetExamListAction();
