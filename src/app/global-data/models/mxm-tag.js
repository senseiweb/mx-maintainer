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
var ebase = require("app/data/models/_entity-base");
var core_1 = require("@angular/core");
var MxAppEnum;
(function (MxAppEnum) {
    MxAppEnum["aagt"] = "aagt";
})(MxAppEnum = exports.MxAppEnum || (exports.MxAppEnum = {}));
var MxFilterTag = /** @class */ (function (_super) {
    __extends(MxFilterTag, _super);
    function MxFilterTag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MxFilterTag;
}(ebase.SpEntityBase));
exports.MxFilterTag = MxFilterTag;
var MxmTagMetadata = /** @class */ (function (_super) {
    __extends(MxmTagMetadata, _super);
    function MxmTagMetadata() {
        var _this = _super.call(this, 'MxFilterTag') || this;
        _this.metadataFor = MxFilterTag;
        _this.entityDefinition.dataProperties.tagHandle = { dataType: _this.dt.String };
        _this.entityDefinition.dataProperties.tagTitle = { dataType: _this.dt.String };
        _this.entityDefinition.dataProperties.tagIcon = { dataType: _this.dt.String };
        _this.entityDefinition.dataProperties.isFilter = { dataType: _this.dt.Boolean };
        _this.entityDefinition.dataProperties.appReference = { dataType: _this.dt.String };
        // this.entityDefinition.navigationProperties.Producer = {
        //   entityTypeName: ''
        // };
        Object.assign(_this.entityDefinition.dataProperties, _this.baseDataProperties);
        return _this;
    }
    MxmTagMetadata.prototype.initializer = function (entity) { };
    MxmTagMetadata = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], MxmTagMetadata);
    return MxmTagMetadata;
}(ebase.MetadataBase));
exports.MxmTagMetadata = MxmTagMetadata;
