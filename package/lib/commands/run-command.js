#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.description = exports.command = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _loadJsonFile = require("load-json-file");

var _loadJsonFile2 = _interopRequireDefault(_loadJsonFile);

var _npmlog = require("npmlog");

var _npmlog2 = _interopRequireDefault(_npmlog);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _findUp = require("find-up");

var _findUp2 = _interopRequireDefault(_findUp);

var _writeJsonFile = require("write-json-file");

var _writeJsonFile2 = _interopRequireDefault(_writeJsonFile);

var _command = require("../command");

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function handler(argv) {
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new RunCommand([argv.script].concat(_toConsumableArray(argv.args)), argv).run());

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = "run <script> [args..]";

var description = exports.description = 'Run an npm script in each package that contains that script.';

var builder = exports.builder = {};

var RunCommand = function (_Command) {
  _inherits(RunCommand, _Command);

  function RunCommand() {
    _classCallCheck(this, RunCommand);

    return _possibleConstructorReturn(this, (RunCommand.__proto__ || Object.getPrototypeOf(RunCommand)).apply(this, arguments));
  }

  _createClass(RunCommand, [{
    key: "runCommand",
    value: function runCommand() {
      return regeneratorRuntime.async(function runCommand$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:

              this.script = this.input[0];
              this.args = this.input.slice(1);

              if (this.script) {
                _context2.next = 4;
                break;
              }

              throw new Error("You must specify which npm script to run.");

            case 4:

              this.workspace.runLernaCommand("run " + [this.script].concat(this.args).join(" "));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return RunCommand;
}(_command2.default);

exports.default = RunCommand;