import {
  MapStationHelper,
  StationGroupMapElement,
  StationMapElement,
} from 'src/helpers';
import { MapItemStatus, MapMode } from 'src/models';
import { MapHelper } from './map-helper';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';

/**
 * Represents methods that handle station data for the Map.
 */
export class MapStationGroupHelper {
  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** An array that stores a backup of stationGroupElements when buildMap is called. */
  storedStationGroupElements: StationGroupMapElement[] = [];

  /** The copy of station group which is being edited. */
  tempStationGroup$ = new BehaviorSubject({});

  /** Informs the map when station group elements have changed. */
  stationGroupElementsChanged$ = new BehaviorSubject(false);

  /** If station group option button was clicked. */
  stationGroupOptionButtonClick$ = new BehaviorSubject({
    click: false,
    data: {},
  });

  constructor(private mapHelper: MapHelper) {}

  /**
   * Validates that station groups belong to exactly one immediate parent station group.
   */
  validateStationGroupsBelongToExactlyOneStationGroup(): void {
    // Each station group should belong to exactly one station group.
    for (const stationGroup of this.stationGroupElements) {
      const stationGroupsThatContainThisStationGroup =
        this.stationGroupElements.filter((stationGroupElement) =>
          stationGroupElement.subStationGroups.includes(stationGroup.rithmId)
        );
      if (stationGroupsThatContainThisStationGroup.length > 1) {
        // eslint-disable-next-line no-console
        console.error(
          // eslint-disable-next-line max-len
          `The station group ${stationGroup.rithmId}: ${stationGroup.title} is contained in ${stationGroupsThatContainThisStationGroup.length} station groups!`
        );
      } else if (
        !stationGroupsThatContainThisStationGroup.length &&
        !stationGroup.isReadOnlyRootStationGroup
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `No station groups contain the station group: ${stationGroup.title} ${stationGroup.rithmId}`
        );
      }
    }
  }

  /**
   * Cancels local station groups changes.
   */
  cancelStationGroupsChanges(): void {
    //Make sure that there are copies stored.
    if (this.storedStationGroupElements.length > 0) {
      //Revert stationGroupElements to a copy of storedStationGroupElements and reset storedStationGroupElements.
      this.stationGroupElements = this.mapHelper.deepCopy(
        this.storedStationGroupElements
      );
      this.storedStationGroupElements = [];
    }
  }

  /**
   * Copy the station group Elements in stationGroupElements.
   */
  stationGroupsDeepCopy(): void {
    this.storedStationGroupElements = this.mapHelper.deepCopy(
      this.stationGroupElements
    );
  }

  /**
   * Delete the station group and find it's parent to move all it's stations and sub groups to parent station group.
   *
   * @param stationGroupId The incoming station group Id to be deleted.
   */
  removeStationGroup(stationGroupId: string): void {
    // Find the station group from this.stationGroupElements array.
    const removedGroup = this.stationGroupElements.find(
      (group) => group.rithmId === stationGroupId
    );
    if (!removedGroup) {
      throw new Error('Station group was not found.');
    }
    //set up a boolean to check if an error needs to be thrown because there is no parent group.
    let parentGroupFound = false;
    this.stationGroupElements.forEach((group) => {
      if (
        //Find parent station group of incoming station group.
        group.subStationGroups.includes(removedGroup.rithmId)
      ) {
        parentGroupFound = true;
        //Remove deleting station group Id from it's parent group
        group.subStationGroups = group.subStationGroups.filter(
          (groupId) => groupId !== removedGroup.rithmId
        );
        //Move all sub station groups of deleted station group to it's parent.
        group.subStationGroups = group.subStationGroups.concat(
          removedGroup.subStationGroups
        );
        //Move all stations of deleted station group to it's parent.
        group.stations = group.stations.concat(removedGroup.stations);
        //Mark parent station group of deleted station group as updated.
        group.markAsUpdated();
        //Remove all stations of deleting station group.
        removedGroup.stations = [];
        //Remove all sub station groups of deleting station group.
        removedGroup.subStationGroups = [];
        //Unless removedGroup has status of created or pending, mark removedGroup as deleted.
        if (
          removedGroup.status !== MapItemStatus.Created &&
          removedGroup.status !== MapItemStatus.Pending
        ) {
          removedGroup.markAsDeleted();
          //Splice created or pending groups out of the stationGroupElements array and remove it from it's parent's subStationGroup array.
        } else {
          const subGroupWithoutDeleted = group.subStationGroups.filter(
            (subGroup) => subGroup !== stationGroupId
          );
          group.subStationGroups = subGroupWithoutDeleted;
          const pendingIndex = this.stationGroupElements.findIndex(
            (pendingGroup) => {
              return pendingGroup.rithmId === removedGroup.rithmId;
            }
          );
          this.stationGroupElements.splice(pendingIndex, 1);
        }
        //Note a change in map data.
        this.mapHelper.mapDataReceived$.next(true);
      }
    });
    if (!parentGroupFound) {
      throw new Error(
        `No parent station group could be found for ${stationGroupId}.`
      );
    }
  }

  /**
   * Updates pendingStationGroup with the current selected stations and groups.
   *
   * @param stationHelper The map station helper reference.
   */
  updatePendingStationGroup(stationHelper: MapStationHelper): void {
    //Set up blank pending group.
    let newGroup = new StationGroupMapElement({
      rithmId: uuidv4(),
      title: 'Pending',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Pending,
      isChained: false,
      isReadOnlyRootStationGroup: false,
    });

    //Update the name of station group to newly edited one, if it's changed by user
    const createStationGroup = this.stationGroupElements.find(
      (group) =>
        group.status === MapItemStatus.Pending && group.title !== 'Pending'
    );
    if (createStationGroup) {
      newGroup.title = createStationGroup.title;
    }

    if (this.mapHelper.mapMode$.value === MapMode.StationGroupEdit) {
      const editStationGroup = this.stationGroupElements.find(
        (group) => group.status === MapItemStatus.Pending
      );
      if (!editStationGroup) {
        throw new Error(`There is no station group with status pending.`);
      }
      //Set up pending group for edit.
      newGroup = new StationGroupMapElement({
        rithmId: editStationGroup.rithmId,
        title: editStationGroup.title,
        stations: editStationGroup.stations,
        subStationGroups: editStationGroup.subStationGroups,
        status: MapItemStatus.Pending,
        isChained: editStationGroup.isChained,
        isReadOnlyRootStationGroup: false,
      });
    }

    /* There should only ever be one pending group in the stationGroupElements array,
    recursively delete every pending group that already exists so we can add a new one. */
    const deletePending = () => {
      const pendingIndex = this.stationGroupElements.findIndex(
        (pendingGroup) => {
          return pendingGroup.status === MapItemStatus.Pending;
        }
      );
      if (pendingIndex !== -1) {
        this.removeStationGroup(
          this.stationGroupElements[pendingIndex].rithmId
        );
        deletePending();
      }
      return;
    };
    deletePending();

    //All stations currently selected.
    const selectedStations = stationHelper.stationElements.filter(
      (station) => station.selected
    );

    //All groups currently selected.
    const selectedGroups = this.stationGroupElements.filter(
      (group) => group.selected
    );

    //Filter the selected stations to only contain stations outside the selected groups.
    const outsideStations = selectedStations.filter((station) => {
      //Find index of group that contains station.
      const groupIndex = selectedGroups.findIndex((group) => {
        return group.stations.includes(station.rithmId);
      });
      //if index is -1 return true.
      return groupIndex === -1;
    });

    //Filter the selected groups so that only parent groups are in the array.
    const parentGroups = selectedGroups.filter((group) => {
      const groupIndex = selectedGroups.findIndex((otherGroup) => {
        return otherGroup.subStationGroups.includes(group.rithmId);
      });
      //if index is -1 return true.
      return groupIndex === -1;
    });

    //Set inner stations as disabled.
    stationHelper.stationElements.map((station) => {
      if (
        selectedStations.some((selected) => selected === station) &&
        !outsideStations.some((outside) => outside === station)
      ) {
        return (station.disabled = true);
      } else if (outsideStations.some((outside) => outside === station)) {
        return (station.disabled = false);
      } else {
        return;
      }
    });

    //Set child groups as disabled.
    this.stationGroupElements.map((stationGroup) => {
      if (
        selectedGroups.some((selected) => selected === stationGroup) &&
        !parentGroups.some((parent) => parent === stationGroup)
      ) {
        return (stationGroup.disabled = true);
      } else if (parentGroups.some((parent) => parent === stationGroup)) {
        return (stationGroup.disabled = false);
      } else {
        return;
      }
    });

    //Get the rithmIds of the outsideStations.
    const outsideStationIds = outsideStations.map((station) => station.rithmId);

    //Get the rithmIds of the parentGroups.
    const parentGroupIds = parentGroups.map((group) => group.rithmId);

    //Add the station and group ids to the newGroup.
    newGroup.stations = [...outsideStationIds];
    newGroup.subStationGroups = [...parentGroupIds];

    //If there are any selected stations or groups in newGroup, add it to the stationGroupElements array.
    if (newGroup.stations.length > 0 || newGroup.subStationGroups.length > 0) {
      //set up a boolean to check if an error needs to be thrown because there is no parent group.
      let parentGroupFound = false;
      /* Edit the group that will house newGroup to include it in it's list of subgroups,
      and remove the stations and subgroups contained in newGroup from parent. */
      this.stationGroupElements.forEach((group) => {
        if (
          //Find parent station group that houses stations or subgroups that will be added to newGroup.
          group.stations.some((station) =>
            newGroup.stations.includes(station)
          ) ||
          group.subStationGroups.some((subGroup) =>
            newGroup.subStationGroups.includes(subGroup)
          )
        ) {
          parentGroupFound = true;
          //Remove every station from parent group that newGroup contains.
          const remainingStations = group.stations.filter((stationId) => {
            return !newGroup.stations.some(
              (newGroupStation) => newGroupStation === stationId
            );
          });
          group.stations = remainingStations;
          //Remove every subGroup from parent group that newGroup contains.
          const remainingSubGroups = group.subStationGroups.filter(
            (groupId) => {
              return !newGroup.subStationGroups.some(
                (newGroupSubGroup) => newGroupSubGroup === groupId
              );
            }
          );
          group.subStationGroups = remainingSubGroups;
          //Add newGroup to list of subgroups.
          group.subStationGroups.push(newGroup.rithmId);
          //Mark parent group as updated.
          group.markAsUpdated();
        }
      });
      if (!parentGroupFound) {
        throw new Error(`No parent station group could be found.`);
      }
      this.stationGroupElements.push(newGroup);
      //Note a change in map data.
      this.mapHelper.mapDataReceived$.next(true);
    }
  }

  /**
   * Update the selected status of all parent station-group and stations of incoming station-group id.
   *
   * @param stationGroupId The incoming station-group id.
   */
  updateParentStationGroup(stationGroupId: string): void {
    const rootStationGroup = this.stationGroupElements.find(
      (f) => f.rithmId === stationGroupId
    );
    if (rootStationGroup?.isReadOnlyRootStationGroup) {
      return;
    }
    this.stationGroupElements.forEach((stationGroup) => {
      if (
        stationGroup.subStationGroups.includes(stationGroupId) &&
        !stationGroup.isReadOnlyRootStationGroup
      ) {
        stationGroup.disabled = false;
        this.updateParentStationGroup(stationGroup.rithmId);
      }
    });
  }

  /**
   * Update the selected status of all descendent station-group and stations of incoming station-group.
   *
   * @param stationGroup The incoming station-group data.
   * @param stationHelper The map station helper reference.
   */
  updateChildStationGroup(
    stationGroup: StationGroupMapElement,
    stationHelper: MapStationHelper
  ): void {
    const isSelected = stationGroup.selected;
    stationGroup.subStationGroups.forEach((subStationGroupId) => {
      const subStationGroup = this.stationGroupElements.find(
        (group) => group.rithmId === subStationGroupId
      );
      if (!subStationGroup) {
        throw new Error(
          `Couldn't find a sub-flow for which an id exists: ${subStationGroupId}`
        );
      }
      subStationGroup.selected = isSelected ? true : false;
      subStationGroup.stations.map((st) => {
        const stationIndex = stationHelper.stationElements.findIndex(
          (station) => station.rithmId === st
        );
        stationHelper.stationElements[stationIndex].selected = isSelected
          ? true
          : false;
      });
      this.updateChildStationGroup(subStationGroup, stationHelper);
    });
  }

  /**
   * Reset disable and true status to false when a station-group is deselected.
   *
   * @param stationHelper The map station helper reference.
   */
  resetSelectedStationGroupStationStatus(
    stationHelper: MapStationHelper
  ): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.selected = false;
      stationGroup.disabled = false;
      stationGroup.stations.map((station) => {
        const stationIndex = stationHelper.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        stationHelper.stationElements[stationIndex].selected = false;
        stationHelper.stationElements[stationIndex].disabled = false;
      });
    });
  }

  /**
   * Set station group status of parent and child station group and respective stations.
   *
   * @param stationGroup The incoming station-group data.
   * @param stationHelper The map station helper reference.
   */
  setStationGroupStatus(
    stationGroup: StationGroupMapElement,
    stationHelper: MapStationHelper
  ): void {
    //Update parent station-group and respective stations status.
    this.updateParentStationGroup(stationGroup.rithmId);
    //Update descendent station-group and respective stations status.
    this.updateChildStationGroup(stationGroup, stationHelper);
    //Reset status of each station-group and station if nothing(station group or station) has been selected.
    if (
      !stationHelper.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus(stationHelper);
    }
  }

  /**
   * Set disable status to true before updating station-group and station status so that only current stationGroup is enabled to de-select.
   *
   * @param stationHelper The map station helper reference.
   */
  setStationGroupStationStatus(stationHelper: MapStationHelper): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.disabled = true;
      stationGroup.stations.map((station) => {
        const stationIndex = stationHelper.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        if (!stationHelper.stationElements[stationIndex].selected) {
          stationHelper.stationElements[stationIndex].disabled = true;
        }
      });
    });
  }

  /**
   * Based on incoming station selection, update the status of related stations and station group.
   *
   * @param station The incoming station.
   * @param stationHelper The map station helper reference.
   */
  setSelectedStation(
    station: StationMapElement,
    stationHelper: MapStationHelper
  ): void {
    this.stationGroupElements.map((stationGroup) => {
      if (station.selected) {
        if (stationGroup.stations.includes(station.rithmId)) {
          stationGroup.stations.map((st) => {
            const stationIndex = stationHelper.stationElements.findIndex(
              (sta) => sta.rithmId === st
            );
            stationHelper.stationElements[stationIndex].disabled = false;
          });
          stationGroup.disabled = false;
          stationGroup.subStationGroups.forEach((subStationGroupId) => {
            const stationGroupIndex = this.stationGroupElements.findIndex(
              (group) => group.rithmId === subStationGroupId
            );
            this.stationGroupElements[stationGroupIndex].disabled = false;
          });
          return;
        }
      } else {
        //If removing a selected station need to find the group that pending group is inside.
        if (stationGroup.status === MapItemStatus.Pending) {
          //const to reference the parent of the pending group.
          const parentGroup = this.stationGroupElements.find(
            (parentStationGroup) => {
              return parentStationGroup.subStationGroups.includes(
                stationGroup.rithmId
              );
            }
          );
          if (parentGroup) {
            parentGroup.stations.map((st) => {
              const stationIndex = stationHelper.stationElements.findIndex(
                (sta) => sta.rithmId === st
              );
              stationHelper.stationElements[stationIndex].disabled = false;
            });
            parentGroup.disabled = false;
            parentGroup.subStationGroups.forEach((subStationGroupId) => {
              const stationGroupIndex = this.stationGroupElements.findIndex(
                (group) => group.rithmId === subStationGroupId
              );
              this.stationGroupElements[stationGroupIndex].disabled = false;
            });
            return;
          }
        }
      }
    });
    if (
      !stationHelper.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus(stationHelper);
    }
  }

  /**
   * Update the status to create for a new station group.
   *
   * @param rithmId The specific rithm Id of the station group.
   * @param stationHelper The map station helper reference.
   */
  updateCreatedStationGroup(
    rithmId: string,
    stationHelper: MapStationHelper
  ): void {
    const stationGroupIndex = this.stationGroupElements.findIndex(
      (stationGroup) => stationGroup.rithmId === rithmId
    );
    if (stationGroupIndex === -1) {
      throw new Error(`There is not any station group with this rithmId.`);
    }
    if (this.mapHelper.mapMode$.value === MapMode.StationGroupAdd) {
      //If group name is already changed from "Pending" assign updated one else set "Untitled Group"
      this.stationGroupElements[stationGroupIndex].title =
        this.stationGroupElements[stationGroupIndex].title === 'Pending' ||
        this.stationGroupElements[stationGroupIndex].title === '' ||
        !this.stationGroupElements[stationGroupIndex].title
          ? 'Untitled Group'
          : this.stationGroupElements[stationGroupIndex].title;
      this.stationGroupElements[stationGroupIndex].status =
        MapItemStatus.Created;
      //If edited group already present in storedStationGroupElements, then it's the one which is already created
      //so set it's status to Updated, else Created
    } else if (this.mapHelper.mapMode$.value === MapMode.StationGroupEdit) {
      if (
        this.storedStationGroupElements.some(
          (group) =>
            group.rithmId ===
            this.stationGroupElements[stationGroupIndex].rithmId
        )
      ) {
        this.stationGroupElements[stationGroupIndex].status =
          MapItemStatus.Updated;
      } else {
        this.stationGroupElements[stationGroupIndex].status =
          MapItemStatus.Created;
      }
    }

    this.resetSelectedStationGroupStationStatus(stationHelper);
  }

  /**
   * Remove deleted and set normal status for station groups.
   */
  removeDeletedAndSerNormalStationGroup(): void {
    this.stationGroupElements = this.stationGroupElements.filter(
      (e) => e.status !== MapItemStatus.Deleted
    );

    this.stationGroupElements.forEach(
      (stationGroup) => (stationGroup.status = MapItemStatus.Normal)
    );
  }

  /**
   * Revert the changes made across station group in edit mode.
   *
   * @param stationHelper The map station helper reference.
   */
  revertStationGroup(stationHelper: MapStationHelper): void {
    if (this.mapHelper.mapMode$.value === MapMode.StationGroupEdit) {
      if (!(this.tempStationGroup$.value instanceof StationGroupMapElement)) {
        throw new Error(`There is no temporary station group available.`);
      }
      const rithmId = this.tempStationGroup$.value.rithmId;
      const groupIndex = this.stationGroupElements.findIndex(
        (group) => group.rithmId === rithmId
      );
      if (groupIndex === -1) {
        throw new Error(
          `There is no station group available to replace tempGroup.`
        );
      }
      this.stationGroupElements[groupIndex] = this.tempStationGroup$.value;
      this.tempStationGroup$.next({});
      //Remove station rithm id's from other groups to make make sure a station has got only one parent.
      this.stationGroupElements[groupIndex].stations.map((stationRithmId) => {
        this.stationGroupElements.map((group) => {
          if (
            group.stations.includes(stationRithmId) &&
            group.rithmId !== this.stationGroupElements[groupIndex].rithmId
          ) {
            group.stations = group.stations.filter(
              (stationId) => stationId !== stationRithmId
            );
          }
        });
      });
      //Remove station group rithm id's from other groups to make sure a group has got only one parent.
      this.stationGroupElements[groupIndex].subStationGroups.map(
        (subGroupRithmId) => {
          this.stationGroupElements.map((group) => {
            if (
              group.subStationGroups.includes(subGroupRithmId) &&
              group.rithmId !== this.stationGroupElements[groupIndex].rithmId
            ) {
              group.subStationGroups = group.subStationGroups.filter(
                (groupId) => groupId !== subGroupRithmId
              );
            }
          });
        }
      );
      this.resetSelectedStationGroupStationStatus(stationHelper);
      this.mapHelper.mapDataReceived$.next(true);
    }
  }
}
