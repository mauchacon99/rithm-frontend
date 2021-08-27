import { Component } from '@angular/core';

/**
 * Component for managing the users of an organization.
 */
@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent {
  /** Whether the account settings is loading. */
  isLoading = false;

  /** The current page number. */
  activeNum = 1;

  /** Total number of users in this organization. */
  totalNumUsers = 0;

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getUsers(1);
  }

  /**
   * Gets a page list of users.
   *
   * @param pageNum The desired page of user results.
   */
  getUsers(pageNum: number): void {
    this.activeNum = pageNum;
    //temporary functionality below:
    this.totalNumUsers = pageNum;

  // --the functionality to retrieve users will be similar to the below.--
    // this.isLoading = true;

    // this.documentService.getStationDocuments(this.stationRithmId, pageNum)
    //   .pipe(first())
    //   .subscribe((documentsResponse) => {
    //     if (documentsResponse) {
    //       this.documents = documentsResponse.documents;
    //       this.totalNumDocs = documentsResponse.totalDocuments;
    //       this.userType = documentsResponse.userType;
    //     }
    //     this.isLoading = false;
    //   }, (error: unknown) => {
    //     this.isLoading = false;
    //     this.dialogRef.close();
    //     this.errorService.displayError(
    //       'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
    //       error
    //     );
    //   });
  }
}
