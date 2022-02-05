import { Directive, HostListener } from '@angular/core';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Directive for recognizing the team for their contributions.
 */
@Directive({
  selector: '[appRecognition]',
})
export class RecognitionDirective {
  /** The sequence of keys pressed by the user. */
  private sequence: string[];

  /** The secret code to activate the recognition alert. */
  private secretCode: string[];

  constructor(private popupService: PopupService) {
    this.sequence = [];
    this.secretCode = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ];
  }

  /**
   * Handle key presses from the user to check against the secret code.
   *
   * @param event The event for the keyboard press.
   */
  @HostListener('window:keydown', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key) {
      this.sequence.push(event.key.toLowerCase());

      if (this.sequence.length > this.secretCode.length) {
        this.sequence.shift();
      }

      if (this.isSecretCode()) {
        this.recognize();
      }
    }
  }

  /**
   * Determines whether the user has entered the secret code.
   *
   * @returns True if the user has entered the secret code, false otherwise.
   */
  private isSecretCode(): boolean {
    return this.secretCode.every(
      (code: string, index: number) => code === this.sequence[index]
    );
  }

  /**
   * Attempts to recognize the team for their contributions, but likely doesn't do it justice.
   */
  private recognize(): void {
    this.popupService.alert({
      title: 'Map Acknowledgement',
      message:
        "Through hard work and some serious learning and discovery, we've been able to achieve something amazing together. " +
        // eslint-disable-next-line max-len
        'Thank you!\n\n• Adarsh Achar\n• Andersson Arellano\n• Austin Bagley\n• Baili Wilkinson\n• Harrison King\n• Manoj Kumar\n• Tyler Hendrickson',
      okButtonText: 'Kudos!',
    });
  }
}
