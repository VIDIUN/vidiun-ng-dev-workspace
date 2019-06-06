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

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

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
          return regeneratorRuntime.awrap(new SetupCommand(argv._, argv).run());

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = 'setup';

var description = exports.description = 'setup dev environment';

var builder = exports.builder = {
  "clean": {
    group: "Command Options:",
    describe: "Delete node_modules of packages before running the setup",
    type: "boolean",
    defaultDescription: false
  },
  "build": {
    group: "Command Options:",
    describe: "Build packages once setup is completed",
    type: "boolean",
    default: true
  }
};

var SetupCommand = function (_Command) {
  _inherits(SetupCommand, _Command);

  function SetupCommand() {
    _classCallCheck(this, SetupCommand);

    return _possibleConstructorReturn(this, (SetupCommand.__proto__ || Object.getPrototypeOf(SetupCommand)).apply(this, arguments));
  }

  _createClass(SetupCommand, [{
    key: 'runCommand',
    value: function runCommand() {
      var _this2 = this;

      return regeneratorRuntime.async(function runCommand$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:

              if (this.options.clean) {
                _npmlog2.default.info("delete packages 'node_modules' folder");
                this.workspace.runLernaCommand('clean');

                // TODO consider executing the clean command instead of having duplicated code
                this.workspace.repositories.filter(function (repository) {
                  return repository.isMonoRepo;
                }).forEach(function (repository) {
                  var repoModulesPath = path.join(repository.path, 'node_modules');
                  _this2.logger.info('removing ' + repoModulesPath);
                  _shelljs2.default.rm('-rf', path.join(repository.path, 'node_modules'));
                });
              }

              _npmlog2.default.info("setup your workspace (this action might take several minutes)");
              this.workspace.repositories.filter(function (repository) {
                return repository.isMonoRepo;
              }).forEach(function (repository) {
                _npmlog2.default.info('install dependencies in \'' + repository.name + '\' mono repository root folder');
                _shelljs2.default.exec('npm install', { cwd: repository.path });
              });

              _npmlog2.default.info("bootstrap repositories dependencies (this action might take several minutes)");
              this.workspace.runLernaCommand('bootstrap --nohoist');

              if (this.options.build) {
                this.workspace.runLernaCommand('run build');
              }

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return SetupCommand;
}(_command2.default);

exports.default = SetupCommand;