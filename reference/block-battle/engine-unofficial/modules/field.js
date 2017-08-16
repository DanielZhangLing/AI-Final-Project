var React = require('react');
var ReactDOM = require('react-dom');
var settings = require('../settings');
var config = require('../config');

module.exports = React.createClass({
	componentDidMount: function() {
		var context = ReactDOM.findDOMNode(this).getContext('2d');
		this.paint(context);
	},
	componentDidUpdate: function() {
		var context = ReactDOM.findDOMNode(this).getContext('2d');
		this.paint(context);
	},
	paint: function(context) {
		context.save();

		if(this.props.tiles !== undefined) {
			var colors;

			this.props.tiles.forEach(function(row, rowIndex) {
				row.forEach(function(tile, colIndex) {
					colors = config.tileColors[tile];

					context.fillStyle = colors[(rowIndex + colIndex) % colors.length];

					context.fillRect(
						colIndex * config.TILE_LEN,
						rowIndex * config.TILE_LEN,
						config.TILE_LEN, config.TILE_LEN
					);
				});
			});
		}

		context.restore();
	},
	render: function() {
		return <canvas width={settings.field_width * config.TILE_LEN} height={settings.field_height * config.TILE_LEN} />
	}
});
