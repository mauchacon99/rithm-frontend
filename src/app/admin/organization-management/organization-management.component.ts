import { Component } from '@angular/core';
import { User } from 'src/models';

/**
 * Component for managing the users of an organization.
 */
@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent {

  /** The users to show in the modal. */
  users: User[] = [];

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
    this.users = [{
      firstName: 'Alejandro', lastName: 'Arciniegas', email: 'alejandroarciniegasf@gmail.com',
      rithmId: '', isEmailVerified:true, isAssigned: false, createdDate:'', notificationSettings: '',
      organizations:['none', 'none'], role:'admin',
    },
    {
      firstName: 'Alejandro', lastName: 'Arciniegas', email: 'alejandroarciniegasf@gmail.com',
      rithmId: '', isEmailVerified:true, isAssigned: false, createdDate:'', notificationSettings: '',
      organizations:['none', 'none'], role:'admin',
    },
    {
      firstName: 'Alejandro', lastName: 'Arciniegas', email: 'alejandroarciniegasf@gmail.com',
      rithmId: '', isEmailVerified:true, isAssigned: false, createdDate:'', notificationSettings: '',
      organizations:['none', 'none'], role:'admin',
    },
    {
      firstName: 'Alejandro', lastName: 'Arciniegas', email: 'alejandroarciniegasf@gmail.com',
      rithmId: '', isEmailVerified:true, isAssigned: false, createdDate:'', notificationSettings: '',
      organizations:['none', 'none'], role:'admin',
    }];

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
