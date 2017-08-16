var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function getInitialState() {
		return { roundNo: 0 };
	},
	render: function render() {
		return <span>Round: {this.props.roundNo}</span>
	}
});
