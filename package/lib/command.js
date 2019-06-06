'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.builder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.commandNameFromClassName = commandNameFromClassName;

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _workspaceConfig = require('./workspace-config');

var _workspaceConfig2 = _interopRequireDefault(_workspaceConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var builder = exports.builder = {
	"loglevel": {
		defaultDescription: "info",
		describe: "What level of logs to report.",
		type: "string"
	}
};

var Command = function () {
	function Command(input, flags, cwd) {
		_classCallCheck(this, Command);

		_npmlog2.default.pause();
		_npmlog2.default.heading = "kaltura-ng-workspace";

		if (flags.loglevel) {
			_npmlog2.default.level = flags.loglevel;
		}

		this.input = input;
		this._flags = flags;

		_npmlog2.default.silly("input", input);

		this.logger = _npmlog2.default.newGroup(this.name);

		_npmlog2.default.resume();

		this.workspace = new _workspaceConfig2.default();

		_npmlog2.default.silly("options", this.options);
	}

	_createClass(Command, [{
		key: 'run',
		value: function run() {
			return regeneratorRuntime.async(function run$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.prev = 0;
							_context.next = 3;
							return regeneratorRuntime.awrap(this.workspace.load());

						case 3:
							this.runCommand();
							_context.next = 10;
							break;

						case 6:
							_context.prev = 6;
							_context.t0 = _context['catch'](0);

							console.log(_context.t0);
							process.exit(1);

						case 10:
						case 'end':
							return _context.stop();
					}
				}
			}, null, this, [[0, 6]]);
		}
	}, {
		key: 'name',
		get: function get() {
			// For a class named "FooCommand" this returns "foo".
			return commandNameFromClassName(this.className);
		}
	}, {
		key: 'className',
		get: function get() {
			return this.constructor.name;
		}
	}, {
		key: 'options',
		get: function get() {
			if (!this._options) {
				this._options = _lodash2.default.defaults({},
				// CLI flags, which if defined overrule subsequent values
				this._flags);
			}

			return this._options;
		}
	}]);

	return Command;
}();

exports.default = Command;
function commandNameFromClassName(className) {
	return className.replace(/Command$/, "").toLowerCase();
}