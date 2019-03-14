import { AbstractControl, ValidatorFn } from '@angular/forms';

export function existingMilestoneValidator(milestones: string[]): ValidatorFn {
    return (c: AbstractControl): {[key: string]: boolean} | null => {
        if (c.value !== undefined && milestones.includes(c.value)) {
            return { 'milestoneExists': true };
        }
        return null;
    };
}
