"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var ebase = require("./_entity-base");
var core_1 = require("@angular/core");
var SpMultiLookup = /** @class */ (function () {
    function SpMultiLookup() {
    }
    return SpMultiLookup;
}());
exports.SpMultiLookup = SpMultiLookup;
var SpMultiLookupMeta = /** @class */ (function (_super) {
    __extends(SpMultiLookupMeta, _super);
    function SpMultiLookupMeta() {
        var _this = _super.call(this, 'spMultiLookup') || this;
        _this.metadataFor = SpMultiLookup;
        _this.entityDefinition.defaultResourceName = undefined;
        _this.entityDefinition.isComplexType = true;
        _this.entityDefinition.dataProperties.__metadata = {
            complexTypeName: '__metadata',
            dataType: undefined,
            isNullable: false
        };
        _this.entityDefinition.dataProperties.results = { dataType: _this.dt.Int16, hasMany: true };
        return _this;
    }
    SpMultiLookupMeta = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SpMultiLookupMeta);
    return SpMultiLookupMeta;
}(ebase.MetadataBase));
exports.SpMultiLookupMeta = SpMultiLookupMeta;
