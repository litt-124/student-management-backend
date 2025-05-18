'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const DetectUserMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'DetectUserMiddleware'));

const AddExamAction = require(path.join(MANAGER.getActionsDir(), 'exam/AddExamAction'));
const UpdateExamAction = require(path.join(MANAGER.getActionsDir(), 'exam/UpdateExamAction'));
const DeleteExamAction = require(path.join(MANAGER.getActionsDir(), 'exam/DeleteExamAction'));
const GetExamListAction = require(path.join(MANAGER.getActionsDir(), 'exam/GetExamListAction'));
const GetExamAction = require(path.join(MANAGER.getActionsDir(), 'exam/GetExamAction'));
const GetUserUpcomingExamsAction = require(path.join(MANAGER.getActionsDir(), 'exam/GetUserUpcomingExamsAction'));
const StartStudentActivityAction = require(path.join(MANAGER.getActionsDir(), 'exam/StartStudentActivityAction'));
const SubmitAnswersAction = require(path.join(MANAGER.getActionsDir(), 'exam/SubmitAnswersAction'));
const GetStudentAnswersAction = require(path.join(MANAGER.getActionsDir(), 'exam/GetStudentAnswersAction'));

const UploadMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'UploadMiddleware'));

class ExamRoute extends AbstractRoute {
    getPrefix() {
        return '/exam';
    }

    setActions() {
        this.router.get('/list', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetExamListAction.service.bind(GetExamListAction));
        this.router.get('/detail/:examId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetExamAction.service.bind(GetExamAction));
        this.router.get('/user-upcoming', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetUserUpcomingExamsAction.service.bind(GetUserUpcomingExamsAction));
        this.router.get('/:examId/answers/:userId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetStudentAnswersAction.service.bind(GetStudentAnswersAction));        this.router.post('/start-activity', DetectUserMiddleware.detect.bind(DetectUserMiddleware), StartStudentActivityAction.service.bind(StartStudentActivityAction));
        this.router.post('/submit-answers', DetectUserMiddleware.detect.bind(DetectUserMiddleware), UploadMiddleware, SubmitAnswersAction.service.bind(SubmitAnswersAction));
        this.router.post('/add', DetectUserMiddleware.detect.bind(DetectUserMiddleware), AddExamAction.service.bind(AddExamAction));
        this.router.put('/update/:examId', DetectUserMiddleware.detect.bind(DetectUserMiddleware),UploadMiddleware, UpdateExamAction.service.bind(UpdateExamAction));
        this.router.delete('/delete/:examId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), DeleteExamAction.service.bind(DeleteExamAction));
    }
}

module.exports = new ExamRoute();

