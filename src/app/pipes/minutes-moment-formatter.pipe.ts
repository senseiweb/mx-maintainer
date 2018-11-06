import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';


@Pipe({ name: 'minutesExpand' })
export class MinutesExpand implements PipeTransform {

    transform(value: string, args: any[] = []): string {
        if (!value) {
            return;
        }
        if (isNaN(+value)) { return value; }
        const m = moment.duration(value, 'minutes') as any;
        return m.format('d [days], h [hours], m [minutes]');
    }
}


