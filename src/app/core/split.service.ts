import { Injectable } from '@angular/core';
import { SplitFactory } from '@splitsoftware/splitio-browserjs';
import * as SplitIO from '@splitsoftware/splitio-browserjs/types/splitio';
import { Subject } from 'rxjs';
/** Split.io service. */
@Injectable({
  providedIn: 'root',
})
export class SplitService {
  private splitClient!: SplitIO.IClient;

  public sdkReady$: Subject<void> = new Subject<void>();

  /**
   * Initialize the split.io service.
   *
   * @param orgId Organization id of logged in user.
   */
  public initSdk(orgId: string): void {
    const splitSDK: SplitIO.ISDK = SplitFactory({
      core: {
        authorizationKey: 'o2auojf6jvntjdciqc356q300cepl3t26la0',
        key: orgId,
      },
    });

    this.splitClient = splitSDK.client();

    this.splitClient.on(this.splitClient.Event.SDK_READY, () => {
      this.sdkReady$.next();
    });
  }

  /**
   * Get the dashboard split.
   *
   * @returns Split treatment.
   */
  public getDashboardTreatment(): string {
    return this.splitClient.getTreatment('dashboard_split');
  }

  /**
   * Get the station document split.
   *
   * @returns Split treatment.
   */
  public getStationDocumentTreatment(): string {
    return this.splitClient.getTreatment('Station-Document-Widgets');
  }
}
