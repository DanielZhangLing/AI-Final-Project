var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function getInitialState() {
		return { texts: ["lines your bot outputs starting with # appear here"] };
	},
	render: function render() {
		return (<div>{
			this.props.texts.map(function(text, index) {
				return <div key={index}>{text}</div>
			})
		}</div>);
	}
});
