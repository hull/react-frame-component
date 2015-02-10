var React = require('react');

var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.node
  },
  render: function () {
    // Memoize the frame to avoid breaking virtual tree when re-rendering it
    // Works as long as you don't update the props for this frame.
    if(!this.frame){this.frame = React.createElement('iframe', this.props);}
    return this.frame;
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = this.getDOMNode().contentDocument;
    if(doc && doc.readyState === 'complete') {
      var contents = React.createElement('div',
        undefined,
        this.props.head,
        this.props.children
      );

      React.render(contents, doc.body);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});


module.exports = Frame;
