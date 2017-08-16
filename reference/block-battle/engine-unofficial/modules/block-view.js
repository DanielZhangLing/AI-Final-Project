var React = require('react');
var ipc = require('ipc');

var SHAPE_IMAGES = {
	O: './img/O.png',
	I: './img/I.png',
	L: './img/L.png',
	J: './img/J.png',
	T: './img/T.png',
	Z: './img/Z.png',
	S: './img/S.png'
};

module.exports = React.createClass({
	getInitialState: function() {
		return {shape: 'X'};
	},
	render: function() {
		return (
			<img src={SHAPE_IMAGES[this.props.shape]}></img>
		);
	}
});
