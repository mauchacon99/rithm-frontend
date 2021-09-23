import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrganizationService } from 'src/app/core/organization.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { User, OrganizationInfo } from 'src/models';

/**
 * Component for managing the toolbar on the map.
 */
@Component({
	selector: 'app-map-toolbar',
	templateUrl: './map-toolbar.component.html',
	styleUrls: ['./map-toolbar.component.scss'],
})
export class MapToolbarComponent implements OnInit {
	/** The users of the organization. */
	users: User[] = [];

	/** The current signed in user. */
	currentUser!: User;

	/** Whether the organization information is loading. */
	orgLoading = false;

	/** The organization information object. */
	orgInfo?: OrganizationInfo;

	constructor(
		private userService: UserService,
		private organizationService: OrganizationService,
		private errorService: ErrorService
	) { }

	/**
	 * Gets the first page of users on load.
	 */
	ngOnInit(): void {
		this.currentUser = this.userService.user;
		this.getOrganizationInfo();
	}

	/**
	 * Sets the map to add flow mode in preparation for a flow to be selected.
	 */
	addFlow(): void {
		// TODO: Implement add flow
	}

	/**
	 * Sets the map to add station mode in preparation for a station to be selected.
	 */
	addStation(): void {
		// TODO: Implement add station
	}

	// MVP +1 below

	// undo(): void {}
	// redo(): void {}
	// search(): void {}

	/**
	 * Gets organization information.
	 */
	getOrganizationInfo(): void {
    //console.log(this.userService.user?.organization)
		this.orgLoading = true;
		//const organizationId: string = this.userService.user?.organizations[0];
		//const organizationId: string = localStorage.getItem('user');
		this.organizationService
			.getOrganizationInfo('CCAEBE24-AF01-48AB-A7BB-279CC25B0989')
			.pipe(first())
			.subscribe(
				(organization) => {
					if (organization) {
						this.orgInfo = organization;
					}
					this.orgLoading = false;
				},
				(error: unknown) => {
					this.orgLoading = false;
					this.errorService.displayError(
						'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
						error
					);
				}
			);
	}
}
