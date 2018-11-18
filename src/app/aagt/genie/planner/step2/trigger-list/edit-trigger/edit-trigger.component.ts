import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector     : 'edit-trigger',
    templateUrl  : './edit-trigger.component.html',
    styleUrls    : ['./edit-trigger.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditTriggerComponent
{
    formActive: boolean;
    form: FormGroup;

    @Input()
    list;

    @Output()
    listNameChanged: EventEmitter<any>;

    @ViewChild('nameInput')
    nameInputField;

    constructor(
        private _formBuilder: FormBuilder
    )
    {
        this.formActive = false;
        this.listNameChanged = new EventEmitter();
    }

    openForm(): void
    {
        this.form = this._formBuilder.group({
            name: [this.list.name]
        });
        this.formActive = true;
        this.focusNameField();
    }

    closeForm(): void
    {
        this.formActive = false;
    }


    focusNameField(): void
    {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    onFormSubmit(): void
    {
        if ( this.form.valid )
        {
            this.list.name = this.form.getRawValue().name;
            this.listNameChanged.next(this.list.name);
            this.formActive = false;
        }
    }
}
