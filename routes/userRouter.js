var User = require('../models/user');
var Formidable = require('formidable');
var crypto = require('crypto');
var path = require('path');
var uuid = require('uuid/v4');
var sd = require('silly-datetime');
var fs = require('fs');
var gm = require('gm')
var md5 = (password) => {
    let _md5 = crypto.createHash('md5');
    return _md5.update(password).digest('base64');
}
exports.userRegister = (req, res) => {
    let object = req.body;
    object.id = uuid().replace('-', '');
    object.password = md5(md5(object.password));
    delete object.confirmPassword;
    User.addUser(object, err => {
        if (err) {
            res.send(err);
            return;
        }
        res.redirect('/html/login.html');
    })
}
exports.prefectInfo = (req, res) => {
    var form = new Formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/upload/');
    form.parse(req, (err, fields, files) => {
        let object = fields;
        let tempPath = files.userIcon.path;
        let extname = path.extname(files.userIcon.name);
        let pre = sd.format(new Date(), 'YYYYMMDDHHmmss') + Number.parseInt((Math.random() * 89999 + 10000));
        let iconName = pre + extname;
        let iconPath = path.join(__dirname, '../public/upload/', iconName);
        fs.rename(tempPath, iconPath, err => {
            if (err) {
                read.send('头像上传失败,请重新注册');
                fs.unlink(tempPath);
                return;
            }
            object.iconPath = '/upload/' + iconName;
            User.updateById({
                id: req.session.user.id
            }, {
                $set: object
            }, err => {
                if (err) {
                    res.send(err);
                    return;
                }
                req.session.user.iconPath = '/upload/' + iconName;
                res.redirect('/main/user/cutPage');
            })
        })
    })
}
exports.userLogin = (req, res) => {
    let object = req.body;
    object.password = md5(md5(object.password));
    let remember = object.remember;
    if (remember) {
        delete object.remember;
    }
    User.findUserByUsernameAndPassword(object, (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
        if (result) {
            if (remember) {
                res.cookie('remember', object, {
                    maxAge: Number.MAX_SAFE_INTEGER,
                    httpOnly: true
                });
            }
            req.session.user = result;
            res.redirect('/main/student/');
        } else {
            res.send('用户名或密码不正确');
        }
    });
}
exports.signOut = (req, res) => {
    delete req.session.user;
    req.session.destroy(err => {
        res.redirect('/html/login.html');
    })
}
exports.autoLogin = (req, res, next) => {
    let object = req.cookies.remember;
    if (object) {
        User.findUserByUsernameAndPassword(object, (err, result) => {
            if (err) {
                next();
                return;
            }
            if (result) {
                req.session.user = result;
            }
            next();
        })
    } else {
        next();
    }
}
exports.loginInterceptor = (req, res, next) => {
    let user = req.session.user;
    if (user) {
        next();
    } else {
        res.redirect('/html/login.html');
    }
}
exports.cutIcon = (req, res) => {
    let absolute = path.join(__dirname, '../public/', req.session.user.iconPath);
    let w = Number.parseInt(req.query.w)
    let h = Number.parseInt(req.query.h)
    let x = Number.parseInt(req.query.x)
    let y = Number.parseInt(req.query.y)
    gm(absolute).crop(w, h, x, y).write(absolute, err => {
        let result;
        if (err) {
            result = '0';
        } else {
            result = '1'
        }
        res.send(result);
    });
}