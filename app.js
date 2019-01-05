var express = require('express');
var app = express();
var Ddos = require('ddos')
var ddos = new Ddos({burst:10, limit:20})

var https = require('https');
var fs = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

app.locals.pretty = true;
app.set('port', 8081);
app.set('views', __dirname + '/page');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(ddos.express);
var dbHost = 'localhost';
var dbPort = 27017;
var dbName = 'pay'

var sessionMiddleware = session({
    secret: '',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({url:'mongodb://' + dbHost + ':' + dbPort + '/' + dbName})
});
app.use(sessionMiddleware);

const options = {
    key: fs.readFileSync("/etc/apache2/ssl/private.key"),
    cert: fs.readFileSync("/etc/apache2/ssl/certificate.crt"),
    ca: [fs.readFileSync("/etc/apache2/ssl/ca_bundle.crt")],
    rejectUnauthorized: false,
    agent:false,
    strictSSL:false,
    requestCert:true
};


require('./route')(app);
var server = https.createServer(options, app);

server.on('listening',function(){
    console.log('ok, server is running');
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

