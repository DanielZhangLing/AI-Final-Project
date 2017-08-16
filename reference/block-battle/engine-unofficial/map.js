var pub = {};
var shapes = require('./blocks');
var TILE = require('./tiles');
var CLEARS = require('./clears');

var field;
var fieldSize;
var curShape;
var curPosX;
var curPosY;
var curRotation;

pub.init = function(size) {
	field = [];

	for (var row = 0; row < size.height; row ++) {
		field[row] = [];

		for (var col = 0; col < size.width; col ++) {
			field[row][col] = TILE.EMPTY;
		}
	}

	fieldSize = size;
};

pub.getField = function() {
	var result = [];

	for (var row = 0; row < fieldSize.height; row ++) {
		result[row] = [];

		for (var col = 0; col < fieldSize.width; col ++) {
			result[row][col] = field[row][col];
		}
	}

	var curTiles = curShape.tiles[curRotation];

	for (var row = 0; row < curShape.size; row ++) {
		var targetRow = row + curPosY;

		if (targetRow < 0 || targetRow >= fieldSize.height) {
			continue;
		}

		for (var col = 0; col < curShape.size; col ++) {
			var targetCol = col + curPosX;

			if (targetCol >= 0 && targetCol < fieldSize.width && curTiles[row][col] === 1) {
				result[targetRow][targetCol] = TILE.SHAPE;
			}
		}
	}

	return result;
};

function drawShapeOnField() {
	var tiles = curShape.tiles[curRotation];

	for (var row = 0; row < curShape.size; row ++) {
		for (var col = 0; col < curShape.size; col ++) {
			if (tiles[row][col] == 1) {
				field[curPosY + row][curPosX + col] = TILE.FILLED;
			}
		}
	}
}

function getClearType() {
	var clears = 0;

	for (var row = curPosY; row < curPosY + curShape.size; row ++) {
		if (row >= fieldSize.height) {
			break;
		}

		var isRowCleared = true;

		for (var col = 0; col < fieldSize.width; col ++) {
			if (field[row][col] != TILE.FILLED) {
				isRowCleared = false;
				break;
			}
		}

		if (isRowCleared) {
			clears ++;

			for (var row2 = row -1; row2 >= 0; row2 --) {
				field [row2 +1] = field[row2];
			}
			
			field[0] = [];
			for (var col=0; col <fieldSize.width; col ++)
				field[0][col] = TILE.EMPTY;
		}
	}

	return clears;
}

function checkIsClear(field, rowStart, colStart, subField) {
	var subFieldLen = subField.length;

	for (var row = 0; row < subFieldLen; row ++) {
		for (var col = 0; col < subFieldLen; col ++) {
			if (subField[row][col] == 1) {
				var targetRow = row + rowStart;
				var targetCol = col + colStart;

				if (targetRow >= fieldSize.height ||
					targetCol < 0 ||
					targetCol >= fieldSize.width ||
					(targetRow >= 0 && field[targetRow][targetCol] >= TILE.FILLED)
				) {
					return false;
				}
			}
		}
	}

	return true;
}

var moves = {
	turnright: function() {
		var nextRotation = (curRotation + 1) % 4;
		if (checkIsClear(field, curPosY, curPosX, curShape.tiles[nextRotation])) {
			curRotation = nextRotation;
		}
	},
	turnleft: function() {
		var nextRotation = (curRotation + 3) % 4;
		if (checkIsClear(field, curPosY, curPosX, curShape.tiles[nextRotation])) {
			curRotation = nextRotation;
		}
	},
	down: function() {
		if (checkIsClear(field, curPosY + 1, curPosX, curShape.tiles[curRotation])) {
			curPosY ++;
		}
	},
	drop: function() {
		while (checkIsClear(field, curPosY + 1, curPosX, curShape.tiles[curRotation])) {
			curPosY ++;
		}
	},
	left: function() {
		if (checkIsClear(field, curPosY, curPosX - 1, curShape.tiles[curRotation])) {
			curPosX --;
		}
		else {
			moves.down();
		}
	},
	right: function() {
		if (checkIsClear(field, curPosY, curPosX + 1, curShape.tiles[curRotation])) {
			curPosX ++;
		} else {
			moves.down();
		}
	}
};

pub.doMove = function(move) {
	var fun = moves[move];

	if (!fun)
		fun = down;

	fun();
};

pub.isRoundOver = function() {
	return ! checkIsClear(field, curPosY + 1, curPosX, curShape.tiles[curRotation]);
}

pub.startRound = function(shape) {
	var result = true;

	if (curShape !== undefined) {
		if (curPosY < 0) {
			//game over
			return false;
		}

		drawShapeOnField();

		var clear = getClearType();

		if (clear > 0) {
			result = {
				clear: CLEARS[clear]
			};
		}
	}

	curShape = shapes[shape];
	curPosX = 4;
	curPosY = -1;
	curRotation = 0;

	return result;
};

pub.addJunkRow = function() {
	var gameOver = field[0].filter(function(it) {
		return it >= TILE.SHAPE;
	}).length > 0;

	var lastRowNo = fieldSize.height - 1;

	for (var row = 0; row < lastRowNo; row ++) {
		field[row] = field[row + 1];
	}

	field[lastRowNo] = [];

	for (var col = 0; col < fieldSize.width; col ++) {
		field[lastRowNo][col] = TILE.JUNK;
	}

	return gameOver;
};

pub.addBadRows = function(count) {
	var gameOver = field.some(function(row, rowIndex) {
		return rowIndex < count && row.some(function(tile) {
			return tile >= TILE.SHAPE;
		});
	});

	var junkStartRow = fieldSize.height - (function(field) {
		var count = 0;

		for (var row = fieldSize.height - 1; row >= 0 && field[row][0] == TILE.JUNK; row --)
			count ++;

		return count;
	})(field);

	for (var row = count; row < junkStartRow; row ++)
		field[row - count] = field[row];

	for (var row = junkStartRow - count; row < junkStartRow; row ++) {
		var newRow = [];

		for (var col = 0; col < fieldSize.width; col ++)
			newRow[col] = TILE.FILLED;

		var numHolesOpened = 0;
		while (numHolesOpened < 2) {
			var holeIndex = Math.floor(Math.random() * fieldSize.width);

			if (newRow[holeIndex] != TILE.EMPTY) {
				newRow[holeIndex] = TILE.EMPTY;
				numHolesOpened ++;
			}
		};
		
		field[row] = newRow;
	}
	
	return gameOver;
};

module.exports = pub;
