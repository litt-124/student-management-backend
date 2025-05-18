'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const ExamManager = require(path.join(MANAGER.getManagersDir(), 'ExamManager'));

/**
 * @swagger
 * /exam/user-upcoming:
 *   get:
 *     summary: Get upcoming scheduled exams for the logged-in user
 *     tags:
 *       - Exam
 *     responses:
 *       200:
 *         description: List of upcoming exams
 *       401:
 *         description: Not authorized
 */
class GetUserUpcomingExamsAction extends AbstractAction {
    async action(data, req, res) {
        const currentUser = req.currentUser;
        if (!currentUser) {
            this.notAllowed();
        }

        const upcomingExams = await ExamManager.getUpcomingForUser(currentUser);
        return upcomingExams;
    }

    async getRequestDataFormat() {
        return {}; // No request params needed
    }
}

module.exports = new GetUserUpcomingExamsAction();
