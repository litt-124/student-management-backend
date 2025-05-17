'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ExamManager = require(path.join(MANAGER.getManagersDir(), 'ExamManager'));
const IdValidator = require(path.join(MANAGER.getValidatorsDir(), 'IdValidator'));

/**
 * @swagger
 * /exam/update/{examId}:
 *   put:
 *     summary: Update an existing exam and its questions
 *     tags:
 *       - Exam
 *     parameters:
 *       - name: examId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Updated Exam Title"
 *             userGroupId: "663c..."
 *             userId: "663c..."
 *             labId: "663c..."
 *             status: "ongoing"
 *             startTime: "2024-06-01T10:00:00.000Z"
 *             endTime: "2024-06-01T12:00:00.000Z"
 *             questions:
 *               - type: "text"
 *                 title: "What is Node.js?"
 *                 allowAttachments: false
 *     responses:
 *       200:
 *         description: Exam updated
 *       404:
 *         description: Exam not found
 */
class UpdateExamAction extends AbstractAction {
    async action(data, req, res) {
        const questions = JSON.parse(req.body.questions); // originally stringified in frontend
        const files = req.files || [];

        files.forEach(file => {
            const match = file.fieldname.match(/^file_q(\d+)_/);
            if (match) {
                const qIndex = parseInt(match[1]);
                if (!questions[qIndex].attachments) questions[qIndex].attachments = [];
                questions[qIndex].attachments.push({
                    name: file.originalname,
                    buffer: file.buffer,
                    mimetype: file.mimetype
                });
            }
        });

        const payload = {
            ...req.body,
            questions
        };

        const examId = req.params.examId;
        delete data.examId;

        return await ExamManager.update(examId, payload, req.currentUser);

    }

    async getRequestDataFormat() {
        return {
            examId: { type: 'text', required: true, from: 'params', validator: IdValidator },
            title: { type: 'text', required: true, from: 'body' },
            userGroupId: { type: 'text', required: true, from: 'body' },
            userId: { type: 'text', required: true, from: 'body' },
            labId: { type: 'text', required: false, from: 'body' },
            status: { type: 'text', required: true, from: 'body' },
            startTime: { type: 'text', required: true, from: 'body' },
            endTime: { type: 'text', required: true, from: 'body' },
        };
    }
}

module.exports = new UpdateExamAction();
