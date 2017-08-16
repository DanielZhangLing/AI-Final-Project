var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var RoundIndicator = require('./modules/round-indicator');
var Player = require('./modules/player');
var TextArea = require('./modules/text-area');
var PlayButton = require('./modules/play-button');
var settings = require('./settings');
var playerDatas = require('./playerDatas');

var debugs = [];
var MAX_DEBUGS = 10000;

function drawPlayer(name) {
	ReactDOM.render(
		React.createElement(Player, playerDatas.getPlayer(name)),
		document.getElementById('player1-container')
	);
};

ipc.on('cmd/settings', function(values) {
	settings.set('field_width', values.field_size.width);
	settings.set('field_height', values.field_size.height);

	values.player_names.forEach(function(name) {
		playerDatas.createPlayer(name);
	});

	ReactDOM.render(
		React.createElement(PlayButton, {callback: nextFrameClicked}),
		document.getElementById('playButtonContainer')
	);
});

ipc.on('cmd/update', function(values) {
	if (values.common) {
		playerDatas.setAllPlayers(values.common);

		if (values.common.round) {
			ReactDOM.render(
				React.createElement(RoundIndicator, {roundNo: values.common.round}),
				document.getElementById('roundLabel')
			);
		}
	}

	for (var name in values.players) {
		playerDatas.setPlayer(name, values.players[name]);
		drawPlayer(name);
	}

});

ipc.on('cmd/debug', function(text) {
	if (text === ' clear') {
		debugs = [];
		return;
	}

	debugs.push(text);

	if(debugs.length > MAX_DEBUGS) {
		debugs.shift();
	}

	ReactDOM.render(
		React.createElement(TextArea, {texts: debugs}),
		document.getElementById('debugTextArea')
	);
});

ipc.on('cmd/gameover', function() {
	//TODO show gameover overlay
});

function nextRoundClicked() {
	ipc.send('engine/next_round', null);
};

function badRowClicked() {
	ipc.send('engine/add_bad_row', null);
};

function nextFrameClicked() {
	ipc.send('engine/next_frame', null);
}

function debugField() {
	var str = "";
	playerDatas.getPlayerNames().forEach(function(name) {
		var data = playerDatas.getPlayer(name);

		if (data.field) {
			str += (name + ":\n[\n");
			str += (playerDatas.getPlayer(name).field.map(function(it) {
				return '\t[' + it.join(',') + ']';
			}).join(',\n'));
			str += ('\n]\n');
		}
	});
	alert("Fields for players:\n\n" + str);
}

/* init */
ipc.send('engine/start', null);
