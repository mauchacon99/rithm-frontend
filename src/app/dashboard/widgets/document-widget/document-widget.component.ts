import { Component, Input, OnInit } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'app-document-widget',
  templateUrl: './document-widget.component.html',
  styleUrls: ['./document-widget.component.scss'],
})
export class DocumentWidgetComponent implements OnInit {
  /** Document rithmId. */
  @Input() documentRithmId = '';

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.documentRithmId = JSON.parse(this.documentRithmId).documentRithmId;
  }
}
