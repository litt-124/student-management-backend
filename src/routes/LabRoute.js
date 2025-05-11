'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const DetectUserMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'DetectUserMiddleware'));
const AddLabAction = require(path.join(MANAGER.getActionsDir(), 'lab/AddLabAction'));
const UpdateLabAction = require(path.join(MANAGER.getActionsDir(), 'lab/UpdateLabAction'));
const DeleteLabAction = require(path.join(MANAGER.getActionsDir(), 'lab/DeleteLabAction'));
const GetLabsListAction = require(path.join(MANAGER.getActionsDir(), 'lab/GetLabsListAction'));
const GetLabAction = require(path.join(MANAGER.getActionsDir(), 'lab/GetLabAction'));

class LabRoute extends AbstractRoute {
    /**
     * @returns {string}
     */
    getPrefix() {
        return "/lab";
    }

    setActions() {
        this.router.get('/list', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetLabsListAction.service.bind(GetLabsListAction));
        this.router.post('/add', DetectUserMiddleware.detect.bind(DetectUserMiddleware), AddLabAction.service.bind(AddLabAction));
        this.router.get('/detail/:labId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetLabAction.service.bind(GetLabAction));
        this.router.put('/update/:labId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), UpdateLabAction.service.bind(UpdateLabAction));
        this.router.delete('/delete/:labId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), DeleteLabAction.service.bind(DeleteLabAction));
    }
}

module.exports = new LabRoute();
