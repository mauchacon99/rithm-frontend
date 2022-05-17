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
  public initSdk(userId: string): void {
    this.sdkReady$.next();
  }

  /**
   * Get the widget settings config.
   *
   * @returns Split treatment.
   */
  public getConfigWidgetsTreatment(): string {
    return 'on';
  }

  /**
   * Get the dashboard library split.
   *
   * @returns Split treatment.
   */
  public getDashboardLibraryTreatment(): string {
    return 'on';
  }

  /**
   * Get the station document split.
   *
   * @returns Split treatment.
   */
  public getStationDocumentTreatment(): string {
    return 'on';
  }

  /**
   * Get the option the menu dashboard for hidden or show manage members.
   *
   * @returns Split treatment.
   */
  public getManageUserTreatment(): string {
    return 'on';
  }

  /**
   * Get the section Image banner.
   *
   * @returns Split treatment.
   */
  public getStationUploadBannerTreatment(): string {
    return 'on';
  }

  /**
   * Get the section Admin Portal.
   *
   * @returns Split treatment.
   */
  public getAdminPortalTreatment(): string {
    return 'on';
  }

  /**
   * Get the section groupHierarchyMenu.
   *
   * @returns Split treatment.
   */
  public getGroupHierarchyMenuTreatment(): string {
    return 'on';
  }

  /**
   * Get the profile banner split.
   *
   * @returns Split treatment.
   */
  public getProfileBannerTreatment(): string {
    return 'on';
  }

  /**
   * Get the section group section in add widget modal.
   *
   * @returns Split treatment.
   */
  public getGroupSectionAddWidgetTreatment(): string {
    return 'on';
  }

  /**
   * Get the flow logic treatment.
   *
   * @returns Split treatment.
   */
  public getFlowLogicTreatment(): string {
    return 'on';
  }

  /**
   * Get the section group traffic in list-widget-modal.
   *
   * @returns Split treatment.
   */
  public getGroupTrafficTemplateTreatment(): string {
    return 'on';
  }

  /**
   * Get the section station list section in add widget modal.
   *
   * @returns Split treatment.
   */
  public getStationListWidgetTreatment(): string {
    return 'on';
  }

  /**
   * Get the section station containers modal.
   *
   * @returns Split treatment.
   */
  public getStationContainersModalTreatment(): string {
    return 'on';
  }

  /**
   * Get the section account profile photo.
   *
   * @returns Split treatment.
   */
  public getAccountProfilePhotoTreatment(): string {
    return 'on';
  }

  /**
   * Get the section Pre built.
   *
   * @returns Split treatment.
   */
  public getPreBuiltWidgetTreatment(): string {
    return 'on';
  }

  /**
   * Get the section Default Dashboard.
   *
   * @returns Split treatment.
   */
  public getDefaultDashboardTreatment(): string {
    return 'on';
  }

  /**
   * Get assign user from station table widget.
   *
   * @returns Split treatment.
   */
  public getAssignUserWidgetTreatment(): string {
    return 'on';
  }

  /**
   * Get detail dashboard popover.
   *
   * @returns Split treatment.
   */
  public getFieldDetailDashboardPopoverTreatment(): string {
    return 'on';
  }
}
