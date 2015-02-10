var React = require('react');

var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.node
  },
  render: function() {
    return React.createElement('iframe', this.props);
  },
  componentDidMount: function() {
    this.renderFrameContents();
    // Ensure the frame doesnt scroll if it grows.
    this._autogrow = setInterval(this.autoGrow, 200);
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
      React.render(contents, doc.body, this.autoGrow);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  },
  autoGrow: function() {
    // Automatically update height to prevent scrollbars
    if (this.isMounted()) {
      var frame = this.getDOMNode();
      var doc = frame.contentDocument;
      setTimeout(function() {
        doc.body.style.margin = 0;
        doc.body.style.padding = 0;
        // Give it a bit of padding, to handle browser differences.
        var height = doc.body.firstChild.offsetHeight + 30;
        frame.style.height = height + "px";
      }, 10);
    } else {
      // We're not mounted. Stop polling
      if (this._autogrow) clearInterval(this._autogrow);
    }
  },
});


module.exports = Frame;
