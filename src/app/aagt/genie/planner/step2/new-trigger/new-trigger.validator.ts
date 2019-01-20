import { Directive, Attribute } from '@angular/core';
import { Validator, NG_VALIDATORS, FormControl, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[validateTriggerMilestone][formControlName],[validateTriggerMilestone][formControl],[validateTriggerMilestone][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DupTriggerMilestoneValidator, multi: true }
    ]
})
export class DupTriggerMilestoneValidator implements Validator {

    constructor(@Attribute('validateTriggerMilestone') public validateTriggerMilestone: string) { }
    
    static ValidateTriggerMileston(c: FormControl): ValidationErrors {
        
    }


    validate(c: r): ValidationErrors | null {
        if (valid) {
            return null;
        }

        return {
            validatorName: {
                valid: false
            }
        };
    }
}