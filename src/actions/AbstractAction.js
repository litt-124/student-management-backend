'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const mongoose = require('mongoose');
const UserSession = mongoose.model('UserSession');

class AbstractAction {
    constructor() {
        this.MANAGER = MANAGER;
    }

    getAllowedGroups() {
        return [];
    }

    async getRequestDataFormat() {
        return {};
    }

    async service(req, res, next) {
        try {
            await this.hasAccess(req);
            let data = await this.getRequestData(req);
            let params = await this.action(data, req, res);
            return res.json(params);
        } catch (error) {
            let response = { message: error.message };
            if (error.data) {
                response.data = error.data;
            }
            let responseCode = error.responseCode ? error.responseCode : 400;
            return res.status(responseCode).json(response);
        }
    }

    async hasAccess(req) {
        const allowedGroups = this.getAllowedGroups();

        const user = req.currentUser;
        const token = req.headers['authorization'];

        if (!user || !token) {
            this.notAllowed('No user or token');
        }

        const session = await UserSession.findOne({
            userId: user._id,
            token,
            endTime: null
        });

        if (!session) {
            this.notAllowed('No valid session');
        }

        if (allowedGroups.length && !allowedGroups.includes(user.role)) {
            this.notAllowed('User role not allowed');
        }
    }

    notAllowed(errorMessage) {
        const error = new Error(errorMessage || 'Not Allowed');
        error.responseCode = 401;
        throw error;
    }

    notFound(errorMessage) {
        const error = new Error(errorMessage || 'Not Found');
        error.responseCode = 404;
        throw error;
    }

    conflict(errorMessage) {
        const error = new Error(errorMessage || 'Conflict');
        error.responseCode = 409;
        throw error;
    }

    async getRequestData(req) {
        const requestDataFormat = await this.getRequestDataFormat();
        const result = await this._getFormattedData(requestDataFormat, req);

        if (!Object.keys(result.errors).length) {
            const method = req.method.toLowerCase();
            if (req.currentUser && req.currentUser._id) {
                if (method === 'post') {
                    result.fields.createdBy = req.currentUser._id.toString();
                }
                if (method === 'put') {
                    result.fields.updatedBy = req.currentUser._id.toString();
                }
            }
            return result.fields;
        }

        const error = new Error('validation failed');
        error.data = result.errors;
        throw error;
    }

    _hasError(errors) {}

    async _getFormattedData(requestModel, request) {
        let errors = {};
        let result = {};

        for (let field in requestModel) {
            if (!requestModel.hasOwnProperty(field)) continue;

            if (requestModel[field]['type'] === 'object') {
                const nestRequest = request['body'][field] || {};
                const nestResult = await this._getFormattedData(requestModel[field].data, nestRequest);
                if (Object.keys(nestResult.errors).length) {
                    errors[field] = nestResult.errors;
                } else {
                    result[field] = nestResult.fields;
                }
            } else {
                const from = requestModel[field]['from'] || null;
                const requestedData = from ? request[from] : request;

                if (!requestedData[field] && requestModel[field]['required']) {
                    errors[field] = 'not provided';
                    continue;
                }

                let value = requestedData[field] || '';
                if (!value && requestModel[field]['default']) {
                    value = requestModel[field]['default'];
                }

                switch (requestModel[field]['type']) {
                    case 'text':
                        value = value.trim(); break;
                    case 'number':
                        value = +value.trim(); break;
                    case 'boolean':
                        value = !!value; break;
                    case 'array':
                        if (!value) value = [];
                        if (!Array.isArray(value)) {
                            errors[field] = 'wrong value';
                            continue;
                        }
                        break;
                    case 'enum':
                        value = value ? value.trim() : null;
                        if (value && !requestModel[field].possibleValues.includes(value)) {
                            errors[field] = 'wrong value';
                            continue;
                        }
                        break;
                }

                if (value && requestModel[field]['validator']) {
                    try {
                        await requestModel[field]['validator'].validate(value);
                    } catch (e) {
                        errors[field] = e.message;
                        continue;
                    }
                }

                if (typeof requestedData[field] !== 'undefined') {
                    result[field] = value;
                }
            }
        }

        return { fields: result, errors };
    }

    async action(data, req, res) {
        return {};
    }
}

module.exports = AbstractAction;
