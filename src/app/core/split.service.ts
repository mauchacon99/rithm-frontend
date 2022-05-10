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
   * Get the station document split.
   *
   * @returns Split treatment.
   */
  public getStationDocumentTreatment(): string {
    return this.splitClient.getTreatment('Station-Document-Widgets');
  }

  /**
   * Get the widget settings config.
   *
   * @returns Split treatment.
   */
  public getConfigWidgetsTreatment(): string {
    return this.splitClient.getTreatment('dashboard_widget_settings_split');
  }

  /**
   * Get the dashboard library split.
   *
   * @returns Split treatment.
   */
  public getDashboardLibraryTreatment(): string {
    return this.splitClient.getTreatment('dashboard_library_split');
  }

  /**
   * Get the option the menu dashboard for hidden or show manage members.
   *
   * @returns Split treatment.
   */
  public getManageUserTreatment(): string {
    return this.splitClient.getTreatment('dashboard_manage_users_split');
  }

  /**
   * Get the section Image banner.
   *
   * @returns Split treatment.
   */
  public getStationUploadBannerTreatment(): string {
    return this.splitClient.getTreatment(
      'dashboard_station_banner_upload_split'
    );
  }

  /**
   * Get the section Admin Portal.
   *
   * @returns Split treatment.
   */
  public getAdminPortalTreatment(): string {
    return this.splitClient.getTreatment('admin_portal_split');
  }

  /**
   * Get the section groupHierarchyMenu.
   *
   * @returns Split treatment.
   */
  public getGroupHierarchyMenuTreatment(): string {
    return this.splitClient.getTreatment('permissions_split');
  }

  /**
   * Get the profile banner split.
   *
   * @returns Split treatment.
   */
  public getProfileBannerTreatment(): string {
    return this.splitClient.getTreatment('profile_banner_split');
  }

  /**
   * Get the section group section in add widget modal.
   *
   * @returns Split treatment.
   */
  public getGroupSectionAddWidgetTreatment(): string {
    return this.splitClient.getTreatment('group_widget_split');
  }

  /**
   * Get flow logic treatment.
   *
   * @returns Split treatment.
   */
  public getFlowLogicTreatment(): string {
    return this.splitClient.getTreatment('flow_logic_split');
  }

  /**
   * Get the section group traffic in list-widget-modal.
   *
   * @returns Split treatment.
   */
  public getGroupTrafficTemplateTreatment(): string {
    return this.splitClient.getTreatment('group_traffic_template_split');
  }

  /**
   * Get the section station list section in add widget modal.
   *
   * @returns Split treatment.
   */
  public getStationListWidgetTreatment(): string {
    return this.splitClient.getTreatment('station_lists_templates_split');
  }

  /**
   * Get the section station containers modal.
   *
   * @returns Split treatment.
   */
  public getStationContainersModalTreatment(): string {
    return this.splitClient.getTreatment('station_containers_modal_split');
  }

  /**
   * Get the section account profile photo.
   *
   * @returns Split treatment.
   */
  public getAccountProfilePhotoTreatment(): string {
    return this.splitClient.getTreatment('profile_photo_split');
  }

  /**
   * Get the section Pre built.
   *
   * @returns Split treatment.
   */
  public getPreBuiltWidgetTreatment(): string {
    return this.splitClient.getTreatment('pre_built_widgets_split');
  }

  /**
   * Get the section Default Dashboard.
   *
   * @returns Split treatment.
   */
  public getDefaultDashboardTreatment(): string {
    return this.splitClient.getTreatment('default_dashboard_split');
  }
}
