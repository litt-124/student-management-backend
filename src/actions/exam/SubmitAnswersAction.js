'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const AnswerManager = require(path.join(MANAGER.getManagersDir(), 'AnswerManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /exam/submit-answers:
 *   post:
 *     summary: Submit answers for an exam
 *     tags:
 *       - Exam
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: string
 *               examId:
 *                 type: string
 *               studentActivityId:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Answers saved
 */
class SubmitAnswersAction extends AbstractAction {
    async action(data, req, res) {
        const user = req.currentUser;
        const files = req.files || [];
        const answers = JSON.parse(req.body.answers);

        const savedAnswers = await AnswerManager.saveAnswers({
            answers,
            examId: req.body.examId,
            studentActivityId: req.body.studentActivityId,
            files,
            user
        });

        return savedAnswers;
    }

    async getRequestDataFormat() {
        return {
        };
    }
}

module.exports = new SubmitAnswersAction();
