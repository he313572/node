var db = require('./db'),
    Acl = require('acl'),
    acl = new Acl(new Acl.mongodbBackend(db.db, 'acl_'));
setTimeout(() => {
    //设置权限
    acl.allow([{
        roles: 'admin',
        allows: [{
            resources: ['/main/student/find', '/main/student/add', '/main/student/delete', '/main/student/update'],
            permissions: '*'
        }]
    }, {
        roles: 'member',
        allows: [{
            resources: '/main/student/find',
            permissions: '*'
        }]
    }]);
}, 2000);
module.exports = acl;