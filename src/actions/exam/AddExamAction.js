'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ExamManager = require(path.join(MANAGER.getManagersDir(), 'ExamManager'));

/**
 * @swagger
 * /exam/add:
 *   post:
 *     summary: Create a new exam with questions
 *     tags:
 *       - Exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Final Exam"
 *             userGroupId: "663c..."
 *             userId: "663c..."
 *             labId: "663c..."
 *             status: "scheduled"
 *             startTime: "2024-06-01T10:00:00.000Z"
 *             endTime: "2024-06-01T12:00:00.000Z"
 *             questions:
 *               - type: "text"
 *                 title: "What is the capital of France?"
 *                 allowAttachments: false
 *               - type: "multiple-choice"
 *                 title: "Select all prime numbers"
 *                 answerOptions: ["2", "4", "7", "9"]
 *                 allowAttachments: false
 *               - type: "file-upload"
 *                 title: "Upload your diagram"
 *                 allowAttachments: true
 *     responses:
 *       200:
 *         description: Exam created
 *       400:
 *         description: Validation error
 */
class AddExamAction extends AbstractAction {
    async action(data, req, res) {
        return await ExamManager.create(data, req.currentUser);
    }

    async getRequestDataFormat() {
        return {
            title: { type: 'text', required: true, from: 'body' },
            userGroupId: { type: 'text', required: true, from: 'body' },
            userId: { type: 'text', required: true, from: 'body' },
            labId: { type: 'text', required: false, from: 'body' },
            status: { type: 'text', required: true, from: 'body' },
            startTime: { type: 'text', required: false, from: 'body' },
            endTime: { type: 'text', required: false, from: 'body' },
        };
    }
}

module.exports = new AddExamAction();
