import { Injectable } from '@angular/core';
import {
    NamingConvention,
    EntityType,
    DataProperty
} from 'breeze-client';

export interface CustomClientDict {
    [index: string]: { [index: string]: string }
}

//#region Copyright, Version, and Description
/*
 *
 * NamingConventionWithDictionary plugin to the breeze.NamingConvention class
 *
 * Adds a NamingConvention that extends another NamingConvention
 * by attempting first to translate specific Entity property names using a dictionary.
 * If a property name is not found in the dictionary,
 * it falls back to the base NamingConvention (AKA "sourceNamingConvention").
 *
 * Copyright 2015 IdeaBlade, Inc.  All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the IdeaBlade Breeze license, available at http://www.breezejs.com/license
 *
 * Author: Ward Bell
 * Version: 0.1.0 - original
 *
 * Load this script after breeze
 *
 * Usage:
 *    var convention =
 *      new breeze.NamingConvention.NamingConventionWithDictionary(...)
 *
 */
//#endregion
@Injectable()
export class CustomNameConventionService {
    private clientToServerDictionary: CustomClientDict;
    private serverToClientDictionary: { [index: string]: EntityType }
    private sourceConvention: NamingConvention;

    constructor() {
        this.serverToClientDictionary = this.makeServerToClientDictionary();
    }

    createNameDictionary(name: string, sourceConv: NamingConvention, clientToServerDict: CustomClientDict): NamingConvention {
        if (!(sourceConv instanceof NamingConvention)) {
            throw new Error('must be a instance of a Naming Convention');
        }
        if (!name) {
            throw new Error('must be a non empty string');
        }
        this.clientToServerDictionary = clientToServerDict;
        this.sourceConvention = sourceConv;

        return new NamingConvention({
            name: name,
            clientPropertyNameToServer: this.clientPropertyNameToServer,
            serverPropertyNameToClient: this.serverProperyNameToClient
        });
    }

    clientPropertyNameToServer(name: string, propDef: DataProperty): string {
        const typeName = propDef && propDef.parentType && propDef.parentType.name;
        const props = this.clientToServerDictionary[typeName || undefined];
        const newName = props && props[name];
        return newName || this.sourceConvention.clientPropertyNameToServer(name, propDef);
    }

    serverProperyNameToClient(name: string, propDef: DataProperty): string {
        const typeName = propDef && propDef.parentType && propDef.parentType.name;
        const props = this.serverToClientDictionary[typeName || undefined];
        const newName = props && props[name];
        return newName || this.sourceConvention.serverPropertyNameToClient(name, propDef);
    }

     // makes new dictionary based on clientToServerDifctionary
    // that reverses each EntityType's {clientPropName: serverPropName} KV pairs
    makeServerToClientDictionary(): { [index: string]: EntityType } {
        const dict = {};
        for (const typename of Object.keys(this.clientToServerDictionary)) {
            const newType = {};
            const type = this.clientToServerDictionary[typename];
            for (const prop of Object.keys(type)) {
                newType[type[prop]] = prop; // reverse KV pair
            }
            dict[typename] = newType;
        }
        return dict;
    }
}