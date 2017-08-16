function rotate(x, len) {
	var result = [];

	for(var row=0; row<len; row++)
		result[row] = [];

	for(var row=0; row<len; row++) {
		var k = len - 1 - row;

		for(var col=0; col<len; col++) {
			result[col][k] = x[row][col];
		}
	}

	return result;
}

function listRotations(x) {
	var matrixes = [];
	var size = x.length;

	for(var i=0; i<4; i++) {
		var xRotated = x.slice(0);
		
		for(var j=0; j<i; j++) {
			xRotated = rotate(xRotated, size);
		}

		matrixes[i] = xRotated;
	}

	return matrixes;
}


var blocks = {
	O: {
		type: 'O',
		size: 2,
		tiles: [[
			[1,1],
			[1,1]
		]]
	},
	I: {
		type: 'I',
		size: 4,
		tiles: listRotations([
			[0,0,0,0],
			[1,1,1,1],
			[0,0,0,0],
			[0,0,0,0]
		])
	},
	T: {
		type: 'T',
		size: 3,
		tiles: listRotations([
			[0,1,0],
			[1,1,1],
			[0,0,0]
		])
	},
	L: {
		type: 'L',
		size: 3,
		tiles: listRotations([
			[0,0,1],
			[1,1,1],
			[0,0,0]
		])
	},
	J: {
		type: 'J',
		size: 3,
		tiles: listRotations([
			[1,0,0],
			[1,1,1],
			[0,0,0]
		])
	},
	S: {
		type: 'S',
		size: 3,
		tiles: listRotations([
			[0,1,1],
			[1,1,0],
			[0,0,0],
		])
	},
	Z: {
		type: 'Z',
		size: 3,
		tiles: listRotations([
			[1,1,0],
			[0,1,1],
			[0,0,0],
		])
	}
};

module.exports = blocks;
