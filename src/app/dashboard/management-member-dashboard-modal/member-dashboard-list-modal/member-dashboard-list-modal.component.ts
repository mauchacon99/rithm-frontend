import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MemberDashboard } from 'src/models';

/** List members. */
@Component({
  selector: 'app-member-dashboard-list-modal[member]',
  templateUrl: './member-dashboard-list-modal.component.html',
  styleUrls: ['./member-dashboard-list-modal.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MemberDashboardListModalComponent),
      multi: true,
    },
  ],
})
export class MemberDashboardListModalComponent
  implements OnInit, ControlValueAccessor
{
  /** Member dashboard. */
  @Input() member!: MemberDashboard;

  /** Index member. */
  @Input() index!: number;

  /** Status checkAll. */
  @Input() set setCheckAll(status: boolean) {
    if (this.form) {
      this.form.patchValue({
        check: status,
      });
      if (!status) {
        this.isEditable = false;
        this.form.patchValue({
          isEditable: this.isEditable,
        });
      }
    }
  }

  /** Form user. */
  form!: FormGroup;

  /** Current user can edit. */
  isEditable = false;

  /**
   * Get status check.
   *
   * @returns Status check.
   */
  get check(): boolean {
    return this.form.controls['check'].value;
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  /** Init method. */
  ngOnInit(): void {
    this.form = this.fb.group({
      check: this.fb.control(this.member.canView),
      isEditable: this.fb.control(this.member.isEditable),
    });
  }

  /**
   * Set value in user.
   *
   * @param value Set value.
   */
  // eslint-disable-next-line
  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line
  registerOnChange(fn: any): void {
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.form.valueChanges.subscribe(fn);
  }

  /**
   * Registers a function with the `onTouched` event.
   *
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Status isEditable.
   */
  onChangeIsEditable(): void {
    if (this.check) {
      this.isEditable = !this.isEditable;
      this.form.patchValue({
        isEditable: this.isEditable,
      });
    }
  }

  /**
   * Change check.
   */
  onChange(): void {
    if (!this.check) {
      this.isEditable = false;
      this.form.patchValue({
        isEditable: this.isEditable,
      });
    }
  }
}
