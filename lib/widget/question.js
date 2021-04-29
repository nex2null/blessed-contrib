/**
 * question.js - question element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var blessed = require('blessed')
  , Node = blessed.Node
  , Box = blessed.Box
  , Button = blessed.Button;

/**
* Question
*/

function Question(options) {
  if (!(this instanceof Node)) {
    return new Question(options);
  }

  var self = this;

  options = options || {};
  options.hidden = true;

  Box.call(this, options);

  var okayText = options.okayText || 'Okay';
  this._.okay = new Button({
    screen: this.screen,
    parent: this,
    top: 2,
    height: 1,
    left: 2,
    width: okayText.length + 2,
    content: okayText,
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    style: {
      focus: {
        bg: 'green'
      }
    }
  });

  var cancelText = options.cancelText || 'Cancel';
  this._.cancel = new Button({
    screen: this.screen,
    parent: this,
    top: 2,
    height: 1,
    shrink: true,
    left: okayText.length + 6,
    width: cancelText.length + 2,
    content: cancelText,
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    style: {
      focus: {
        bg: 'red'
      }
    }
  });
}

Question.prototype.__proto__ = Box.prototype;

Question.prototype.type = 'question';

Question.prototype.ask = function (text, callback) {

  if (this.visible)
    return;

  var self = this;
  var press, okay, cancel;

  // Keep above:
  this.setFront();

  this.show();
  this.setContent(' ' + text);

  this.onScreenEvent('keypress', press = function (ch, key) {
    if (key.name === 'left') {
      self._.okay.focus();
      return;
    }
    if (key.name === 'right') {
      self._.cancel.focus();
      return;
    }
  });

  this._.okay.on('press', okay = function () {
    done(null, true);
  });

  this._.cancel.on('press', cancel = function () {
    done(null, false);
  });

  this.screen.saveFocus();
  this.focus();

  function done(err, data) {
    self.hide();
    self.screen.restoreFocus();
    self.removeScreenEvent('keypress', press);
    self._.okay.removeListener('press', okay);
    self._.cancel.removeListener('press', cancel);
    return callback(err, data);
  }

  this.screen.render();
};

/**
* Expose
*/

module.exports = Question;
