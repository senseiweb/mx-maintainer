"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var app_script_model_1 = require("app/app-script-model");
var observable_1 = require("rxjs/observable");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require('sp-jsom');
var SpDataRepoService = /** @class */ (function () {
    function SpDataRepoService(tagsMetadata, http) {
        this.tagsMetadata = tagsMetadata;
        this.http = http;
        this.mxMaintainerContextSite = 'https://cs2.eis.af.mil/sites/10918/mx-maintainer';
        this.scripts = [];
        this.isInitializer = false;
    }
    SpDataRepoService.prototype.resolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var digestValue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isInitializer) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, this.getRequestDigest(this.mxMaintainerContextSite)];
                    case 1:
                        digestValue = _a.sent();
                        this.spClientCtx = SP.ClientContext.get_current();
                        this.clientWeb = this.spClientCtx.get_web();
                        this.peopleManger = new SP.UserProfiles.PeopleManager(this.spClientCtx);
                        this.followingManager = new SP.Social.SocialFollowingManager(this.spClientCtx);
                        this.actorInfo = new SP.Social.SocialActorInfo();
                        this.spClientCtx.load(this.clientWeb);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.spClientCtx.executeQueryAsync(resolve, function (sender, error) {
                                    console.error("Critical Error: failed to get data from the server--> " + error.get_message());
                                    reject(error.get_message());
                                });
                            })];
                    case 2:
                        _a.sent();
                        this.isInitializer = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    SpDataRepoService.prototype.fetchAppTags = function (supportedApp) {
        return __awaiter(this, void 0, void 0, function () {
            var spMxmTagList, queryPart, requestedTags;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spMxmTagList = this.clientWeb
                            .get_lists()
                            .getByTitle(this.tagsMetadata.entityDefinition.shortName);
                        queryPart = "\n        <Eq>\n          <FieldRef Name='SupportedApp' />\n            <Value Type='Text'>\n            " + supportedApp + "\n            </Value>\n        </Eq>\n    ";
                        requestedTags = spMxmTagList.getItems(this.spQueryBuild(queryPart));
                        this.spClientCtx.load(requestedTags);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.spClientCtx.executeQueryAsync(resolve, function (sender, error) {
                                    console.error("Fetch Error: failed to get data from the server--> " + error.get_message());
                                    reject(error.get_message());
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, spMxmTagList];
                }
            });
        });
    };
    SpDataRepoService.prototype.getRequestDigest = function (contextSite) {
        return __awaiter(this, void 0, void 0, function () {
            var httpOptions, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        httpOptions = {
                            headers: new http_1.HttpHeaders({
                                'Content-Type': 'application/json'
                            })
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.http.post(contextSite + "\\_api\\contextinfo", {}, httpOptions).toPromise()];
                    case 2:
                        response = _a.sent();
                        console.log(response);
                        return [2 /*return*/, response['RequestDigest']];
                    case 3:
                        e_1 = _a.sent();
                        console.log('Error getting request digest ' + e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpDataRepoService.prototype.spQueryBuild = function (spQueryPart) {
        var query = new SP.CamlQuery();
        query.set_viewXml("\n      <View>\n        <Query>\n          <Where>\n          " + spQueryPart + "\n          </Where>\n        </Query>\n      </View>\n    ");
        return query;
    };
    SpDataRepoService.prototype.load = function (key) {
        var _this = this;
        return new observable_1.Observable(function (observer) {
            var script = app_script_model_1.ScriptStore.find(function (s) { return s.id === key; });
            // Complete if already loaded
            if (script && script.loaded) {
                observer.next(script);
                observer.complete();
            }
            else {
                _this.scripts = _this.scripts.concat([script]);
                var scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.src = script.path;
                scriptElement.onload = function () {
                    script.loaded = true;
                    observer.next(script);
                    observer.complete();
                };
                scriptElement.onerror = function (error) {
                    observer.error("Failure loading secondary scripts: " + script.id);
                };
                document.getElementsByTagName('body')[0].appendChild(scriptElement);
            }
        });
    };
    SpDataRepoService.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
        }
        return rxjs_1.throwError('Something bad happened; please try again later.');
    };
    SpDataRepoService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
        // At times it is easier to retrieve things using the
        // the sharepoint JSOM libraries and cached them for later use
    ], SpDataRepoService);
    return SpDataRepoService;
}());
exports.SpDataRepoService = SpDataRepoService;
