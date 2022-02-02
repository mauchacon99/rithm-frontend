import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from 'src/models/question';

/**
 * Component for station private/all fields in extension panel.
 */
@Component({
  selector: 'app-answers-modal',
  templateUrl: './answers-modal.component.html',
  styleUrls: ['./answers-modal.component.scss'],
})
export class AnswersModalComponent implements OnInit {
  /** Title for the modal. */
  title = '';

  /** Whether display a paragraph or a list. */
  messageType = false;

  /** The question to display the information. */
  question!: Question;

  /** Message to display whether the answer is PlainTextType. */
  stringMessage = '';

  /** Message to display whether the answer is SelectableType. */
  listMessage: {
    /** When the value is checked. */ isChecked: boolean;
    /** Item Value. */ value: string;
  }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      /** Modal title. */
      title: string;
      /** Modal message type. */
      isSelectableType: boolean;
      /** Modal Information Content. */
      information: Question;
    }
  ) {
    this.title = data.title;
    this.messageType = data.isSelectableType;
    this.question = data.information;
  }

  /** Init component information. */
  ngOnInit(): void {
    if (this.messageType) {
      if (this.question.answer && this.question.answer?.asArray) {
        this.question.answer.asArray.forEach((answer) => {
          this.listMessage.push({
            isChecked: answer.isChecked,
            value: answer.value,
          });
        });
      }
    } else {
      if (this.question.answer?.value) {
        this.stringMessage = this.question.answer?.value;
      }
    }
  }
}
