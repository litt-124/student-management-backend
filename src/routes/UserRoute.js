'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const DetectUserMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'DetectUserMiddleware'));
const AddUserAction = require(path.join(MANAGER.getActionsDir(), 'user/AddUserAction'));
const UpdateUserAction = require(path.join(MANAGER.getActionsDir(), 'user/UpdateUserAction'));
const DeleteUserAction = require(path.join(MANAGER.getActionsDir(), 'user/DeleteUserAction'));
const GetUsersListAction = require(path.join(MANAGER.getActionsDir(), 'user/GetUsersListAction'));
const GetMyInfoAction = require(path.join(MANAGER.getActionsDir(), 'user/GetMyInfoAction'));
const GetUserAction = require(path.join(MANAGER.getActionsDir(), 'user/GetUserAction'));

class UserRoute extends AbstractRoute {

    /**
     * @returns {string}
     */
    getPrefix() {
        return "/user";
    }


    setActions() {
        this.router.get('/list', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetUsersListAction.service.bind(GetUsersListAction));
        this.router.get('/detail/:userId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetUserAction.service.bind(GetUserAction));
        this.router.get('/my-info', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetMyInfoAction.service.bind(GetMyInfoAction));
        this.router.post('/add', DetectUserMiddleware.detect.bind(DetectUserMiddleware), AddUserAction.service.bind(AddUserAction));
        this.router.put('/update/:userId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), UpdateUserAction.service.bind(UpdateUserAction));
        this.router.delete('/delete/:userId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), DeleteUserAction.service.bind(DeleteUserAction));
    }
}

module.exports = new UserRoute();