import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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

  private _checkAll = false;

  /** Status checkAll. */
  @Input() set checkAll(status: boolean) {
    this._checkAll = status;
    if (this.form) {
      if (status) {
        this.isCheck = true;
      }
      if (!this.isCheck) {
        this.form.patchValue({
          check: status,
          isEditable: false,
        });
      }
    }
  }

  /**
   * Get checkAll.
   *
   * @returns A boolean.
   */
  get checkAll(): boolean {
    return this._checkAll;
  }

  @Output() deselectCheckAll = new EventEmitter<void>();

  /**
   * Get status check.
   *
   * @returns Status check.
   */
  get check(): boolean {
    return this.form.controls['check'].value;
  }

  /**
   * Get isEditable.
   *
   * @returns Status isEditable.
   */
  get isEditable(): boolean {
    return this.form.controls['isEditable'].value;
  }

  /** Form user. */
  form!: FormGroup;

  /** Member can view. */
  isCheck = false;

  constructor(private fb: FormBuilder) {}

  /** Init method. */
  ngOnInit(): void {
    this.form = this.fb.group({
      check: this.fb.control(this.member.canView),
      isEditable: this.fb.control(this.member.isEditable),
    });
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

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
      this.form.patchValue({
        isEditable: !this.isEditable,
      });
    }
  }

  /**
   * Change check.
   */
  onChange(): void {
    this.isCheck = this.check;
    if (!this.check) {
      this.form.patchValue({
        isEditable: false,
      });
      if (this.checkAll) {
        this.deselectCheckAll.emit();
      }
    }
  }
}
