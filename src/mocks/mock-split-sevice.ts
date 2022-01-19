import { Injectable } from '@angular/core';
import * as SplitIO from '@splitsoftware/splitio-browserjs/types/splitio';
import { Subject } from 'rxjs';
/** Split.io service. */
@Injectable({
  providedIn: 'root',
})
export class MockSplitService {
  private splitClient!: SplitIO.IClient;

  public sdkReady$: Subject<void> = new Subject<void>();

  /**
   * Initialize the split.io service.
   *
   * @param userId User id of logged in user.
   */
  // eslint-disable-next-line
  public initSdk(userId: string): void {}

  /**
   * Get the dashboard split.
   *
   * @returns Split treatment.
   */
  public getDashboardTreatment(): string {
    return 'on';
  }
}
