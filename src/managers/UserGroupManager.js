'use strict';

const path = require('path');
const mongoose = require('mongoose');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const UserGroup = mongoose.model('UserGroup');
const UserGroupMembership = mongoose.model('UserGroupMembership');

class UserGroupManager extends AbstractManager {

    async create(params, user) {
        const members = params.members || [];
        delete params.members;
        if (!params.userId) {
            delete params.userId;
        }
        params.createdBy = user?._id ?? null;

        const createdGroup = await UserGroup.create(params);

        if (members.length > 0) {
            await this._assignUsersToGroup(createdGroup._id, members, user);
        }

        return createdGroup;
    }

    async update(id, params, user) {
        const members = params.members || [];
        delete params.members;
        if (!params.userId) {
            delete params.userId;
        }
        params.updatedBy = user?._id ?? null;
        await UserGroup.updateOne({ _id: id }, params);
        const updatedGroup = await this.getById(id);

        await this._syncGroupMemberships(id, members, user);

        return updatedGroup;
    }


    async delete(id) {
        return UserGroup.deleteOne({ _id: id });
    }

    async getById(id) {
        const group = await UserGroup.findOne({ _id: id });

        if (!group) return null;

        const memberships = await UserGroupMembership.find({ userGroupId: id }).populate('userId');

        const members = memberships.map(m => ({
            id: m.userId._id,
            firstName: m.userId.firstName,
            lastName: m.userId.lastName
        }));

        return {
            _id: group._id,
            name: group.name,
            description: group.description,
            userId: group.userId,
            members
        };
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
    async _assignUsersToGroup(groupId, userIds, user) {
        await UserGroupMembership.deleteMany({ userGroupId: groupId });

        if (!userIds || !userIds.length) return;

        const memberships = userIds.map(userId => ({
            userId,
            userGroupId: groupId,
            createdBy: user?._id ?? null
        }));

        await UserGroupMembership.insertMany(memberships);
    }
    async _syncGroupMemberships(groupId, incomingUserIds, user) {
        // 1. Get existing userIds
        const existingMemberships = await UserGroupMembership.find({ userGroupId: groupId });
        const existingUserIds = existingMemberships.map(m => m.userId.toString());

        // 2. Figure out which to add and which to remove
        const incomingSet = new Set(incomingUserIds.map(String));
        const existingSet = new Set(existingUserIds);

        const toAdd = [...incomingSet].filter(id => !existingSet.has(id));
        const toRemove = [...existingSet].filter(id => !incomingSet.has(id));

        // 3. Remove unwanted memberships
        if (toRemove.length > 0) {
            await UserGroupMembership.deleteMany({
                userGroupId: groupId,
                userId: { $in: toRemove }
            });
        }

        // 4. Add new ones
        const newMemberships = toAdd.map(userId => ({
            userId,
            userGroupId: groupId,
            createdBy: user?._id ?? null
        }));

        if (newMemberships.length > 0) {
            await UserGroupMembership.insertMany(newMemberships);
        }
    }
}

module.exports = new UserGroupManager();
