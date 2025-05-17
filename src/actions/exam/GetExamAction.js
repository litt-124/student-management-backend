'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ExamManager = require(path.join(MANAGER.getManagersDir(), 'ExamManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /exam/detail/{examId}:
 *   get:
 *     summary: Get a single exam with questions
 *     tags:
 *       - Exam
 *     parameters:
 *       - name: examId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam data
 *       404:
 *         description: Not found
 */
class GetExamAction extends AbstractAction {
    async action(data, req, res) {
        const exam = await ExamManager.getById(data.examId);
        if (!exam) this.notFound(`Exam with id ${data.examId} not found`);
        return exam;
    }

    async getRequestDataFormat() {
        return {
            examId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new GetExamAction();
