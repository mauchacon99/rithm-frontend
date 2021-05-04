import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-requirements',
  templateUrl: './password-requirements.component.html',
  styleUrls: ['./password-requirements.component.scss']
})
export class PasswordRequirementsComponent implements OnInit {

  @Input()
  requirements: any;

  constructor() {
    // constructor
  }

  ngOnInit(): void {
  }

}
