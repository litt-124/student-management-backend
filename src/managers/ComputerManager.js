'use strict';

const path = require('path');
const mongoose = require('mongoose');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const Computer = mongoose.model('Computer');

class ComputerManager extends AbstractManager {

    async create(params, user) {
        params.createdBy = user?._id ?? null;
        if (!params.labId) {
            delete params.labId;
        }
        return Computer.create(params);
    }

    async update(id, params, user) {
        params.updatedBy = user?._id ?? null;
        if (!params.labId) {
            delete params.labId;
        }
        await Computer.updateOne({_id: id}, params);
        return await this.getById(id);
    }

    async delete(id) {
        return Computer.deleteOne({_id: id});
    }

    async getById(id) {
        return Computer.findOne({_id: id});
    }

    async getList(offset = 0, limit = 100, searchText) {
        const trimmedText = searchText ? searchText.trim() : '';

        if (!trimmedText) {
            const items = await Computer.find({})
                .populate('labId')
                .sort({createdAt: 1})
                .skip(offset)
                .limit(limit);
            const count = await Computer.countDocuments();
            return {computers: this.formatComputersToResponse(items), count};
        }

        const items = await this.searchComputers(trimmedText, offset, limit);
        return {computers: this.formatComputersToResponse(items), count: items.length};
    }

    async searchComputers(searchKey, offset, limit) {
        const searchRegex = new RegExp(searchKey, 'i');

        let filter = [
            {$match: {name: {$regex: searchRegex}}},
            {$sort: {createdAt: 1}}
        ];

        if (offset) filter.push({$skip: offset});
        if (limit) filter.push({$limit: limit});

        return await Computer.aggregate(filter);
    }

    formatComputersToResponse(computers) {
        return computers.map(c => this.formatComputerResponse(c));
    }

    formatComputerResponse(c) {
        return {
            id: c._id,
            name: c.name,
            ipAddress: c.ipAddress,
            labId: c.labId?._id || null,
            labName: c.labId?.name || null
        };
    }
}

module.exports = new ComputerManager();
