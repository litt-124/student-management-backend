'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const StudentActivityManager = require(path.join(MANAGER.getManagersDir(), 'StudentActivityManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /exam/start-activity:
 *   post:
 *     summary: Start exam activity for student
 *     tags:
 *       - Exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity created
 */
class StartStudentActivityAction extends AbstractAction {
    async action(data, req, res) {
        const currentUser = req.currentUser;
        const result = await StudentActivityManager.create({
            examId: data.examId,
            sessionId: data.sessionId || null,
            createdBy: currentUser._id
        });
        return result;
    }

    async getRequestDataFormat() {
        return {
            examId: { type: 'text', required: true, from: 'body', validator: IdValidator },
            sessionId: { type: 'text', required: false, from: 'body' }
        };
    }
}

module.exports = new StartStudentActivityAction();
