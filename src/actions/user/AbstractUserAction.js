'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractAction = require(path.join(MANAGER.getActionsDir(), 'AbstractAction'));
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

class AbstractUserAction extends AbstractAction {

    /**
     * returns allowed groups for this load
     *
     * @returns {*[]}
     */
    getAllowedGroups() {
        return [UserManager.ADMIN_ROLE];
    }
}

module.exports = AbstractUserAction;