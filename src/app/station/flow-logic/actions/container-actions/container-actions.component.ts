/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Question, QuestionFieldType, Station } from 'src/models';
import { MatSelectChange } from '@angular/material/select';

/** Container action tab. */
@Component({
  selector: 'app-container-actions',
  templateUrl: './container-actions.component.html',
  styleUrls: ['./container-actions.component.scss'],
})
export class ContainerActionsComponent implements OnInit {
  /** Data filtered to show autocomplete. */
  filteredOptionsAutocomplete$!: Observable<Station[]>;

  /** Whether the user is adding a new container action. */
  addingAction = false;

  /** List of stations to display with the autocomplete. */
  stations: Station[] = [
    {
      rithmId: '1',
      name: 'myStation I',
      instructions: '',
    },
    {
      rithmId: '2',
      name: 'myStation II',
      instructions: '',
    },
    {
      rithmId: '3',
      name: 'myStation III',
      instructions: '',
    },
  ];

  /** Current station questions deployed in shared values. */
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
  ];

  /** Component form. */
  conditionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.conditionForm = this.fb.group({
      conditionType: ['', Validators.required],
      conditionStations: [[], Validators.required],
      conditionStationsFilter: ['', []],
      conditionSharedValues: [[], Validators.required],
    });
  }

  /**
   * Init Method.
   */
  ngOnInit(): void {
    this.listenAutocomplete$();
  }

  /** Listen changes in autocomplete. */
  private listenAutocomplete$(): void {
    this.filteredOptionsAutocomplete$ =
      this.conditionForm.controls.conditionStationsFilter.valueChanges.pipe(
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
  private filterAutocomplete(value: string): Station[] {
    const filterValue = value.toLowerCase();
    const dataFiltered = [] as Station[];
    this.stations.map((station) => {
      if (station.name.toLowerCase().includes(filterValue)) {
        dataFiltered.push(station);
      }
    });
    return dataFiltered;
  }

  /**
   * Remove the selected station form the array of stations selected.
   *
   * @param stationId The id of the station to remove.
   */
  public removeStation(stationId: string): void {
    const stations: Station[] =
      this.conditionForm.controls.conditionStations.value;
    const targetStation = stations.find(
      (station) => station.rithmId === stationId
    );
    if (targetStation) {
      stations.splice(stations.indexOf(targetStation), 1);
      this.conditionForm.controls.conditionStations.setValue(stations);
    }
  }

  /**
   * Clear the form when selecting a type for this condition.
   *
   * @param typeSelected The current type selected.
   */
  public clearForm(typeSelected: MatSelectChange): void {
    this.conditionForm.controls.conditionType.setValue(typeSelected.value);
    this.conditionForm.controls.conditionStations.setValue([]);
    this.conditionForm.controls.conditionSharedValues.setValue([]);
  }
}
