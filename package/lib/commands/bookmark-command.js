#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.description = exports.command = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _command = require('../command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function handler(argv) {
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(new BookmarkCommand([argv.name].concat(_toConsumableArray(argv.args)), argv).run());

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = 'bookmark <name> [args...]';

var description = exports.description = 'git checkout to specified bookmark';

var builder = exports.builder = {
  "update": {
    group: "Command Options:",
    describe: "Update bookmark commit id to the latest commit.",
    type: "boolean",
    default: false
  }
};

var BookmarkCommand = function (_Command) {
  _inherits(BookmarkCommand, _Command);

  function BookmarkCommand() {
    _classCallCheck(this, BookmarkCommand);

    return _possibleConstructorReturn(this, (BookmarkCommand.__proto__ || Object.getPrototypeOf(BookmarkCommand)).apply(this, arguments));
  }

  _createClass(BookmarkCommand, [{
    key: 'runCommand',
    value: function runCommand() {
      var latestCommitId, bookmarkCommitId, hasUnCommitedChanges;
      return regeneratorRuntime.async(function runCommand$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:

              this.bookmarkName = this.input[0];
              this.args = this.input.slice(1);

              _context2.prev = 2;

              if (!this.options.update) {
                _context2.next = 13;
                break;
              }

              _npmlog2.default.info('updating bookmark ' + this.bookmarkName + ' to the latest commit in local repo');
              _context2.next = 7;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git log --format="%H" -n 1'));

            case 7:
              latestCommitId = _context2.sent;

              latestCommitId = latestCommitId.match(/^[a-f0-9]{7,40}/);
              _npmlog2.default.verbose('commit id ' + latestCommitId);

              this.workspace.updateKWSConfig({ commands: { bookmark: _defineProperty({}, this.bookmarkName, latestCommitId) } });

              _context2.next = 27;
              break;

            case 13:
              _npmlog2.default.info('git checkout to stored commit of bookmark named ' + this.bookmarkName);

              bookmarkCommitId = this.workspace.getKWSCommandValue('bookmark.' + this.bookmarkName);


              if (!bookmarkCommitId) {
                _npmlog2.default.error('couldn\'t find bookmark named ' + this.bookmarkName + '.');
                process.exit(1);
              }

              _npmlog2.default.silly("bookmark commit id", bookmarkCommitId);

              _context2.next = 19;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git status -s', true));

            case 19:
              hasUnCommitedChanges = !!_context2.sent;

              _npmlog2.default.silly("hasUnCommitedChanges", hasUnCommitedChanges);

              if (!hasUnCommitedChanges) {
                _context2.next = 25;
                break;
              }

              _npmlog2.default.warn('it seems that you have uncommited changes. to perform this command you should either commit your chnages or reset them. aborting command');
              _context2.next = 27;
              break;

            case 25:
              _context2.next = 27;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git checkout ' + bookmarkCommitId, false));

            case 27:
              _context2.next = 33;
              break;

            case 29:
              _context2.prev = 29;
              _context2.t0 = _context2['catch'](2);

              _npmlog2.default.error(_context2.t0);
              process.exit(1);

            case 33:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this, [[2, 29]]);
    }
  }]);

  return BookmarkCommand;
}(_command2.default);

exports.default = BookmarkCommand;