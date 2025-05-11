'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const DetectUserMiddleware = require(path.join(MANAGER.getMiddlewaresDir(), 'DetectUserMiddleware'));

const AddComputerAction = require(path.join(MANAGER.getActionsDir(), 'computer/AddComputerAction'));
const UpdateComputerAction = require(path.join(MANAGER.getActionsDir(), 'computer/UpdateComputerAction'));
const DeleteComputerAction = require(path.join(MANAGER.getActionsDir(), 'computer/DeleteComputerAction'));
const GetComputersListAction = require(path.join(MANAGER.getActionsDir(), 'computer/GetComputersListAction'));
const GetComputerAction = require(path.join(MANAGER.getActionsDir(), 'computer/GetComputerAction'));

class ComputerRoute extends AbstractRoute {
    getPrefix() {
        return '/computer';
    }

    setActions() {
        this.router.get('/list', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetComputersListAction.service.bind(GetComputersListAction));
        this.router.get('/detail/:computerId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), GetComputerAction.service.bind(GetComputerAction));
        this.router.post('/add', DetectUserMiddleware.detect.bind(DetectUserMiddleware), AddComputerAction.service.bind(AddComputerAction));
        this.router.put('/update/:computerId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), UpdateComputerAction.service.bind(UpdateComputerAction));
        this.router.delete('/delete/:computerId', DetectUserMiddleware.detect.bind(DetectUserMiddleware), DeleteComputerAction.service.bind(DeleteComputerAction));
    }
}

module.exports = new ComputerRoute();
