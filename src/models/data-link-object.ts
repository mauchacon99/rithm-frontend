export interface DataLinkObject {
  /** The rithmid of this datalink. */
  rithmId: string;

  /** The rithmid of the frame that houses this datalink. */
  frameRithmId: string;

  /** The station where the data link was created. */
  sourceStationRithmId: string;

  /** The station where the requested data is found. */
  targetStationRithmId: string;

  /** The rithmid of the question to be used as the unique key in the source station. */
  baseQuestionRithmId: string;

  /** The rithmid of the question to be used as the unique key in the target station. */
  matchingQuestionRithmId: string;

  /** A list of question rithmids. */
  displayFields: string[];
}
