"use strict";
exports.__esModule = true;
var breeze = require("breeze-client");
require("breeze-client-labs/breeze.metadata-helper");
var SpEntityBase = /** @class */ (function () {
    function SpEntityBase() {
    }
    return SpEntityBase;
}());
exports.SpEntityBase = SpEntityBase;
var MetadataBase = /** @class */ (function () {
    function MetadataBase(shortName) {
        this.dt = breeze.DataType;
        this.baseDataProperties = {
            id: {
                dataType: this.dt.Int32,
                isPartOfKey: true
            },
            '__metadata': {
                complexTypeName: '__metadata',
                dataType: null,
                isNullable: false
            },
            modified: { dataType: this.dt.DateTime },
            created: { dataType: this.dt.DateTime },
            authorId: { dataType: this.dt.Int32 },
            editorId: { dataType: this.dt.Int32 }
        };
        this.entityDefinition = {
            dataProperties: {},
            navigationProperties: {},
            shortName: '',
            defaultResourceName: ''
        };
        this.entityDefinition.shortName = shortName;
        this.entityDefinition.defaultResourceName = "lists/getByTitle('" + shortName + "')/items";
    }
    // get $typeName(): string {
    //     if (!this.entityAspect) {return; }
    //     return this.entityAspect.getKey().entityType.shortName;
    // }
    MetadataBase.prototype.addDefaultSelect = function (type) {
        var customPropExist = type.custom;
        var excludeProps = ['__metadata'];
        if (!customPropExist || !customPropExist.defaultSelect) {
            var selectItems_1 = [];
            type.dataProperties.forEach(function (prop) {
                var isExcluded = excludeProps.some(function (exProp) { return exProp === prop.name; });
                if (!prop.isUnmapped && !isExcluded) {
                    selectItems_1.push(prop.name);
                }
            });
            if (selectItems_1.length) {
                if (!customPropExist) {
                    type.custom = {};
                }
                type.custom.defaultSelect = selectItems_1.join(',');
            }
        }
        return type;
    };
    MetadataBase.prototype.initializer = function (entity) { };
    MetadataBase.prototype.registerMe = function (store, metadataHelper, spEntity, initializer) {
        var addedType = metadataHelper.addTypeToStore(store, this.entityDefinition);
        store.registerEntityTypeCtor(this.entityDefinition.shortName, spEntity, initializer);
        if (this.entityDefinition.defaultResourceName) {
            store.setEntityTypeForResourceName(this.entityDefinition.defaultResourceName, addedType);
        }
        this.addDefaultSelect(addedType);
    };
    return MetadataBase;
}());
exports.MetadataBase = MetadataBase;
