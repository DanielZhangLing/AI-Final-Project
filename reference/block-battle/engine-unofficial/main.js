var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var readline = require('readline');

var map = require('./map');

require('crash-reporter').start();

var mainWindow = null;

var isGameover = false;
var expectingInput = true;
var roundNo = 0;
var nextShape;
var movesQueue = [];
var numBadRowsToAdd = 0;
var score = {points: 0, combo: 0, skip: 0};
var timebank;

var config = {
	junkRowPeriod: 50,
	fieldSize: { width: 10, height: 20 },
	timebank: 10000,
	timePerMove: 1,
	playerNames: ['player1', 'player2']
};

function sendMsg(topic, payload) {
	mainWindow.webContents.send(topic, payload);
}

var stdio = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getRandomShape() {
	var shapes = ['O', 'I', 'L', 'J', 'S', 'Z', 'T'];

	return shapes[Math.floor( Math.random() * (shapes.length) )];
}

function nextRound() {
	roundNo ++;

	var curShape = nextShape;
	nextShape = getRandomShape();

	var roundResult = map.startRound(curShape);

	if (roundResult) {
		var clear = roundResult.clear;

		if (clear) {
			score.points += clear.points + score.combo;
			
			if (clear.combo) {
				score.combo ++;
			}
		}
		else {
			score.combo = 0;
		}
	}
	else {
		//game over
		isGameover = true;
		sendMsg('cmd/gameover', null);
	}

	if ((roundNo % config.junkRowPeriod) == 0) {
		map.addJunkRow();
	}

	if (numBadRowsToAdd > 0) {
		map.addBadRows(numBadRowsToAdd);
		numBadRowsToAdd = 0;
	}

	sendMsg('cmd/update', {
		common: {
			round: roundNo,
			this_piece_type: curShape,
			next_piece_type: nextShape
		},
		players: {
			player1: {
				row_points: score.points,
				combo: score.combo,
				skip: score.skip,
				field: map.getField()
			}
		}
	});

	console.log('update game round ' + roundNo);
	console.log('update game this_piece_type ' + curShape);
	console.log('update game next_piece_type ' + nextShape);
	console.log('update game this_piece_position ' + [4, -1].join(','));

	config.playerNames.forEach(function(it) {
		console.log('update ' + it + ' row_points ' + score.points);
		console.log('update ' + it + ' combo ' + score.combo);
		console.log('update ' + it + ' skips ' + score.skip);
		console.log('update ' + it + ' field ' + map.getField().map(function(row) {
			return row.join(',');
		}).join(';'));
	});

	console.log('action moves ' + timebank);

	expectingInput = true;
}

function nextStep() {
	var move = movesQueue.shift();

	if (move === undefined && map.isRoundOver()) {
		nextRound();
	}
	else {
		map.doMove(move || 'down');

		sendMsg('cmd/update', {
			players: {
				player1: {
					field: map.getField()
				}
			}
		});
	}
}

function initEngine() {
	nextShape = getRandomShape();

	sendMsg('cmd/settings', {
		timebank: config.timebank,
		time_per_move: config.timePerMove,
		player_names: config.playerNames,
		field_size: config.fieldSize
	});

	console.log('settings timebank ' + config.timebank);
	console.log('settings time_per_move ' + config.time_per_move);
	console.log('settings player_names ' + config.playerNames.join(','));
	console.log('settings your_bot ' + 'player1');
	console.log('settings field_width ' + config.fieldSize.width);
	console.log('settings field_height ' + config.fieldSize.height);

	timebank = config.timebank;

	map.init(config.fieldSize);

	nextRound();
}

stdio.on('line', function(line) {
	expectingInput = false;

	if (isGameover)
		return;

	if (line.indexOf('#') == 0) {
		sendMsg('cmd/debug', line.substring(1));
	}
	else {
		movesQueue = line.split(',');

		timebank -= movesQueue.length * config.timePerMove;
	}
});

ipc.on('engine/start', function() {
	initEngine();
});

ipc.on('engine/next_round', function() {
	if (isGameover || expectingInput)
		return;
	//TODO
});

ipc.on('engine/next_frame', function() {
	if (isGameover || expectingInput)
		return;
	nextStep();
});

ipc.on('engine/add_bad_row', function() {
	numBadRowsToAdd ++;
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 640, height: 480});

	mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

	mainWindow.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
