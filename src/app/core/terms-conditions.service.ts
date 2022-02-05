import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for all data communication between components.
 */
@Injectable({
  providedIn: 'root',
})
export class TermsConditionsService {
  /** The terms and conditions agreed or not. */
  private agreed$ = new BehaviorSubject<boolean>(false);

  /** The terms and conditions agreed or not as observable. */
  currentAgreed$ = this.agreed$.asObservable();

  /**
   * Set's the value for terms and conditions is approved or not.
   *
   * @param agree The terms and conditions value.
   */
  setAgreed(agree: boolean): void {
    this.agreed$.next(agree);
  }
}
