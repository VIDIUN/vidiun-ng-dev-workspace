#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.description = exports.command = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _command = require('../command');

var _command2 = _interopRequireDefault(_command);

var _conventionalRecommendedBump = require('conventional-recommended-bump');

var _conventionalRecommendedBump2 = _interopRequireDefault(_conventionalRecommendedBump);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _conventionalChangelog = require('conventional-changelog');

var _conventionalChangelog2 = _interopRequireDefault(_conventionalChangelog);

var _fsAccess = require('fs-access');

var fsAccess = _interopRequireWildcard(_fsAccess);

var _showdown = require('showdown');

var _showdown2 = _interopRequireDefault(_showdown);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _core = require('@commitlint/core');

var _configAngular = require('@commitlint/config-angular');

var _findUp = require('find-up');

var _findUp2 = _interopRequireDefault(_findUp);

var _loadJsonFile = require('load-json-file');

var _loadJsonFile2 = _interopRequireDefault(_loadJsonFile);

var _writeJsonFile = require('write-json-file');

var _writeJsonFile2 = _interopRequireDefault(_writeJsonFile);

var _publishRelease = require('publish-release');

var _publishRelease2 = _interopRequireDefault(_publishRelease);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
          return regeneratorRuntime.awrap(new ReleaseCommand(argv._, argv).run());

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = 'release';

var description = exports.description = 'release the new version';

var builder = exports.builder = {
  'prepare': {
    group: 'Command Options:',
    describe: 'Preparing to release',
    type: 'boolean',
    default: true
  },
  'publish': {
    group: 'Command Options:',
    describe: 'Create release and push changes',
    type: 'boolean',
    default: true
  },
  'branch': {
    group: 'Command Options:',
    describe: 'Change target branch',
    type: 'string',
    default: 'master'
  },
  'raw-changelog': {
    group: 'Command Options:',
    describe: 'Raw HTML output',
    type: 'boolean',
    default: false
  },
  'gh-token': {
    group: 'Command Options:',
    describe: 'Github API OAuth Token',
    type: 'string'
  }
};

var ReleaseCommand = function (_Command) {
  _inherits(ReleaseCommand, _Command);

  function ReleaseCommand() {
    _classCallCheck(this, ReleaseCommand);

    return _possibleConstructorReturn(this, (ReleaseCommand.__proto__ || Object.getPrototypeOf(ReleaseCommand)).apply(this, arguments));
  }

  _createClass(ReleaseCommand, [{
    key: 'runCommand',
    value: function runCommand() {
      var currentBranch, pkg, version, changelog, commitsValidation, githubApiInfo, currentTag;
      return regeneratorRuntime.async(function runCommand$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.filesToUpdate = [];

              _context2.next = 3;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git symbolic-ref --short HEAD'));

            case 3:
              currentBranch = _context2.sent.trim();
              pkg = _loadJsonFile2.default.sync(_findUp2.default.sync('package.json', { cwd: process.cwd() }));
              version = pkg.version;
              changelog = void 0;


              if (this.options.branch !== currentBranch) {
                this.logger.error('Specified branch is different from active. Please checkout to specified branch or provide relevant branch name.');
                this.logger.error('Specified branch: ' + this.options.branch + '. Active branch: ' + currentBranch);
                process.exit(1);
              }

              if (!this.options.prepare) {
                _context2.next = 26;
                break;
              }

              this.logger.info('Prepare phase');
              _context2.next = 12;
              return regeneratorRuntime.awrap(this.ensureCommittedChanges());

            case 12:
              _context2.next = 14;
              return regeneratorRuntime.awrap(this.lintCommitsSinceLastRelease());

            case 14:
              commitsValidation = _context2.sent;

              if (!commitsValidation.result) {
                this.logger.warn('Those commits since last release is NOT tapping into conventional-commits. Consider following conventional-commits standard http://conventionalcommits.org/.');
                this.logger.warn(commitsValidation.invalidCommits);
              }

              _context2.next = 18;
              return regeneratorRuntime.awrap(this.getNewVersion(version));

            case 18:
              version = _context2.sent;


              this.updateConfigs(version);

              _context2.next = 22;
              return regeneratorRuntime.awrap(this.updateChangelog(version));

            case 22:
              changelog = _context2.sent;

              this.updateAppConfigVersion(version);
              _context2.next = 26;
              return regeneratorRuntime.awrap(this.commitChanges(version));

            case 26:
              if (!this.options.publish) {
                _context2.next = 49;
                break;
              }

              this.logger.info('Publish phase.');
              _context2.next = 30;
              return regeneratorRuntime.awrap(this.ensureCommittedChanges());

            case 30:
              _context2.next = 32;
              return regeneratorRuntime.awrap(this.getGithubApiInfo());

            case 32:
              githubApiInfo = _context2.sent;


              if (!githubApiInfo) {
                this.logger.error('failed to extract github api info. aborting');
                process.exit(1);
              }

              _context2.next = 36;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git describe --match="v?.?.?" --abbrev=0'));

            case 36:
              currentTag = _context2.sent;

              if (!_semver2.default.gt(version, currentTag)) {
                _context2.next = 48;
                break;
              }

              _context2.next = 40;
              return regeneratorRuntime.awrap(this.updateChangelogComponent(changelog));

            case 40:
              _context2.next = 42;
              return regeneratorRuntime.awrap(this.createTag(version));

            case 42:
              _context2.next = 44;
              return regeneratorRuntime.awrap(this.publish());

            case 44:
              _context2.next = 46;
              return regeneratorRuntime.awrap(this.createRelease(version, currentBranch));

            case 46:
              _context2.next = 49;
              break;

            case 48:
              this.logger.error('Current version (' + version + ') is less or equal than the last tag (' + currentTag + '). You need to bump version. Abort.');

            case 49:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getGithubApiInfo',
    value: function getGithubApiInfo() {
      var token, originUrl, _split$1$match$1$spli, _split$1$match$1$spli2, owner, repo;

      return regeneratorRuntime.async(function getGithubApiInfo$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              token = this.workspace.getVWSCommandValue('release.appConfig.githubToken') || this.options['gh-token'];

              if (token) {
                _context3.next = 4;
                break;
              }

              throw new Error('Github token is not provided. aborting');

            case 4:
              _context3.next = 6;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git remote -v'));

            case 6:
              originUrl = _context3.sent;
              _split$1$match$1$spli = (originUrl || '').split(' ')[1].match(/([^\/]+\/[^\/]+)[.]git/)[1].split('/'), _split$1$match$1$spli2 = _slicedToArray(_split$1$match$1$spli, 2), owner = _split$1$match$1$spli2[0], repo = _split$1$match$1$spli2[1];

              if (!(!owner || !repo)) {
                _context3.next = 10;
                break;
              }

              throw new Error('failed to extract owner/repo of origin');

            case 10:
              return _context3.abrupt('return', { token: token, owner: owner, repo: repo });

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3['catch'](0);

              this.logger.error('failed to create github api info with error ' + _context3.t0.message);
              return _context3.abrupt('return', null);

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[0, 13]]);
    }
  }, {
    key: 'createRelease',
    value: function createRelease(version, target) {
      var githubApiInfo, _getChangelogContent, content, lastReleaseChangelog, options;

      return regeneratorRuntime.async(function createRelease$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.getGithubApiInfo());

            case 2:
              githubApiInfo = _context4.sent;


              if (!githubApiInfo) {
                this.logger.error('failed to extract github api info. aborting');
                process.exit(1);
              }

              _getChangelogContent = this.getChangelogContent(), content = _getChangelogContent.content;
              lastReleaseChangelog = 'chore(release): ' + version;


              if (content) {
                lastReleaseChangelog = content.match(/<a name[\s\S]*?(?=<a name|$)/)[0] // last release section
                .replace(/<a name[\s\S]*?(\d{4}-\d{2}-\d{2}\))/, '') // remove header
                .trim();
              }

              options = {
                tag: 'v' + version,
                target_commitish: target,
                name: 'v' + version,
                notes: lastReleaseChangelog,
                token: githubApiInfo.token,
                owner: githubApiInfo.owner,
                repo: githubApiInfo.repo
              };
              return _context4.abrupt('return', new Promise(function (resolve, reject) {
                (0, _publishRelease2.default)(options, function (err, result) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                });
              }));

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'createTag',
    value: function createTag(version) {
      return regeneratorRuntime.async(function createTag$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              this.logger.info('Tagging release. Current version: ' + version + '.');
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git tag -a v' + version + ' -m \'chore(release): ' + version + '\''));

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'publish',
    value: function publish() {
      return regeneratorRuntime.async(function publish$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this.logger.info('Publishing release.');
              _context6.next = 3;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git push --follow-tags origin ' + this.options.branch));

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'ensureCommittedChanges',
    value: function ensureCommittedChanges() {
      return regeneratorRuntime.async(function ensureCommittedChanges$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git status -s', true));

            case 2:
              if (!_context7.sent) {
                _context7.next = 5;
                break;
              }

              this.logger.error('It seems that you have uncommitted changes. To perform this command you should either commit your changes or reset them. Abort.');
              process.exit(1);

            case 5:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'lintCommitsSinceLastRelease',
    value: function lintCommitsSinceLastRelease() {
      var _this2 = this;

      var commits, result, invalidCommits;
      return regeneratorRuntime.async(function lintCommitsSinceLastRelease$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git log `git describe --match="v?.?.?" --abbrev=0`..HEAD --oneline --pretty=format:"%s"'));

            case 2:
              commits = _context9.sent;
              _context9.next = 5;
              return regeneratorRuntime.awrap((0, _core.lint)(commits, _configAngular.rules));

            case 5:
              result = _context9.sent;
              invalidCommits = void 0;

              if (result.valid) {
                _context9.next = 13;
                break;
              }

              _context9.next = 10;
              return regeneratorRuntime.awrap(Promise.all(commits.split('\n').map(function _callee(commit) {
                return regeneratorRuntime.async(function _callee$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return regeneratorRuntime.awrap((0, _core.lint)(commit, _configAngular.rules));

                      case 2:
                        if (_context8.sent.valid) {
                          _context8.next = 6;
                          break;
                        }

                        _context8.t0 = commit;
                        _context8.next = 7;
                        break;

                      case 6:
                        _context8.t0 = null;

                      case 7:
                        return _context8.abrupt('return', _context8.t0);

                      case 8:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, null, _this2);
              })));

            case 10:
              _context9.t0 = Boolean;
              invalidCommits = _context9.sent.filter(_context9.t0).join('\n');


              if (commits.split('\n').length === invalidCommits.split('\n').length) {
                this.logger.error('Nothing to commit. Abort.');
                process.exit(1);
              }

            case 13:
              return _context9.abrupt('return', { result: result.valid, invalidCommits: invalidCommits });

            case 14:
            case 'end':
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getNewVersion',
    value: function getNewVersion(currentVersion) {
      var release;
      return regeneratorRuntime.async(function getNewVersion$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              this.logger.info('Get new version.');

              _context10.next = 3;
              return regeneratorRuntime.awrap(this.bumpVersion());

            case 3:
              release = _context10.sent;
              return _context10.abrupt('return', _semver2.default.valid(release.releaseType) || _semver2.default.inc(currentVersion, release.releaseType, false));

            case 5:
            case 'end':
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'bumpVersion',
    value: function bumpVersion() {
      return new Promise(function (resolve, reject) {
        (0, _conventionalRecommendedBump2.default)({ preset: 'angular' }, function (err, release) {
          return err ? reject(err) : resolve(release);
        });
      });
    }
  }, {
    key: 'updateConfigs',
    value: function updateConfigs(newVersion) {
      var _this3 = this;

      this.logger.info('Update configs.');

      ['package.json', 'package-lock.json'].forEach(function (config) {
        var configPath = _findUp2.default.sync(config, { cwd: process.cwd() });
        try {
          var stat = _fs2.default.lstatSync(configPath);
          if (stat.isFile()) {
            var _config = _loadJsonFile2.default.sync(configPath);
            _config.version = newVersion;
            _writeJsonFile2.default.sync(configPath, _config, { indent: 2 });

            _this3.filesToUpdate.push(configPath);
          }
        } catch (err) {
          if (err.code !== 'ENOENT') {
            _this3.logger.error(err.message);
          }
        }
      });
    }
  }, {
    key: 'updateChangelog',
    value: function updateChangelog(newVersion) {
      var _this4 = this;

      this.logger.info('Update changelog.');

      return new Promise(function (resolve, reject) {
        var _getChangelogContent2 = _this4.getChangelogContent(),
            filePath = _getChangelogContent2.filePath,
            oldContent = _getChangelogContent2.content;

        _this4.filesToUpdate.push(filePath);

        if (oldContent.indexOf('<a name=') !== -1) {
          oldContent = oldContent.substring(oldContent.indexOf('<a name='));
        }

        var content = '';

        var changelogStream = (0, _conventionalChangelog2.default)({ preset: 'angular' }, { version: newVersion }, { merges: null }).on('error', function (err) {
          return reject(err);
        });

        changelogStream.on('data', function (buffer) {
          content += buffer.toString();
        });

        changelogStream.on('end', function () {
          var changelog = (content + oldContent).replace(/\n+$/, '\n');
          _fs2.default.writeFileSync(filePath, changelog);
          return resolve(changelog);
        });
      });
    }
  }, {
    key: 'getChangelogContent',
    value: function getChangelogContent() {
      this.createIfMissing('CHANGELOG.md');

      var filePath = _findUp2.default.sync('CHANGELOG.md', { cwd: process.cwd() });
      var content = _fs2.default.readFileSync(filePath, 'utf-8');

      return { filePath: filePath, content: content };
    }
  }, {
    key: 'createIfMissing',
    value: function createIfMissing(file) {
      try {
        fsAccess.sync(file, _fs2.default.F_OK);
      } catch (err) {
        if (err.code === 'ENOENT') {
          _fs2.default.writeFileSync(file, '\n');
        }
      }
    }
  }, {
    key: 'prepareChangelog',
    value: function prepareChangelog(changelog) {
      var preparedChangelog = changelog;

      // leave only features sections
      preparedChangelog.match(/##(#)?\s*(.*?)[\s\S]*?(?=##(#)?|<a|$)/gi).forEach(function (section) {
        if (!/(Features)/.test(section)) {
          preparedChangelog = preparedChangelog.replace(section, '');
        }
      });

      // replace header link with version
      preparedChangelog.match(/\[(\d\.\d\.\d(-.*)*?)\]\([\s\S]*?\)/gi).forEach(function (header) {
        preparedChangelog = preparedChangelog.replace(header, header.match(/\[(.*?)\]/)[1]);
      });

      // remove all links
      preparedChangelog = preparedChangelog.replace(/\(?\[.*?\]\)?\(.*?\)\)?/gi, '');

      return preparedChangelog;
    }
  }, {
    key: 'updateChangelogComponent',
    value: function updateChangelogComponent(changelog) {
      var changelogComponentPath, filePath, changelogContent, changelogPath, converter, html;
      return regeneratorRuntime.async(function updateChangelogComponent$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              this.logger.info('Update changelog component.');

              changelogComponentPath = this.workspace.getVWSCommandValue('release.changeLog.htmlPath');
              filePath = changelogComponentPath ? _findUp2.default.sync(changelogComponentPath, { cwd: process.cwd() }) : '';

              if (filePath) {
                _context11.next = 6;
                break;
              }

              this.logger.warn('Changelog component file was not found. Skip step');
              return _context11.abrupt('return');

            case 6:
              changelogContent = changelog;

              if (changelogContent) {
                _context11.next = 15;
                break;
              }

              changelogPath = _findUp2.default.sync('CHANGELOG.md', { cwd: process.cwd() });

              if (!changelogPath) {
                _context11.next = 13;
                break;
              }

              changelogContent = _fs2.default.readFileSync(changelogPath, 'utf-8');
              _context11.next = 15;
              break;

            case 13:
              this.logger.warn('CHANGELOG.md file was not found. Make sure it exists. Skip step');
              return _context11.abrupt('return');

            case 15:

              this.filesToUpdate.push(filePath);

              if (!this.options['raw-changelog']) {
                changelogContent = this.prepareChangelog(changelogContent);
              }

              converter = new _showdown2.default.Converter();
              html = converter.makeHtml(changelogContent).replace(/[{}]+/g, '');

              _fs2.default.writeFileSync(filePath, html, 'utf8');

              _context11.next = 22;
              return regeneratorRuntime.awrap(this.commitChanges(null, 'chore(changelog): update changelog component'));

            case 22:
            case 'end':
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'updateAppConfigVersion',
    value: function updateAppConfigVersion(newVersion) {
      var _this5 = this;

      this.logger.info('Update app-config with new version.');

      var appConfigPath = this.workspace.getVWSCommandValue('release.appConfig.path');
      var filePath = appConfigPath ? _findUp2.default.sync(appConfigPath, { cwd: process.cwd() }) : '';
      var appVersionKey = this.workspace.getVWSCommandValue('release.appConfig.key');

      if (!filePath || !appVersionKey) {
        this.logger.warn('Cannot update application version. Reason: missing filePath or appVersion key. Skip step');
        return;
      }

      this.filesToUpdate.push(filePath);

      var appVersionPattern = new RegExp('"' + appVersionKey + '":.*,', 'g');
      var result = void 0;

      _fs2.default.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          return _this5.logger.error(err);
        }

        if (appVersionPattern.test(data)) {
          result = data.replace(appVersionPattern, '"' + appVersionKey + '": "' + newVersion + '",');
        } else {
          result = data.replace(/^export const environment = {/, 'export const environment = {\n"' + appVersionKey + '": "' + newVersion + '",');
        }

        _fs2.default.writeFileSync(filePath, result, 'utf8');
      });
    }
  }, {
    key: 'commitChanges',
    value: function commitChanges(newVersion, message) {
      var commitMessage, toAdd;
      return regeneratorRuntime.async(function commitChanges$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              this.logger.info('Commit changes.');

              commitMessage = message || 'chore(release): ' + newVersion;
              toAdd = this.filesToUpdate.join(' ');
              _context12.next = 5;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git add ' + toAdd));

            case 5:
              _context12.next = 7;
              return regeneratorRuntime.awrap(this.workspace.runShellCommand('git commit -m \'' + this.formatCommitMessage(commitMessage, newVersion) + '\''));

            case 7:
            case 'end':
              return _context12.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'formatCommitMessage',
    value: function formatCommitMessage(msg, newVersion) {
      return String(msg).indexOf('%s') !== -1 ? _util2.default.format(msg, newVersion) : msg;
    }
  }]);

  return ReleaseCommand;
}(_command2.default);

exports.default = ReleaseCommand;