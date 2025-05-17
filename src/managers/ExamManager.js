'use strict';

const path = require('path');
const mongoose = require('mongoose');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));
const Exam = mongoose.model('Exam');
const Question = mongoose.model('Question');

class ExamManager extends AbstractManager {

    async create(params, user) {
        params.createdBy = user?._id ?? null;
        return Exam.create(params);
    }

    async update(id, params, user) {
        const { questions = [], ...updateData } = params;
        updateData.updatedBy = user?._id ?? null;
        await Exam.updateOne({ _id: id }, updateData);

        await Question.deleteMany({ examId: id });
        await this._createQuestions(id, questions, user);

        return await this.getById(id);
    }

    async delete(id) {
        await Question.deleteMany({ examId: id });
        return Exam.deleteOne({ _id: id });
    }

    async getById(id) {
        const exam = await Exam.findOne({ _id: id });
        const questions = await Question.find({ examId: id });
        return {
            ...exam.toObject(),
            questions
        };
    }

    async getList(offset = 0, limit = 100, searchText = '') {
        const trimmed = searchText.trim();
        const match = trimmed ? { title: { $regex: new RegExp(trimmed, 'i') } } : {};

        const exams = await Exam.find(match)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        const count = await Exam.countDocuments(match);

        return {
            exams: exams.map(e => this.formatExam(e)),
            count
        };
    }

    formatExam(e) {
        return {
            id: e._id,
            title: e.title,
            status: e.status,
            startTime: e.startTime,
            endTime: e.endTime
        };
    }

    async _createQuestions(examId, questions, user) {
        if (!questions.length) return;

        const questionDocs = questions.map(q => ({
            ...q,
            examId,
            createdBy: user?._id ?? null
        }));

        await Question.insertMany(questionDocs);
    }
}

module.exports = new ExamManager();
