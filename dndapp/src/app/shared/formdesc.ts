import { ValidatorFn } from "@angular/forms";

type InputControl = {
    type: 'input',
    key: string,
    label:string,
    defaultValue?: string,
    validators:ValidatorFn[],
    required:boolean
 }
 type SelectControl = {
    type: 'select',
    key: string,
    label:string,
    options: string[],
    defaultOption?: string,
    validators:ValidatorFn[],
    required:boolean
 }
 type GenericControl = InputControl | SelectControl;
 export type FormDesc = GenericControl[];