/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith, Subject } from 'rxjs';
import { Question, QuestionFieldType, Station } from 'src/models';
import { MatSelect } from '@angular/material/select';

interface Website {
  /***/id: string;
  /***/name: string;
}

/** Container action tab. */
@Component({
  selector: 'app-container-actions',
  templateUrl: './container-actions.component.html',
  styleUrls: ['./container-actions.component.scss'],
})
export class ContainerActionsComponent implements OnInit {
  /** Whether the user is adding a new container action. */
  addingAction = false;

  /** Autocomplete stations. */
  stations: Station[] = [
    {
      rithmId: '1234',
      name: 'myStation I',
      instructions: ''
    },
    {
      rithmId: '12345',
      name: 'myStation II',
      instructions: ''
    },
  ];

  /** Autocomplete stations. */
  currentStationFields: Question[] = [
    {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
    {
      prompt: 'Fake question 2',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
  ];

  conditionForm: FormGroup;

  /** MultiSelect Example. */

  protected websites: Website[] = [
    {id: '1', name: 'ItSolutionStuff.com'},
    {id: '2', name: 'HDTuto.com'},
    {id: '3', name: 'Nicesnippets.com'},
    {id: '4', name: 'Google.com'},
    {id: '5', name: 'laravel.com'},
    {id: '6', name: 'npmjs.com'},
    {id: '7', name: 'Google2.com'},
  ];

  /** Data filtered to show autocomplete. */
  filteredOptionsAutocomplete$!: Observable<Station[]>;

  public websiteMultiCtrl: FormControl = new FormControl();

  public websiteMultiFilterCtrl: FormControl = new FormControl();


  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;

  protected _onDestroy$ = new Subject();

  constructor(
    private fb: FormBuilder
  ){
    this.conditionForm = this.fb.group({
      conditionType: ['', []],
      conditionStations: ['', []],
      conditionStationsFilter: ['', []],
      conditionSharedValues: [[], []],
    });
  }

  /**
   * Write code on Method.
   *
   */
   ngOnInit(): void {
    this.listenAutocomplete$();
  }

  /** Listen changes in autocomplete. */
  private listenAutocomplete$(): void {
    this.filteredOptionsAutocomplete$ = this.websiteMultiFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((value) => this.filterAutocomplete(value))
    );
  }

  /**
   * Filter data on autocomplete input.
   *
   * @param value String to filter.
   * @returns Data filtered.
   */
   private filterAutocomplete(
    value: string
  ): Station[] {
    const filterValue = value.toLowerCase();
    const dataFiltered = [] as Station[];
    this.stations.map((station) => {
      if (station.name.toLowerCase().includes(filterValue)) {
        dataFiltered.push(station);
      }
    });
    return dataFiltered;
  }
}
