#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = exports.command = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _command = require('../command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function handler(argv) {
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(new CleanCommand(argv._, argv).run());

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = 'clean';

var description = exports.description = 'Remove the node_modules directory from all packages.';

var CleanCommand = function (_Command) {
  _inherits(CleanCommand, _Command);

  function CleanCommand() {
    _classCallCheck(this, CleanCommand);

    return _possibleConstructorReturn(this, (CleanCommand.__proto__ || Object.getPrototypeOf(CleanCommand)).apply(this, arguments));
  }

  _createClass(CleanCommand, [{
    key: 'runCommand',
    value: function runCommand() {
      var _this2 = this;

      return regeneratorRuntime.async(function runCommand$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.workspace.runLernaCommand('clean --yes');

              this.workspace.repositories.filter(function (repository) {
                return repository.isMonoRepo;
              }).forEach(function (repository) {
                var repoModulesPath = _path2.default.join(repository.path, 'node_modules');
                _this2.logger.info('removing ' + repoModulesPath);
                _shelljs2.default.rm('-rf', _path2.default.join(repository.path, 'node_modules'));
              });

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return CleanCommand;
}(_command2.default);

exports.default = CleanCommand;