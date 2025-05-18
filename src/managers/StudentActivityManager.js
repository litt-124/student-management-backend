'use strict';

const mongoose = require('mongoose');
const StudentActivity = mongoose.model('StudentActivity');

class StudentActivityManager {
    async create(data) {
        return StudentActivity.create(data);
    }

    async getById(id) {
        return StudentActivity.findById(id);
    }

    async endActivity(id, userId) {
        return StudentActivity.findByIdAndUpdate(
            id,
            { endTime: new Date(), updatedBy: userId },
            { new: true }
        );
    }
}

module.exports = new StudentActivityManager();
