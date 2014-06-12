var mysql = require('mysql');
var express = require('express');
var getRawBody = require('raw-body');
var bodyParser = require('body-parser');
var ipfilter = require('ipfilter');
var app = express();

exports.start = function () {
	// Init middleware
	app.use(bodyParser());
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'hive'
	});
	connection.connect();

	// Allowed IP's (server IP)
	var ips = ['127.0.0.1'];
	app.use(ipfilter(ips, {mode: 'allow'}));

	app.listen(80);
	console.log('Server running at http://127.0.0.1:80/');
}

app.post('/DayZServlet/lud0/find', function (req, res) {
    console.log('Got find: ' + req.query.uid);
    //connection.connect();
    connection.query('SELECT model,x,y,z,queue FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            console.log('No data found');
            res.send('');
            return;
        }
		// Edit result for sending
		rows[0].pos = [rows[0].x,rows[0].y,rows[0].z];
		delete rows[0].x;
		delete rows[0].y;
		delete rows[0].z;
		
		//console.log('Sent load data: ' + JSON.stringify(rows[0]));
        res.send(JSON.stringify(rows[0]));
    });
    //connection.end();
});

app.get('/DayZServlet/lud0/load', function (req, res) {
    console.log('Got load: ' + req.query.uid);
    //connection.connect();
    connection.query('SELECT * FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            console.log('No data found');
            res.send('');
            return;
        }
		// Edit result for sending
		rows[0].items = JSON.parse(rows[0].items);
		rows[0].state = JSON.parse(rows[0].state);
		rows[0].pos = [rows[0].x,rows[0].y,rows[0].z];
		rows[0].dir = [rows[0].dir_x,rows[0].dir_y,rows[0].dir_z];
		rows[0].up = [rows[0].up_0,rows[0].up_1,rows[0].up_2];
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

		//console.log('Sent character data: ' + JSON.stringify(rows[0]));
        res.send(JSON.stringify(rows[0]));
    });
    //connection.end();
});

app.post('/DayZServlet/lud0/create', function (req, res) {
    console.log('Got create: ' + req.query.uid);
	//connection.connect();
	
	connection.query('INSERT INTO player(uid) VALUES(?)', [req.query.uid], function (err, rows, fields) {
		if (err) throw err;

		res.send('');
	});
    //connection.end();
});

app.post('/DayZServlet/lud0/save', function (req, res) {
    console.log('Got save: ' + req.query.uid);
	//connection.connect();
	connection.query('UPDATE player SET model = ?, alive = ?, items = ?, state = ?, x = ?, y = ?, z = ?, dir_x = ?, dir_y = ?, dir_z = ?, up_0 = ?, up_1 = ?, up_2 = ? WHERE uid = ?',
	[req.body.model, req.body.alive, JSON.stringify(req.body.items), JSON.stringify(req.body.state), req.body.pos[0], req.body.pos[1], req.body.pos[2], req.body.dir[0], req.body.dir[1], req.body.dir[2], req.body.up[0], req.body.up[1], req.body.up[2], req.query.uid], function (err, rows, fields) {
		if (err) throw err;

		res.send('');
	});
    //connection.end();
});

app.post('/DayZServlet/lud0/queue', function (req, res) {
    console.log('Got queue: ' + req.query.uid + ' (' + req.body.queue + 's)');
	//connection.connect();
	connection.query('UPDATE player SET queue = ? WHERE uid = ?', [-req.body.queue, req.query.uid], function (err, rows, fields) {
		if (err) throw err;

		res.send('');
	});
    //connection.end();
});

app.post('/DayZServlet/lud0/kill', function (req, res) {
    console.log('Got kill: ' + req.query.uid);
	//connection.connect();
	connection.query('DELETE FROM player WHERE uid = ?', [req.query.uid], function (err, rows, fields) {
		if (err) throw err;

		res.send('');
	});
    //connection.end();
});

app.post(/.*/, function (req, res) {
    console.log('Got unhandled POST: ' + req.url);
	res.send('404 not found');
});

app.get(/.*/, function (req, res) {
    console.log('Got unhandled GET: ' + req.url);
	res.send('404 not found');
});