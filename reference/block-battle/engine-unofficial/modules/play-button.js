var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

//TODO the play button will be stuck on play when game is over

module.exports = React.createClass({
	getInitialState: function getInitialState() {
		return { isPlaying: false };
	},
	onClick: function() {
		if (this.state.isPlaying != true) {
			this.setState({
				timer: setInterval(function() {
					ipc.send('engine/next_frame', null);
				}, 100),
				isPlaying:true 
			});
		}
		else {
			clearInterval(this.state.timer);

			this.setState({
				timer: undefined,
				isPlaying: false
			});
		}
	},
	render: function render() {
		return <button onClick={this.onClick}>{this.state.isPlaying ? 'Pause' : 'Play'}</button>;
	}
});
