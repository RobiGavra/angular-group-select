import { Component, EventEmitter, forwardRef, Input, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

export const GROUP_SELECT_FORM_FIELD_CONTROL: any = {
    provide: MatFormFieldControl,
    useExisting: forwardRef(() => GroupSelectComponent)
};

@Component({
    selector: 'group-select',
    templateUrl: './group-select.component.html',
    providers: [GROUP_SELECT_FORM_FIELD_CONTROL],
})
export class GroupSelectComponent implements ControlValueAccessor, MatFormFieldControl<string> {
    @Input() groups: GroupSelectElement[] = [
        { name: 'Swedish Cars', items: [{ id: '1', name: 'Volvo' }, { id: '2', name: 'Saab' }] },
        { name: 'German Cars', items: [{ id: '3', name: 'Mercedes' }, { id: '4', name: 'Audi' }] }
    ];

    @Input() useNone: boolean = true;
    @Input() useBorder: boolean = true;
    @Input() placeholder: string = '';
    @Input() required: boolean = false;

    @Output() selectionChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    value: string = '';
    stateChanges = new Subject<void>();
    id: string = '';
    focused: boolean = true;
    empty: boolean = false;
    shouldLabelFloat: boolean = false;
    disabled: boolean = false;
    selectedValueTooltip: string = 'this is a tooltip';

    get errorState() {
        if (this.required) return this.ngControl.errors !== null && !!this.ngControl.touched;
        return false;
    }

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) this.ngControl.valueAccessor = this;
    }

    onChange = (_: any) => { };
    onTouched = () => { };

    setDescribedByIds(ids: string[]): void { }

    onContainerClick(event: MouseEvent): void {
        this.onTouched();
    }

    writeValue(value: string) {
        this.init(value);
    }

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    onValueChange(value: any) {
        this.onTouched();
        this.init(value);
        this.onChange(value);
        this.selectionChange.emit();
    }

    onClick($event: any) {
        this.click.emit($event);
    }

    private init(value: any) {
        this.empty = true;
        this.value = value;

        if (this.value || this.value === '') this.empty = false;

        this.setSelectedValueTooltip();

        this.shouldLabelFloat = !this.empty;
    }

    private setSelectedValueTooltip() {
        if (this.value)
            this.groups.forEach(group => {
                const selectedItem = group.items.find(item => item.id == this.value);
                if (selectedItem) {
                    this.selectedValueTooltip = selectedItem.name;
                    return;
                }
            });
    }
}

export interface GroupSelectElement {
    name: string;
    items: GroupSelectItem[];
}

export interface GroupSelectItem {
    id: string;
    name: string;
}