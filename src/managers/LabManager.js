'use strict';

const path = require('path');
const mongoose = require('mongoose');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const Lab = mongoose.model('Lab');

class LabManager extends AbstractManager {

    async create(params, user) {
        params.createdBy = user?._id ?? null;
        return Lab.create(params);
    }

    async update(id, params, user) {
        params.updatedBy = user?._id ?? null;
        await Lab.updateOne({_id: id}, params);
        return await this.getById(id);
    }

    async delete(id) {
        return Lab.deleteOne({_id: id});
    }

    async getById(id) {
        return Lab.findOne({_id: id});
    }

    async getList(offset = 0, limit = 100, searchText) {
        let labs = [];
        if (!searchText) {
            labs = await Lab.find({}).sort({createdAt: 1}).skip(offset).limit(limit);
        } else {
            labs = await this.searchLabs(searchText, offset, limit);
        }
        return labs;

    }

    async searchLabs(searchKey, offset, limit) {
        const searchRegex = new RegExp(searchKey, 'i');

        let filter = [
            {
                $match: {
                    name: {$regex: searchRegex}
                }
            },
            {$sort: {createdAt: 1}}
        ];

        if (offset) {
            filter.push({$skip: offset});
        }
        if (limit) {
            filter.push({$limit: limit});
        }

        return await Lab.aggregate(filter);
    }

    /**
     * return labs count
     *
     * @param searchText
     *
     * @returns {Promise<Query<number, any, unknown, any, "countDocuments">|*>}
     */
    async getCount(searchText) {
        if (!searchText) {
            return await Lab.countDocuments({});
        }

        let labs = await this.searchLabs(searchText);
        return labs.length;
    }

    /**
     * format labs to response
     *
     * @param labs
     *
     * @returns {*[]}
     */
    formatLabsToResponse(labs) {
        let formattedLabs = [];
        for (let i = 0; i < labs.length; i++) {
            formattedLabs.push(this.formatLabResponse(labs[i]));
        }
        return formattedLabs;
    }


    /**
     * format lab for response
     *
     * @param lab
     *
     * @returns {Object}
     */
    formatLabResponse(lab) {
        return {
            id: lab._id,
            name: lab.name
        };
    }
}

module.exports = new LabManager();
