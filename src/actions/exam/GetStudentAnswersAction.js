'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const AnswerManager = require(path.join(MANAGER.getManagersDir(), 'AnswerManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /exam/{examId}/answers/{userId}:
 *   get:
 *     summary: Get answers by student for an exam
 *     tags:
 *       - Exam
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student answers for exam
 */
class GetStudentAnswersAction extends AbstractAction {
    async action(data, req, res) {
        const { examId, userId } = data;
        const response = await AnswerManager.getStudentAnswers(examId, userId);
        return response;
    }

    async getRequestDataFormat() {
        return {
            examId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            userId: { type: 'text', required: true, from: 'params', validator: IdValidator }
        };
    }
}

module.exports = new GetStudentAnswersAction();
