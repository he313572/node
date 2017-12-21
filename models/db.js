var mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/myWeb';
var db = mongoose.createConnection(dbUrl);
db.once('open', callback => {
    console.log('数据库连接成功');
});
module.exports = db;