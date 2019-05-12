import * as ebase from 'app/global-data';

export class Assumption extends ebase.SpEntityBase {
    readonly shortname = 'Assumption';

    area: string;
    category: string;
    remarks: string;
    generationId: number;
}
