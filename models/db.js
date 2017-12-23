const dbUrl = 'mongodb://localhost:27017/WebMe';
var mongoose = require('mongoose'),
    db = mongoose.createConnection(dbUrl);
    db.once('open', callback => {
        console.log('数据库连接成功');
    });
module.exports = db;
