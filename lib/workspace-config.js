"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _findNodeModules = require("find-node-modules");

var _findNodeModules2 = _interopRequireDefault(_findNodeModules);

var _readPkg = require("read-pkg");

var _readPkg2 = _interopRequireDefault(_readPkg);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _semver = require("semver");

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objectAssignDeep = require("object-assign-deep");

var repositoryUriPattern = new RegExp('(https:[/][/]github.com[/].*?[/](.*?)[.]git)(?:#(.*))?$', 'i');

var WorkspaceConfig = function () {
  function WorkspaceConfig() {
    _classCallCheck(this, WorkspaceConfig);
  }

  _createClass(WorkspaceConfig, [{
    key: "load",
    value: function load() {
      var vwsJsonPath;
      return regeneratorRuntime.async(function load$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              vwsJsonPath = _findUp2.default.sync("vidiun-ws.json", { cwd: process.cwd() });

              if (vwsJsonPath) {
                _context.next = 5;
                break;
              }

              _npmlog2.default.error("file 'vidiun-ws.json' is missing, aborting command.");
              process.exit(1);
              return _context.abrupt("return");

            case 5:

              this.vwsVersion = require("../package.json").version;

              this.rootPath = _path2.default.dirname(vwsJsonPath);
              _npmlog2.default.verbose("rootPath", this.rootPath);
              this._vwsJsonPath = vwsJsonPath;
              this._vwsConfig = _loadJsonFile2.default.sync(vwsJsonPath);
              _npmlog2.default.silly('vidiun-ws', this._vwsConfig);

              this.version = this._vwsConfig.version;
              this.licenses = this._vwsConfig.licenses || null;

              _npmlog2.default.verbose("checking competability of vws version " + this.vwsVersion + " with config version " + this.version);
              if (!_semver2.default.satisfies(this.vwsVersion, "^" + this.version)) {
                _npmlog2.default.error("Major version mismatch: The current version '@vidiun-ng/dev-workspace' is " + this.vwsVersion + ", but the version in 'vidiun-ws.json' is " + this.version + ". You can either update your json file or install '@vidiun-ng/dev-workspace@" + this.version + "'");
                process.exit(1);
              }

              _context.next = 17;
              return regeneratorRuntime.awrap(this._loadRepositories());

            case 17:
              this._createLernaJsonFile();

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getVWSCommandValue",
    value: function getVWSCommandValue(path) {
      return ("commands." + path).split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined;
      }, this._vwsConfig);
    }
  }, {
    key: "updateVWSConfig",
    value: function updateVWSConfig(data) {
      objectAssignDeep(this._vwsConfig, data);
      _writeJsonFile2.default.sync(this._vwsJsonPath, this._vwsConfig, { indent: 2 });
    }
  }, {
    key: "_loadRepositories",
    value: function _loadRepositories() {
      var _this = this;

      var repositories;
      return regeneratorRuntime.async(function _loadRepositories$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _npmlog2.default.verbose("extracting repositories list");

              repositories = [];
              _context3.next = 4;
              return regeneratorRuntime.awrap(Promise.all((this._vwsConfig.repositories || ['.']).map(function (repositoryData) {
                return new Promise(function _callee(resolve, reject) {
                  var repoPath, pkgData, repoName, repoLernaFilePath, isMonoRepo, repoPackages;
                  return regeneratorRuntime.async(function _callee$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _npmlog2.default.silly('repositoryData', repositoryData);
                          repoPath = null;

                          if (!(typeof repositoryData === 'string')) {
                            _context2.next = 6;
                            break;
                          }

                          repoPath = _path2.default.resolve(_this.rootPath, repositoryData);
                          _context2.next = 20;
                          break;

                        case 6:
                          if (!(repositoryData.origin && ['fs', 'github'].indexOf(repositoryData.origin))) {
                            _context2.next = 18;
                            break;
                          }

                          _context2.t0 = repositoryData.origin;
                          _context2.next = _context2.t0 === 'fs' ? 10 : _context2.t0 === 'github' ? 12 : 16;
                          break;

                        case 10:
                          repoPath = _path2.default.resolve(_this.rootPath, repositoryData.path);
                          return _context2.abrupt("break", 16);

                        case 12:
                          _context2.next = 14;
                          return regeneratorRuntime.awrap(_this._loadGithubRepo(repositoryData.uri));

                        case 14:
                          repoPath = _context2.sent.repoPath;
                          return _context2.abrupt("break", 16);

                        case 16:
                          _context2.next = 20;
                          break;

                        case 18:
                          reject(new Error('repository list contains invalid value. ' + JSON.stringify(repositoryData)));
                          return _context2.abrupt("return");

                        case 20:

                          _npmlog2.default.silly('repoPath', repoPath);

                          if (!(repoPath && _fs2.default.existsSync(repoPath))) {
                            _context2.next = 32;
                            break;
                          }

                          pkgData = _readPkg2.default.sync(_path2.default.join(repoPath, 'package.json'), { normalize: false });
                          repoName = pkgData.name;
                          repoLernaFilePath = _path2.default.join(repoPath, 'lerna.json');
                          isMonoRepo = _fs2.default.existsSync(repoLernaFilePath);


                          _npmlog2.default.silly('isMonoRepo', isMonoRepo);

                          repoPackages = isMonoRepo ? _this._extractMonoRepoPackages(repoLernaFilePath) : [];


                          repositories.push({ name: repoName, path: repoPath, pkgData: pkgData, isMonoRepo: isMonoRepo, packages: repoPackages });
                          resolve();
                          _context2.next = 34;
                          break;

                        case 32:
                          reject(new Error('failed to get repository path'));
                          return _context2.abrupt("return");

                        case 34:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, null, _this);
                });
              })));

            case 4:

              this.repositories = repositories;

              _npmlog2.default.info("extracted " + repositories.length + " repositories");
              _npmlog2.default.silly('repositories', JSON.stringify(this.repositories, function (key, value) {
                return key !== 'pkgData' ? value : "{removed from log}";
              }, 2));

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_loadGithubRepo",
    value: function _loadGithubRepo(githubUri) {
      var repoGitUriToken, repoUri, repoName, repoDefaultBranch, repoPath, command;
      return regeneratorRuntime.async(function _loadGithubRepo$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              repoGitUriToken = repositoryUriPattern.exec(githubUri);

              if (!repoGitUriToken) {
                _context4.next = 11;
                break;
              }

              repoUri = repoGitUriToken[1];
              repoName = repoGitUriToken[2];
              repoDefaultBranch = repoGitUriToken.length >= 3 ? repoGitUriToken[3] : null;
              repoPath = _path2.default.join(this.rootPath, repoName);

              _npmlog2.default.silly('ff1');

              if (repoPath && _fs2.default.existsSync(repoPath)) {
                _npmlog2.default.info("repository folder '" + repoName + "' exists, skip creation of repository");
              } else {
                _npmlog2.default.info("git clone repository '" + repoName + "' from '" + repoUri + "'", { defaultBranch: repoDefaultBranch });

                command = ['git clone', repoDefaultBranch ? "-b " + repoDefaultBranch : '', repoUri, repoName];

                _npmlog2.default.silly("command", command.join(" "));
                _shelljs2.default.exec(command.join(" "));
              }

              return _context4.abrupt("return", { repoPath: repoPath });

            case 11:
              _npmlog2.default.error("repository with origin 'github' must have valid 'uri' property", githubUri);
              process.exit(1);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_extractMonoRepoPackages",
    value: function _extractMonoRepoPackages(repoLernaFilePath) {
      var result = [];
      _npmlog2.default.silly('repoLernaFilePath', repoLernaFilePath);
      if (_fs2.default.existsSync(repoLernaFilePath)) {
        var repoLernaJson = _loadJsonFile2.default.sync(repoLernaFilePath);
        _npmlog2.default.silly('repoLernaJson', repoLernaJson);

        var repoPath = _path2.default.dirname(repoLernaFilePath);
        var globOpts = {
          cwd: repoPath,
          strict: true,
          absolute: true,
          ignore: ["**/node_modules/**"]
        };

        repoLernaJson.packages.forEach(function (repoLernaJsonPackge) {
          var globPath = repoLernaJsonPackge;
          var globaSync = _glob2.default.sync(_path2.default.join(globPath, "package.json"), globOpts);
          for (var j = 0; j < globaSync.length; j++) {
            var globResult = globaSync[j];
            // https://github.com/isaacs/node-glob/blob/master/common.js#L104
            // glob always returns "\\" as "/" in windows, so everyone
            // gets normalized because we can't have nice things.
            var packageConfigPath = _path2.default.normalize(globResult);
            var packagePath = _path2.default.dirname(packageConfigPath);
            var packageName = _path2.default.relative(repoPath, packagePath);
            var pkgData = _readPkg2.default.sync(packageConfigPath, { normalize: false });

            result.push({ name: packageName, path: packagePath, pkgData: pkgData });
          }
        });
      }
      return result;
    }
  }, {
    key: "_createLernaJsonFile",
    value: function _createLernaJsonFile() {
      var tracker = _npmlog2.default.newItem('syncLernaJsonFile');
      var lernaJson = {
        "NOTICE": "This file is used internally by vidiun-ng-workspace. you should avoid using lerna cli directly",
        "lerna": "0.0.2",
        packages: [],
        "npmClient": "npm"
      };

      tracker.addWork(this.repositories.length);

      this.repositories.forEach(function (repo) {
        tracker.silly('repository', repo.name);

        if (repo.isMonoRepo) {
          repo.packages.forEach(function (repoPackage) {
            tracker.verbose("adding package to lerna packages", repoPackage.name);
            lernaJson.packages.push(repoPackage.path);
          });
        } else {
          tracker.verbose("adding repo to lerna packages", repo.path);
          lernaJson.packages.push(repo.path);
        }

        tracker.completeWork(1);
      });
      tracker.finish();

      this.lernaDirPath = _path2.default.resolve(__dirname, "../");
      _npmlog2.default.silly("lernaDirPath", this.lernaDirPath);

      _npmlog2.default.verbose('creating file lerna.json. This file is used internally by vidiun-ng-workspace. you should avoid using lerna cli directly.');
      _npmlog2.default.verbose('new file lerna.json content', lernaJson);
      _writeJsonFile2.default.sync(_path2.default.join(this.lernaDirPath, 'lerna.json'), lernaJson, { indent: 2 });
    }
  }, {
    key: "runShellCommand",
    value: function runShellCommand(command, silent) {
      return regeneratorRuntime.async(function runShellCommand$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", new Promise(function (resolve, reject) {
                _npmlog2.default.info("running shell command " + command);
                _shelljs2.default.exec(command, { silent: silent }, function (code, stdout, stderr) {

                  _npmlog2.default.silly("shell exit code " + code);
                  _npmlog2.default.silly("shell stdout", stdout);
                  _npmlog2.default.silly("shell stderr", stderr);

                  if (code === 0) {
                    resolve(stdout);
                  } else {
                    reject(stderr);
                  }
                });
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "runLernaCommand",
    value: function runLernaCommand(lernaArgs) {

      var customLernaPath = _path2.default.resolve(__dirname, '../');

      _npmlog2.default.silly('lernaArgs', lernaArgs);

      var lernaPackagePaths = (0, _findNodeModules2.default)({
        cwd: customLernaPath,
        searchFor: 'node_modules/lerna'
      });

      if (lernaPackagePaths && lernaPackagePaths.length) {
        var lernaScriptPath = _path2.default.join(lernaPackagePaths[0], 'bin/lerna');
        _npmlog2.default.silly('lernaScriptPath', lernaScriptPath);
        _shelljs2.default.pushd(customLernaPath);
        try {
          _shelljs2.default.exec("node " + lernaScriptPath + " " + lernaArgs + " --loglevel=" + _npmlog2.default.level);
        } catch (err) {
          _shelljs2.default.popd;
          throw err;
        }
      } else {
        throw new Error("failed to find valid 'lerna' package installation");
      }
    }
  }]);

  return WorkspaceConfig;
}();

exports.default = WorkspaceConfig;
module.exports = exports["default"];