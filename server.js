var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var morgan = require('morgan');
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('New client connected');
});

server.listen(80);

app.use(morgan(':method :url :response-time'));

var JWT_SECRET = 'catsmeow';

var db = null;
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wilsons", function (err, dbconn) {
    if (!err) {
        console.log("We are connected");
        db = dbconn;
    }
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wilsons");

var Meow = mongoose.model('Meow', {
    text: {type: String, required: true, minlength: 5},
    user: Schema.Types.Mixed,
    username: String,
    deactivated: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

var AuditEvent = mongoose.model('AuditEvent', {
    text: String,
    created: {type: Date, default: Date.now}
});

app.use(bodyParser.json());

app.use(express.static('public'));

var authorized = function (req, res, next) {
    var token = req.headers.authorization;
    var user = jwt.decode(token, JWT_SECRET);
    req.user = user;
    return next();
};

var audit = function (req, res, next) {
    var text = '';

    if (req.url == '/meows' && req.method == 'POST') {
        text = req.user.username + ' made a new meow: "' + req.body.newMeow + '"';
    } else if (req.url == '/meows/remove' && req.method == 'PUT') {
        text = req.user.username + ' removed meow: "' + req.body.meow.text + '"';
    }

    var newAuditEvent = new AuditEvent({
        text: text
    });

    newAuditEvent.save();

    return next();
};

app.get('/auditTrailEvents', function (req, res, next) {

    AuditEvent
        .find({$or: [{deactivated: null}, {deactivated: false}]})
        .sort('-created')
        .exec(function (err, events) {
            return res.json(events);
        });
});

app.get('/meows', function (req, res, next) {

    Meow
        .find({$or: [{deactivated: null}, {deactivated: false}]})
        .sort('-created')
        .exec(function (err, meows) {
            return res.json(meows);
        });
});

app.post('/meows', authorized, audit, function (req, res, next) {

    var currentTime = moment();
    var lastLogin = moment(req.user.lastLogin);

    if (moment.duration(currentTime.diff(lastLogin)).asDays() > 7) {
        return res.status(400).send('Too long ago login');
    }

    var newMeow = new Meow({
        text: req.body.newMeow,
        user: req.user._id,
        username: req.user.username
    });

    newMeow.save(function (err) {
        if (err) return res.status(400).send(err);
        io.emit('newMeow');
        return res.send();
    });
});

app.put('/meows/remove', authorized, audit, function (req, res, next) {

    var meowId = req.body.meow._id;

    Meow.update({_id: meowId, user: req.user._id}, {$set: {deactivated: true}}, function (err) {
        return res.send();
    });
});

app.post('/users', function (req, res, next) {

    db.collection('users', function (err, usersCollection) {

        bcrypt.genSalt(10, function (err, salt) {

            bcrypt.hash(req.body.password, salt, function (err, hash) {

                var newUser = {
                    username: req.body.username,
                    password: hash,
                    email: req.body.email
                };

                usersCollection.insert(newUser, {w: 1}, function (err) {
                    return res.send();
                });
            });
        });
    });
});

app.put('/users/signin', function (req, res, next) {

    db.collection('users', function (err, usersCollection) {

        usersCollection.findOne({username: req.body.username}, function (err, user) {

            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    user.lastLogin = moment().format();
                    var token = jwt.encode(user, JWT_SECRET);
                    return res.json({token: token});
                } else {
                    return res.status(400).send();
                }
            });
        });
    });
});

app.put('/users/resetPassword', function (req, res, next) {

    db.collection('users', function (err, usersCollection) {

        usersCollection.findOne({email: req.body.resetEmail}, function (err, user) {

            if (user) {
                var newPassword = Math.random().toString(36).substr(2, 5);
                console.log('New Password: ' + newPassword);

                bcrypt.genSalt(10, function (err, salt) {

                    bcrypt.hash(newPassword, salt, function (err, hash) {

                        usersCollection.update({email: req.body.resetEmail}, {$set: {password: hash}}, function () {
                            return res.send();
                        });
                    });
                });
            } else {
                return res.status(400).send();
            }
        });
    });
});

app.get('*', function (req, res, next) {
    return res.redirect('/#' + req.originalUrl);
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
