import { AbstractControl, ValidatorFn } from '@angular/forms';

export function existingMilestoneValidator(milestones: string[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        const lcMilestones = milestones.map(m => {
            if (m) {
                return m.toLowerCase();
            }
        });
        if (
            c.value &&
            lcMilestones &&
            lcMilestones.includes(c.value.toLowerCase())
        ) {
            return { milestoneExists: true };
        }
        return null;
    };
}
