#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.description = exports.command = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _json2csv = require('json2csv');

var _json2csv2 = _interopRequireDefault(_json2csv);

var _licenseChecker = require('license-checker');

var _licenseChecker2 = _interopRequireDefault(_licenseChecker);

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
          return regeneratorRuntime.awrap(new LicensesCommand(argv._, argv).run());

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

var command = exports.command = 'licenses';

var description = exports.description = 'extract licenses of package';

var builder = exports.builder = {
  "types": {
    group: "Command Options:",
    describe: "what types of dependencies (all | direct)",
    type: "string",
    default: "direct"
  }
};

var LicensesCommand = function (_Command) {
  _inherits(LicensesCommand, _Command);

  function LicensesCommand() {
    _classCallCheck(this, LicensesCommand);

    return _possibleConstructorReturn(this, (LicensesCommand.__proto__ || Object.getPrototypeOf(LicensesCommand)).apply(this, arguments));
  }

  _createClass(LicensesCommand, [{
    key: 'runCommand',
    value: function runCommand() {
      var _this2 = this;

      var licensesMapping, getPackagesResponses, licensesList, csvFile;
      return regeneratorRuntime.async(function runCommand$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this.logger.verbose('licenses', 'extracing licenses');

              licensesMapping = {};
              getPackagesResponses = [];
              _context6.next = 5;
              return regeneratorRuntime.awrap(Promise.all(this.workspace.repositories.map(function _callee4(repo) {
                return regeneratorRuntime.async(function _callee4$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        return _context5.abrupt('return', new Promise(function _callee3(resolve, reject) {
                          var repoLicenses;
                          return regeneratorRuntime.async(function _callee3$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  _context4.next = 2;
                                  return regeneratorRuntime.awrap(_this2.getPackageLicenses(repo.path, repo.pkgData));

                                case 2:
                                  repoLicenses = _context4.sent;

                                  _this2.logger.info('licenses', 'got ' + Object.keys(repoLicenses).length + ' licenses for ' + repo.name);
                                  _this2.mergeLicenses(licensesMapping, repoLicenses);

                                  _context4.next = 7;
                                  return regeneratorRuntime.awrap(Promise.all(repo.packages.map(function _callee2(repoPackage) {
                                    return regeneratorRuntime.async(function _callee2$(_context3) {
                                      while (1) {
                                        switch (_context3.prev = _context3.next) {
                                          case 0:
                                            return _context3.abrupt('return', new Promise(function _callee(resolve) {
                                              var repoPackageLicenses;
                                              return regeneratorRuntime.async(function _callee$(_context2) {
                                                while (1) {
                                                  switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                      _context2.next = 2;
                                                      return regeneratorRuntime.awrap(_this2.getPackageLicenses(repoPackage.path, repoPackage.pkgData));

                                                    case 2:
                                                      repoPackageLicenses = _context2.sent;

                                                      _this2.logger.info('licenses', 'got ' + Object.keys(repoPackageLicenses).length + ' licenses for ' + repo.name + '/' + repoPackage.name);
                                                      _this2.mergeLicenses(licensesMapping, repoPackageLicenses);
                                                      resolve();

                                                    case 6:
                                                    case 'end':
                                                      return _context2.stop();
                                                  }
                                                }
                                              }, null, _this2);
                                            }));

                                          case 1:
                                          case 'end':
                                            return _context3.stop();
                                        }
                                      }
                                    }, null, _this2);
                                  })));

                                case 7:

                                  resolve();

                                case 8:
                                case 'end':
                                  return _context4.stop();
                              }
                            }
                          }, null, _this2);
                        }));

                      case 1:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, null, _this2);
              })));

            case 5:
              licensesList = this.processLicenses(licensesMapping);
              csvFile = this.convertToCsv(licensesList);

              _fs2.default.writeFileSync('dependency-licenses.csv', csvFile, 'utf8');
              this.logger.info('licenses', 'create file \'dependency-licenses.csv\'');

            case 9:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'mergeLicenses',
    value: function mergeLicenses(licensesMapping, repoLicenses) {
      var _this3 = this;

      Object.keys(repoLicenses).forEach(function (licenseName) {
        var newLicenseData = repoLicenses[licenseName];
        var existsLicenseData = licensesMapping[licenseName];
        if (!existsLicenseData) {
          licensesMapping[licenseName] = newLicenseData;
        } else {
          existsLicenseData.packages = existsLicenseData.packages + ', ' + newLicenseData.packages;
          existsLicenseData.type = _this3.getUnifiedLicenseType(existsLicenseData, newLicenseData);

          if (existsLicenseData.licenses.indexOf(newLicenseData.licenses) === -1) {
            existsLicenseData.licenses = existsLicenseData.licenses + ', ' + newLicenseData.licenses;
          }
        }
      });
    }
  }, {
    key: 'getUnifiedLicenseType',
    value: function getUnifiedLicenseType(dependency, matchingDependency) {
      if (dependency.type === 'production' || matchingDependency.type === 'production') {
        return 'production';
      } else if (dependency.type === 'development' || matchingDependency.type === 'development') {
        return 'development';
      } else {
        return 'indirect';
      }
    }
  }, {
    key: 'processLicenses',
    value: function processLicenses(licensesMapping) {
      var _this4 = this;

      var result = [];
      for (var dependencyNameAndVersion in licensesMapping) {
        var dependencyName = dependencyNameAndVersion.substr(0, dependencyNameAndVersion.lastIndexOf('@'));
        var dependencyVersion = dependencyNameAndVersion.substr(dependencyName.length + 1, dependencyNameAndVersion.length - dependencyName.length);
        result.push(Object.assign(licensesMapping[dependencyNameAndVersion], {
          name: dependencyName,
          version: dependencyVersion
        }));
      }

      if (this.options.type !== 'all') {
        this.logger.info('filter licenses by type \'' + this.options.type + '\'');
        result = result.filter(function (item) {
          return ['production', 'development'].indexOf(item.type) > -1;
        });
      }

      if (this.workspace.licenses && this.workspace.licenses.ignoreList) {
        this.logger.info('filter licenses by ignoreList from configuration file.');
        result = result.filter(function (item) {
          return _this4.workspace.licenses.ignoreList.indexOf(item.name) === -1;
        });
      }

      result.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      this.logger.info('extracted ' + result.length + ' unique licenses');
      return result;
    }
  }, {
    key: 'convertToCsv',
    value: function convertToCsv(licensesList) {
      return (0, _json2csv2.default)({
        data: licensesList,
        fields: ['name', 'type', 'publisher', 'licenses', 'guessedLicenses', 'version', 'packages', 'repository'],
        excelStrings: false,
        del: '\t'
      });
    }
  }, {
    key: 'getPackageLicenses',
    value: function getPackageLicenses(packagePath, pkgData) {
      var result, packageToTypeMapping;
      return regeneratorRuntime.async(function getPackageLicenses$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              result = {};


              if (!pkgData || !_fs2.default.existsSync(packagePath)) {
                this.logger.error('licenses', 'missing valid package path and package.json data');
                process.exit(1);
              }

              this.logger.verbose('licenses', 'getting license for package \'' + pkgData.name + '\'', packagePath);

              _context7.prev = 3;
              packageToTypeMapping = {};

              Object.keys(pkgData.devDependencies || {}).forEach(function (packageName) {
                return packageToTypeMapping[packageName] = 'development';
              });
              Object.keys(pkgData.dependencies || {}).forEach(function (packageName) {
                return packageToTypeMapping[packageName] = 'production';
              });

              _context7.next = 9;
              return regeneratorRuntime.awrap(this.getLicenses(packagePath));

            case 9:
              result = _context7.sent;


              Object.keys(result).forEach(function (dependencyFullName) {
                var dependency = result[dependencyFullName];
                var dependencyName = dependencyFullName.substr(0, dependencyFullName.lastIndexOf('@'));
                dependency.type = packageToTypeMapping[dependencyName] || 'indirect';
                dependency.packages = pkgData.name;
                if (dependency.licenses.indexOf('*') !== -1) {
                  dependency.guessedLicenses = dependency.licenses;
                  dependency.licenses = 'unknown';
                }
              });
              _context7.next = 17;
              break;

            case 13:
              _context7.prev = 13;
              _context7.t0 = _context7['catch'](3);

              this.logger.error(_context7.t0);
              process.exit(1);

            case 17:
              return _context7.abrupt('return', result);

            case 18:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this, [[3, 13]]);
    }
  }, {
    key: 'getLicenses',
    value: function getLicenses(packageRoot) {
      return regeneratorRuntime.async(function getLicenses$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt('return', new Promise(function (resolve, reject) {
                _licenseChecker2.default.init({
                  unknown: false,
                  start: packageRoot
                }, function (err, json) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(json);
                  }
                });
              }));

            case 1:
            case 'end':
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }]);

  return LicensesCommand;
}(_command2.default);

exports.default = LicensesCommand;