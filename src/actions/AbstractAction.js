'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();

class AbstractAction {
    constructor() {
        this.MANAGER = MANAGER;
    }

    /**
     * returns allowed groups for this load
     *
     * @returns {*[]}
     */
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
        }
        catch(error) {
            let response = {message: error.message};
            if(error.data) {
                response.data = error.data;
            }
            let responseCode = error.responseCode ? error.responseCode : 400;
            return res.status(responseCode).json(response);
        }
    }


    /**
     * user allowed for this action validation
     *
     * @param req
     *
     * @returns {Promise<void>}
     */
    async hasAccess(req) {
        return ;
        let allowedGroups = this.getAllowedGroups();
        if(!allowedGroups.length) {
            return;
        }

        let currentUser = req.currentUser;
        if(!currentUser || allowedGroups.indexOf(currentUser.role) === -1) {
            this.notAllowed();
        }
    }


    notAllowed(errorMessage) {
        errorMessage = errorMessage ? errorMessage : "Not Allowed";
        let error = new Error(errorMessage);
        error.responseCode = 401;
        throw error;
    }

    notFound(errorMessage) {
        errorMessage = errorMessage ? errorMessage : "Not Found";
        let error = new Error(errorMessage);
        error.responseCode = 404;
        throw error;
    }

    conflict(errorMessage) {
        errorMessage = errorMessage ? errorMessage : "Conflict";
        let error = new Error(errorMessage);
        error.responseCode = 409;
        throw error;
    }


    /**
     * returns validated request
     *
     * @param req
     *
     * @returns {Promise<{}>}
     */
    async getRequestData(req) {
        const requestDataFormat = await this.getRequestDataFormat();

        const result = await this._getFormattedData(requestDataFormat, req);

        if (!Object.keys(result.errors).length) {
            // Auto-attach createdBy/updatedBy if they exist in the schema
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



    _hasError(errors) {

    }


    /**
     * get validated data from request
     *
     * @param requestModel
     * @param request
     *
     * @returns {Promise<{fields: {}, errors: {}}>}
     *
     * @private
     */
    async _getFormattedData(requestModel, request){
        let errors = {};
        let result = {};

        for(let field in requestModel) {
            if(!requestModel.hasOwnProperty(field)) {
                continue;
            }
            if(requestModel[field]['type'] && requestModel[field]['type'] === 'object') {
                let nestRequest = request['body'][field] ? request['body'][field] : {};
                let nestResult = await this._getFormattedData(requestModel[field].data, nestRequest);
                if(Object.keys(nestResult.errors).length) {
                    errors[field] = nestResult.errors;
                }
                else {
                    result[field] = nestResult.fields
                }
            }
            else {
                let from = requestModel[field]['from'] ? requestModel[field]['from'] : null;
                let requestedData = from ? request[from] : request;
                if(!requestedData[field] && requestModel[field]['required']) {
                    errors[field] = 'not provided';
                    continue;
                }

                let value = requestedData[field] ? requestedData[field] : '';
                if(!value && requestModel[field]['default']) {
                    value = requestModel[field]['default'];
                }
                if(requestModel[field]['type'] && requestModel[field]['type'] === 'text') {
                    value = value.trim();
                }
                if(requestModel[field]['type'] && requestModel[field]['type'] === 'number') {
                    value = +value.trim();
                }
                if(requestModel[field]['type'] && requestModel[field]['type'] === 'boolean') {
                    value = !!value;
                }
                if(requestModel[field]['type'] && requestModel[field]['type'] === 'array') {
                    if(!value) {
                        value = [];
                    }
                    if(!Array.isArray(value)) {
                        errors[field] = 'wrong value';
                        continue;
                    }
                }
                if(requestModel[field]['type'] && requestModel[field]['type'] === 'enum') {
                    value = value ? value.trim() : null;
                    if(value && requestModel[field].possibleValues.indexOf(value) === -1) {
                        errors[field] = 'wrong value';
                        continue;
                    }
                }
                if(value && requestModel[field]['validator']) {
                    try {
                        await requestModel[field]['validator'].validate(value);
                    }
                    catch(error) {
                        errors[field] = error.message;
                        continue;
                    }
                }
                if(typeof requestedData[field] === 'undefined') {
                    continue;
                }
                result[field] = value;
            }
        }
        return {fields: result, errors: errors};
    }

    /**
     * called when page should be loaded
     * returns params that will be attached to template
     *
     * @param data
     * @param req
     * @param res
     *
     * @returns {Promise<{}>}
     */
    async action(data, req, res) {
        return {};
    }
}

module.exports = AbstractAction;