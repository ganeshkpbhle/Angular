import { ValidatorFn } from "@angular/forms";

export type InputControl = {
    type: 'input',
    key: string,
    label:string,
    validators:ValidatorFn[],
    required:boolean,
    value:string
 }
 export type SelectControl = {
    type: 'select',
    key: string,
    label:string,
    options: string[],
    validators:ValidatorFn[],
    required:boolean,
    option:number
 }

 export type GenericControl = InputControl | SelectControl;
 export type FormDesc = GenericControl[];