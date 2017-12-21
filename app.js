var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var studentRouter = require('./routes/studentRouter');
var userRouter = require('./routes/userRouter')
var chatRouter = require('./routes/chatRouter');
var baisiRouter = require('./routes/baisiRouter')
var cookieParser = require('cookie-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('./public/'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/main/', userRouter.autoLogin);
app.use('/main/', userRouter.loginInterceptor);
app.get('/main/student/', studentRouter.findStudent);
app.post('/main/student/add', studentRouter.addStudent);
app.get('/main/student/delete/:id', studentRouter.deleteStudent);
app.post('/main/student/update', studentRouter.updateStudent);
app.get('/main/student/:currentPage', studentRouter.findStudent);
app.post('/user/register', userRouter.userRegister);
app.post('/user/login', userRouter.userLogin);
app.get('/user/out', userRouter.signOut);
app.get('/main/user/perfect', (req, res) => {
    let user = req.session.user;
    res.render('perfect', {
        user: user
    })
});
app.post('/main/user/prefectInfo', userRouter.prefectInfo);
app.get('/main/user/cutPage', (req, res) => {
    res.render('cut', {
        user: req.session.user
    })
});
app.get('/main/user/cut', userRouter.cutIcon)
app.get('/main/chat/chat', chatRouter.chatRoom)
app.get('/main/baisi', (req, res) => {
    res.render('baisi', {
        user: req.session.user
    })
})
app.get('/', (req, res) => {
    res.render('login', {
        user: req.session.user
    })
});
app.get('/register', (req, res) => {
    res.render('register', {
        user: req.session.user
    })
});
app.get('/baisi/list', baisiRouter.getBaisiList);
app.use((req, res) => {
    res.render('login', {
        user: req.session.user
    })
});
io.on('connection', socket => {
    chatRouter.chat(io, socket);
});
server.listen(3000);