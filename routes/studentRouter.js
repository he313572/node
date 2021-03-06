var Student = require('../models/student');
exports.findStudent = (req, res) => {
    var currentPage = req.params.currentPage || 1;
    Student.findStudentPage(currentPage, (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
        res.render('index', {
            page: result,
            user: req.session.user
        });
    })
}
exports.addStudent = (req, res, next) => {
    console.log(next);
    Student.addStudent(req.body, (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
        res.redirect('/main/student/find/1');
    })
}
exports.deleteStudent = (req, res, next) => {
    let id = req.params.id;
    Student.deleteById(id, (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
        res.redirect('/main/student/find/1');
    })
}
exports.updateStudent = (req, res) => {
    let object = req.body;
    let id = object.id;
    delete object.id;
    Student.updateById(id, object, err => {
        if (err) {
            res.send(err);
            return;
        }
        res.redirect('/main/student/find/1');
    })
}