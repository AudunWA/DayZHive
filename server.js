var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var ipfilter = require('ipfilter');
var moment = require('moment');
var app = express();

var pool = mysql.createPool({
    connectionLimit: 15,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hive'
});

// Init middleware
moment().format();

// Allowed IP's (server IP)
var ips = ['127.0.0.1'];
app.use(ipfilter(ips, {
    mode: 'allow'
}));
app.use(bodyParser());

exports.start = function () {
    app.listen(80);
    console.log('Server running on port 80');
}

app.post('/DayZServlet/lud0/find', function (req, res) {
    console.log('Got find: ' + req.query.uid);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('SELECT model,x,y,z,queue FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
            if (err) throw err;
            connection.release();

            if (rows.length == 0) {
                console.log('No data found');
                res.send('');
                return;
            }
            // Edit result for sending
            rows[0].pos = [rows[0].x, rows[0].y, rows[0].z];
            delete rows[0].x;
            delete rows[0].y;
            delete rows[0].z;

            // Calculate queue
            var queueEnd = moment(rows[0].queue);
            rows[0].queue = -queueEnd.diff(moment(), 'seconds');

            res.send(JSON.stringify(rows[0]));
        });
    });
});

app.get('/DayZServlet/lud0/load', function (req, res) {
    console.log('Got load: ' + req.query.uid);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('SELECT * FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
            if (err) throw err;
            connection.release();

            if (rows.length == 0) {
                console.log('No data found');
                res.send('');
                return;
            }
            // Edit result for sending
            rows[0].items = JSON.parse(rows[0].items);
            rows[0].state = JSON.parse(rows[0].state);
            rows[0].pos = [rows[0].x, rows[0].y, rows[0].z];
            rows[0].dir = [rows[0].dir_x, rows[0].dir_y, rows[0].dir_z];
            rows[0].up = [rows[0].up_0, rows[0].up_1, rows[0].up_2];
            delete rows[0].uid;
            delete rows[0].x;
            delete rows[0].y;
            delete rows[0].z;
            delete rows[0].dir_x;
            delete rows[0].dir_y;
            delete rows[0].dir_z;
            delete rows[0].up_0;
            delete rows[0].up_1;
            delete rows[0].up_2;

            // Calculate queue
            var queueEnd = moment(rows[0].queue);
            rows[0].queue = -queueEnd.diff(moment(), 'seconds');

            //console.log('Sent character data: ' + JSON.stringify(rows[0]));
            res.send(JSON.stringify(rows[0]));
        });
    });
});

app.post('/DayZServlet/lud0/create', function (req, res) {
    console.log('Got create: ' + req.query.uid);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('INSERT INTO player(uid) VALUES(?)', [req.query.uid], function (err, rows, fields) {
            if (err) throw err;
            connection.release();
        });
    });
    res.send('');
});

app.post('/DayZServlet/lud0/save', function (req, res) {
    console.log('Got save: ' + req.query.uid);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('UPDATE player SET model = ?, alive = ?, items = ?, state = ?, x = ?, y = ?, z = ?, dir_x = ?, dir_y = ?, dir_z = ?, up_0 = ?, up_1 = ?, up_2 = ? WHERE uid = ?', [req.body.model, req.body.alive, JSON.stringify(req.body.items), JSON.stringify(req.body.state), req.body.pos[0], req.body.pos[1], req.body.pos[2], req.body.dir[0], req.body.dir[1], req.body.dir[2], req.body.up[0], req.body.up[1], req.body.up[2], req.query.uid], function (err, rows, fields) {
            if (err) throw err;
            connection.release();
        });
    });
    res.send('');
});

app.post('/DayZServlet/lud0/queue', function (req, res) {
    console.log('Got queue: ' + req.query.uid + ' (' + req.body.queue + 's)');

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('SELECT queue FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
            if (err) throw err;

            var query;
            var queueEnd = moment(rows[0].queue);
            if (queueEnd.diff(moment(), 'seconds') > 0) {
                // Add to existing queue
                query = 'UPDATE player SET queue = DATE_ADD(queue,INTERVAL ' + mysql.escape(JSON.stringify(req.body.queue)) + ' SECOND) WHERE uid = ?';
            } else {
                // Create new queue from now
                query = 'UPDATE player SET queue = DATE_ADD(CURRENT_TIMESTAMP,INTERVAL ' + mysql.escape(JSON.stringify(req.body.queue)) + ' SECOND) WHERE uid = ?';
            }
            connection.query(query, [req.query.uid], function (err, rows, fields) {
                if (err) throw err;
                connection.release();
            });
        });
    });
    res.send('');
});

app.post('/DayZServlet/lud0/kill', function (req, res) {
    console.log('Got kill: ' + req.query.uid);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('DELETE FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
            if (err) throw err;
            connection.release();
        });
    });
    res.send('');
});

app.post('/DayZServlet/world/add', function (req, res) {
    console.log('Got world add: ' + JSON.stringify(req.body));

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('INSERT INTO dropped_items(type,imp,mt) VALUES(?,?,?)', [req.body.type, req.body.imp, JSON.stringify(req.body.mt)], function (err, rows, fields) {
            if (err) throw err;
            connection.release();
        });
    });
    res.send('');
});

app.post(/.*/, function (req, res) {
    console.log('Got unhandled POST: ' + req.url);
    res.send('404 not found');
});

app.get(/.*/, function (req, res) {
    console.log('Got unhandled GET: ' + req.url);
    res.send('404 not found');
});