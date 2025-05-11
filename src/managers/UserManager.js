'use strict';

const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const UserDto = mongoose.model( 'User' );

class UserManager extends AbstractManager {

    POSSIBLE_TYPES = ["admin", "teacher","student"];
    ADMIN_TYPE = 'admin';
    TEACHER_TYPE = 'teacher';
    STUDENT_TYPE = 'student';

    /**
     * return user found by email and password
     *
     * @param email
     * @param password
     *
     * @returns {Promise<Query<*, *, *, *, "findOne">>}
     */
    async getByEmailAndPassword(email, password) {
        let user = await this.getByEmail(email);
        if(!user) {
            throw new Error('user with email ' + email + ' not found');
        }
        if(!user.active) {
            throw new Error('user deactivated');
        }

        if (!this.#comparePasswords(password, user.password)) {
            throw new Error('password is incorrect');
        }

        return user;
    }

    /**
     * get token for user
     *
     * @param user
     *
     * @returns {Promise<*>}
     */
    async getToken(user) {
        return jwt.sign(
            { user_id: user._id, email: user.email },
            process.env.AUTH_SECRET,
            { expiresIn: process.env.AUTH_TOKEN_LIFETIME }
        );
    }


    /**
     * returns user found by token
     *
     * @param token
     *
     * @returns {Promise<*|null>}
     */
    async getByToken(token) {
        if(!token) {
            return null;
        }
        let userData = jwt.decode(token, process.env.AUTH_SECRET);
        if(!userData) {
            return null;
        }
        let currentTimestamp = Date.now() / 1000;
        if(userData.exp < currentTimestamp) {
            return null;
        }

        const user = await this.getById(userData.user_id);
        if(!user) {
            return null;
        }

        if(!user.active) {
            return null;
        }

        return user;
    }

    /**
     * returns user found by email
     *
     * @param email
     *
     * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
     */
    async getByEmail(email) {
        return UserDto.findOne({email: email});
    }

    /**
     * returns user found by username
     *
     * @param username
     *
     * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
     */
    async getByUsername(username) {
        return UserDto.findOne({username: username});
    }
    async searchUsers(searchKey, offset, limit) {
        const searchRegex = new RegExp(searchKey, 'i');

        let aggregateNewFields = {
            $addFields: {
                searchField1: { $concat: ["$firstName", " ", "$lastName", " ", "$email"] },
                searchField2: { $concat: ["$lastName", " ", "$firstName", " ", "$email"] },
                searchField3: { $concat: ["$email", " ", "$firstName", " ", "$lastName"] },
                searchField4: { $concat: ["$email", " ", "$lastName", " ", "$firstName"] },
                searchField5: "$username"
            }
        };

        let matchingQuery = {
            $match: {
                $and: [
                    { active: true },
                    {
                        $or: [
                            { searchField1: { $regex: searchRegex } },
                            { searchField2: { $regex: searchRegex } },
                            { searchField3: { $regex: searchRegex } },
                            { searchField4: { $regex: searchRegex } },
                            { searchField5: { $regex: searchRegex } }
                        ]
                    }
                ]
            }
        };

        let filter = [];
        filter.push(aggregateNewFields);
        filter.push(matchingQuery);
        filter.push({ $sort: {createdAt: 1 } });

        if(offset) {
            filter.push({
                $skip: offset
            });
        }
        if(limit) {
            filter.push({
                $limit: limit
            });
        }

        return await UserDto.aggregate(filter);
    }


    /**
     * returns user found by id
     *
     * @param id
     *
     * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
     */
    async getById(id) {
        return UserDto.findOne({_id: id});
    }


    /**
     * format users to response
     *
     * @param users
     *
     * @returns {*[]}
     */
    formatUsersToResponse(users) {
        let formattedUsers = [];
        for(let i=0; i<users.length; i++) {
            formattedUsers.push(this.formatUserToResponse(users[i]));
        }
        return formattedUsers;
    }


    /**
     * format user for response
     *
     * @param user
     *
     * @returns {Object}
     */
    formatUserToResponse(user) {
        return {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
            email: user.email,
            active: user.active
        };
    }

    /**
     * create new user
     *
     * @param params
     *
     * @returns {Promise<UserDto>}
     */
    async create(params) {
        let existingUser = await this.getByEmail(params.email);
        if(existingUser) {
            throw new Error('user with email ' + params.email + ' already exists');
        }
         existingUser = await this.getByUsername(params.username);
        if(existingUser) {
            throw new Error('user with username ' + params.username + ' already exists');
        }
        if(!params.type) {
            params.type = this.USER_TYPE;
        }
        params.password = this.#getPasswordHash(params.password);
        return UserDto.create(params);
    }


    /**
     * returns list of users by given offset and limit
     *
     * @param offset
     * @param limit
     * @param searchText
     *
     * @returns {Promise<Array>}
     */
    async getList(offset, limit, searchText) {
        let users = [];
        const trimmedText = searchText ? searchText.trim() : '';

        if(!trimmedText) {
            users = await UserDto.find({}).sort({createdAt: 1}).skip(offset).limit(limit);
        }
        else {
            users = await this.searchUsers(trimmedText, offset, limit);
        }
        return users;
    }


    /**
     * return users count
     *
     * @param searchText
     *
     * @returns {Promise<Query<number, any, unknown, any, "countDocuments">|*>}
     */
    async getCount(searchText){
        if(!searchText) {
            return await UserDto.countDocuments({});
        }

        let users = await this.searchUsers(searchText);
        return users.length;
    }


    /**
     * update user
     *
     * @param id
     * @param params
     * @param user
     *
     * @returns {Promise<Object>}
     */
    async update(id, params, user) {
        let userById = await this.getById(id);
        if(!userById) {
            throw new Error('incorrect id');
        }
        if(params.email) {
            let existingUser = await this.getByEmail(params.email);
            if(existingUser && existingUser._id.toString() !== id) {
                throw new Error('user with email ' + params.email + ' already exists');
            }
        }
        if(params.username) {
            let existingUser = await this.getByUsername(params.username);
            if(existingUser && existingUser._id.toString() !== id) {
                throw new Error('user with username ' + params.username + ' already exists');
            }
        }
        if(params.password) {
            params.password = this.#getPasswordHash(params.password);
        }

        params.updatedBy = user ? user._id.toString() : null;
        await UserDto.updateOne({_id: id}, params);
        return await this.getById(id);
    }


    /**
     * delete user by given id
     *
     * @param id
     * @returns {Promise<Query<DeleteResult, any, unknown, any, "deleteOne">>}
     */
    async delete(id) {
        return UserDto.deleteOne({_id: id});
    }


    /**
     * compare given password with hash
     *
     * @param password
     * @param hash
     *
     * @returns {*}
     */
    #comparePasswords(password, hash) {
        return bcrypt.compareSync(password, hash);
    }


    /**
     * generate hash from password
     *
     * @param password
     *
     * @returns {*}
     */
    #getPasswordHash(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
}

module.exports = new UserManager();