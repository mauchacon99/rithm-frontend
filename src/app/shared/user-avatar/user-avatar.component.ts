import { Component, Input } from '@angular/core';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ImageData } from 'src/models/index';

/**
 * Reusable component for displaying a user's avatar.
 */
@Component({
  selector: 'app-user-avatar[firstName][lastName][profileImageRithmId]',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
  /** The first name of the user. */
  @Input() firstName!: string;

  /** The last name of the user. */
  @Input() lastName!: string;

  /** Whether this avatar is being used to display the signed in user in the top navigation. */
  @Input() navProfile = false;

  /** Whether to hide the tooltip hover effect for this avatar. */
  @Input() hideToolTip!: boolean;

  /** Whether to show any badge type or not. */
  @Input() badge: 'none' | 'check' | 'minus' | 'plus' = 'none';

  /** Whether the enabled switching badges on mouseover. */
  @Input() hoverEffect = false;

  /** Whether is displayed from the drawer. */
  @Input() isDrawer = false;

  /** If avatars are small. */
  @Input() isSmall = false;

  /** If avatars are large. */
  @Input() isLarge = false;

  /** Profile image Rithm Id. */
  private _profileImageRithmId = '';

  /** Set profile image Rithm Id. */
  @Input() set profileImageRithmId(profileImageRithmId: string) {
    this._profileImageRithmId = profileImageRithmId;
    if (profileImageRithmId) {
      this.getImageUser();
    } else {
      this.classProfileImage = '';
    }
  }

  /**
   * Get profile image id.
   *
   * @returns Profile image idt.
   */
  get profileImageRithmId(): string {
    return this._profileImageRithmId;
  }

  /** Image data. */
  set imageData(image: ImageData) {
    this.classProfileImage = image.imageData;
  }

  /** Load indicator getting image. */
  isLoading = false;

  /** Class to render profile image. */
  classProfileImage = '';

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /**
   * The first + last initials for the user.
   *
   * @returns The initials.
   */
  get initials(): string {
    const firstInitial = this.firstName
      ? this.firstName.charAt(0).toUpperCase()
      : '';
    const lastInitial = this.lastName
      ? this.lastName.charAt(0).toUpperCase()
      : '';

    return firstInitial + lastInitial;
  }

  /** Whether the cursor is hover then change badge content if is enabled. */
  badgeHover = false;

  /**
   * Gets the unicode badge needed for each case.
   *
   * @returns The current badge to be shown.
   */
  getBadge(): string {
    return this.badgeHover
      ? '\u2212'
      : this.badge === 'check'
      ? '\u2714'
      : this.badge === 'plus'
      ? '\u002b'
      : this.badge === 'minus'
      ? '\u2212'
      : '';
  }

  /**
   * Get Image user.
   *
   */
  private getImageUser(): void {
    this.isLoading = true;
    this.documentService
      .getImageUser(this.profileImageRithmId)
      .pipe(first())
      .subscribe({
        next: (imageData) => {
          this.isLoading = false;
          this.imageData = imageData;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.logError(error);
        },
      });
  }
}
