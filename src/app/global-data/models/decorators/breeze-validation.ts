import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { Validator } from 'breeze-client';
import { SpEntityDecorator } from './breeze-entity';

export const bzValidatorWrapper = (validator: Validator): ValidatorFn => {
    return (c: AbstractControl): { [error: string]: any } => {
        const result = validator.validate(c.value, validator.context);
        return result ? { [result.propertyName]: result.errorMessage } : null;
    };
};

export const BzValid_IsRequired = (target: SpEntityDecorator, key: string) => {
    target.bzValidator = target.bzValidator || {};

    const validatorList = (target.bzValidator[key] = target.bzValidator[
        key
    ] || {
        formValidators: [],
        entityValidators: []
    });

    validatorList.entityValidators.push(Validator.required());
    validatorList.formValidators.push(Validators.required);
};

export const BzValid_Maxlength = (length: number): PropertyDecorator => {
    return (target: SpEntityDecorator, key: string) => {
        target.bzValidator = target.bzValidator || {};

        const validatorList = (target.bzValidator[key] = target.bzValidator[
            key
        ] || {
            formValidators: [],
            entityValidators: []
        });

        validatorList.entityValidators.push(
            Validator.maxLength({ maxLength: length })
        );
        validatorList.formValidators.push(Validators.maxLength(length));
    };
};

export const BzValid_CustomValidator = <T>(
    propertyTarget?: keyof T
): MethodDecorator => {
    return (
        target: any,
        key: string,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        target.bzValidator = target.bzValidator || {};

        const valProp = propertyTarget || 'entity';

        const validatorList = (target.bzValidator[valProp] = target.bzValidator[
            valProp
        ] || {
            formValidators: [],
            entityValidators: []
        });

        validatorList.entityValidators.push(target[key]);
        validatorList.formValidators.push(bzValidatorWrapper(target[key]));
    };
};
