var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    acl = require('./models/nacl'),
    studentRouter = require('./routes/studentRouter'),
    userRouter = require('./routes/userRouter'),
    chatRouter = require('./routes/chatRouter'),
    baisiRouter = require('./routes/baisiRouter'),
    cookieParser = require('cookie-parser'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);
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

app.get('/main/student/find/:currentPage', acl.middleware(3, req => req.session.user._id), studentRouter.findStudent);
app.post('/main/student/add', acl.middleware(null, req => req.session.user._id), studentRouter.addStudent);
app.get('/main/student/delete/:id', acl.middleware(3, req => req.session.user._id), studentRouter.deleteStudent);
app.post('/main/student/update', acl.middleware(null, req => req.session.user._id), studentRouter.updateStudent);

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