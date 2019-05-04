import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';

export class Assumption extends ebase.SpEntityBase {
    area: string;
    category: string;
    remarks: string;
    generationId: number;
}
