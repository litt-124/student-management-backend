'use strict';

const path = require('path');
const mongoose = require('mongoose');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const UserGroup = mongoose.model('UserGroup');

class UserGroupManager extends AbstractManager {

    async create(params, user) {
        params.createdBy = user?._id ?? null;
        if (!params.userId) {
            delete params.userId;
        }
        return UserGroup.create(params);
    }

    async update(id, params, user) {
        params.updatedBy = user?._id ?? null;
        console.log(params)
        if (!params.userId) {
            delete params.userId;
        }
        console.log(params)
        await UserGroup.updateOne({ _id: id }, params);
        return await this.getById(id);
    }

    async delete(id) {
        return UserGroup.deleteOne({ _id: id });
    }

    async getById(id) {
        return UserGroup.findOne({ _id: id });
    }

    async getList(offset = 0, limit = 100, searchText) {
        const trimmedText = searchText ? searchText.trim() : '';

        if (!trimmedText) {
            const items = await UserGroup.find({})
                .populate('userId')
                .sort({ createdAt: 1 })
                .skip(offset)
                .limit(limit);
            const count = await UserGroup.countDocuments();
            return { userGroups: this.formatUserGroupsToResponse(items), count };
        }

        const items = await this.searchUserGroups(trimmedText, offset, limit);
        return { userGroups: this.formatUserGroupsToResponse(items), count: items.length };
    }

    async searchUserGroups(searchKey, offset, limit) {
        const searchRegex = new RegExp(searchKey, 'i');

        let filter = [
            { $match: { name: { $regex: searchRegex } } },
            { $sort: { createdAt: 1 } }
        ];

        if (offset) filter.push({ $skip: offset });
        if (limit) filter.push({ $limit: limit });

        return await UserGroup.aggregate(filter);
    }

    formatUserGroupsToResponse(groups) {
        return groups.map(g => this.formatUserGroupResponse(g));
    }

    formatUserGroupResponse(g) {
        return {
            id: g._id,
            name: g.name,
            description: g.description,
            userId: g.userId?._id || null,
            userName: g.userId?.firstName + ' ' + g.userId?.lastName || null
        };
    }
}

module.exports = new UserGroupManager();
