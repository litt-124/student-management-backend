'use strict';

const mongoose = require('mongoose');
const Answer = mongoose.model('Answer');
const Question = mongoose.model('Question');

class AnswerManager {
    async saveAnswers({ answers, examId, studentActivityId, files, user }) {
        const savedAnswers = [];

        for (let i = 0; i < answers.length; i++) {
            const ans = answers[i];
            let attachment = null;

            // Attach matching files
            if (ans.attachmentKeys?.length) {
                const matchedFiles = files.filter(f => ans.attachmentKeys.includes(f.fieldname));
                if (matchedFiles.length > 0) {
                    // for simplicity, just take first one for now
                    const file = matchedFiles[0];
                    attachment = file.originalname;
                }
            }
            console.log()
            const saved = await Answer.create({
                userId: user._id,
                questionId: ans.questionId,
                value: ans.value,
                attachment,
                createdBy: user._id,
                updatedBy: user._id
            });

            savedAnswers.push(saved);
        }

        return savedAnswers;
    }
    async getStudentAnswers(examId, userId) {
        const questions = await Question.find({ examId }).lean();
        const answers = await Answer.find({ questionId: { $in: questions.map(q => q._id) }, userId }).lean();

        return questions.map(q => {
            const answer = answers.find(a => a.questionId.toString() === q._id.toString());
            return {
                questionId: q._id,
                title: q.title,
                type: q.type,
                studentAnswer: answer ? (q.type === 'file-upload' ? `/uploads/${answer.attachment}` : answer.value) : null
            };
        });
    }
}

module.exports = new AnswerManager();
