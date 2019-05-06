// import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// import { Validator } from 'breeze-client';
// import { SpEntityDecorator } from './breeze-entity';



// const addValidators = (
//     target: any,
//     key: string,
//     etValidator: Validators,
//     frmValidator: ValidatorFn
// ) => {
//     target.frmValidator = target.frmValidator || new Map();
//     target.etValidator = target.etValidator || new Map();

//     const frmValidators = target.frmValidator.get(key) || [];
//     if (frmValidators) {
//         frmValidators.push(frmValidator);
//     } else {
//         target.frmValidator.set(key, [frmValidator]);
//     }

//     const entyValidator = target.etValidator.get(key);
//     if (entyValidator) {
//         entyValidator.push(etValidator);
//     } else {
//         target.etValidator.set(key, [etValidator]);
//     }
// };

// export const BzValid_IsRequired = (target: any, key: string) => {
//     addValidators(target, key, Validator.required(), Validators.required);
// };

// export const BzValid_Maxlength = (length: number): PropertyDecorator => {
//     return (target: any, key: string) => {
//         addValidators(
//             target,
//             key,
//             Validator.maxLength({ maxLength: length }),
//             Validators.maxLength(length)
//         );
//     };
// };

// export const BzValid_CustomValidator = <T>(
//     propertyTarget?: keyof T
// ): MethodDecorator => {
//     return (
//         target: any,
//         key: string,
//         descriptor: TypedPropertyDescriptor<any>
//     ) => {
//         const customValidator = target[key];
//         addValidators(
//             target,
//             key,
//             customValidator,
//             bzValidatorWrapper(customValidator)
//         );
//     };
// };
