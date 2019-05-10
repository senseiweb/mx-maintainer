import { Injectable } from '@angular/core';
import { SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';

export class Assumption extends ebase.SpEntityBase {
    readonly shortname = SpListName.Assumption;

    area: string;
    category: string;
    remarks: string;
    generationId: number;
}
