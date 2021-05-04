import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-requirements',
  templateUrl: './password-requirements.component.html',
  styleUrls: ['./password-requirements.component.scss']
})
export class PasswordRequirementsComponent implements OnInit {

  @Input()
  passReq: any;

  @Input()
  match: any;

  constructor() {
    // constructor
  }

  ngOnInit(): void {
  }

}
