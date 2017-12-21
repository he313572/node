var mongoose = require('mongoose');
var db = require('./db');
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    id: String,
    nickname: String,
    iconPath: String
})
userSchema.statics.addUser = function (object, callback) {
    this.model('User').create(object, callback)
}
userSchema.statics.findUserByUsernameAndPassword = function (condition, callback) {
    this.model('User').findOne(condition, callback);
}
userSchema.statics.updateById = function (condition, object, callback) {
    this.model('User').updateOne(condition, object, {
        upsert: true
    }, callback);
}
userSchema.statics.findUserById = function (condition, callback) {
    this.model('User').findOne(condition, callback);
}
var User = db.model('User', userSchema);
module.exports = User;