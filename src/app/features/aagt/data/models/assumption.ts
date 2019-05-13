import * as ebase from 'app/global-data';

export class Assumption extends ebase.SpEntityBase {
    static ENTITY_SHORTNAME = 'Assumption';

    readonly shortname = Assumption.ENTITY_SHORTNAME;
    area: string;
    category: string;
    remarks: string;
    generationId: number;
}
