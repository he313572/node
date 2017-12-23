var mongoose = require('mongoose'),
    db = require('./db'),
    uuid = require('uuid/v4'),
    studentSchema = new mongoose.Schema({
        id: String,
        name: String,
        age: Number,
        score: Number,
        sex: String
    })
studentSchema.statics.findStudentPage = function (currentPage, callback) {
    let page = {
        currentPage: currentPage,
        totalPage: 0,
        start: 1,
        end: 5,
        result: []
    }
    var skip = (currentPage - 1) * 5
    let studentModel = this.model('Student');
    return studentModel.count({}, (err, count) => {
        if (err) {
            callback(err);
            return;
        }
        page.totalPage = Number.parseInt((5 + count - 1) / 5);
        if (page.totalPage < 5) {
            page.end = page.totalPage;
        } else {
            page.start = currentPage - 2;
            page.end = currentPage + 3;
            if (page.start < 1) {
                page.start = 1;
                page.end = 5;
            }
            if (page.end > page.totalPage) {
                page.end = page.totalPage;
                page.start = page.end - 4;
            }
        }
        studentModel.find({}).skip(skip).limit(5).exec((err, docs) => {
            if (err) {
                callback(err);
                return;
            }
            page.result = docs;
            callback(null, page);
        });
    });
}
studentSchema.statics.addStudent = function (object, callback) {
    object.id = uuid().replace('-', '');
    return this.model('Student').create(object, callback);
}
studentSchema.statics.deleteById = function (id, callback) {
    return this.model('Student').remove({
        'id': id
    }, callback);
}
studentSchema.statics.updateById = function (id, object, callback) {
    return this.model('Student').updateOne({
        'id': id
    }, object, {
        upsert: true
    }, callback);
}
var Student = db.model('Student', studentSchema);
module.exports = Student;