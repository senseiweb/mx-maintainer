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
var SpMetadata = /** @class */ (function () {
    function SpMetadata() {
    }
    return SpMetadata;
}());
exports.SpMetadata = SpMetadata;
var SpMetadataMetadata = /** @class */ (function (_super) {
    __extends(SpMetadataMetadata, _super);
    function SpMetadataMetadata() {
        var _this = _super.call(this, '__metadata') || this;
        _this.metadataFor = SpMetadata;
        _this.entityDefinition.defaultResourceName = undefined;
        _this.entityDefinition.isComplexType = true;
        _this.entityDefinition.navigationProperties = undefined;
        _this.entityDefinition.dataProperties.uri = { dataType: _this.dt.String };
        _this.entityDefinition.dataProperties.etag = { dataType: _this.dt.String };
        _this.entityDefinition.dataProperties.type = { dataType: _this.dt.String };
        return _this;
    }
    SpMetadataMetadata = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SpMetadataMetadata);
    return SpMetadataMetadata;
}(ebase.MetadataBase));
exports.SpMetadataMetadata = SpMetadataMetadata;
