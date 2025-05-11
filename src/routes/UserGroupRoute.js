'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const DetectUserMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'DetectUserMiddleware'));

const AddUserGroupAction = require(path.join(MANAGER.getActionsDir(), 'user-group/AddUserGroupAction'));
const UpdateUserGroupAction = require(path.join(MANAGER.getActionsDir(), 'user-group/UpdateUserGroupAction'));
const DeleteUserGroupAction = require(path.join(MANAGER.getActionsDir(), 'user-group/DeleteUserGroupAction'));
const GetUserGroupsListAction = require(path.join(MANAGER.getActionsDir(), 'user-group/GetUserGroupsListAction'));
const GetUserGroupAction = require(path.join(MANAGER.getActionsDir(), 'user-group/GetUserGroupAction'));

class UserGroupRoute extends AbstractRoute {
    getPrefix() {
        return '/user-group';
    }

    setActions() {
        this.router.get('/list', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetUserGroupsListAction.service.bind(GetUserGroupsListAction));
        this.router.get('/detail/:groupId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetUserGroupAction.service.bind(GetUserGroupAction));
        this.router.post('/add', DetectUserMiddleware.detect.bind(DetectUserMiddleware), AddUserGroupAction.service.bind(AddUserGroupAction));
        this.router.put('/update/:groupId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), UpdateUserGroupAction.service.bind(UpdateUserGroupAction));
        this.router.delete('/delete/:groupId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), DeleteUserGroupAction.service.bind(DeleteUserGroupAction));
    }
}

module.exports = new UserGroupRoute();
