import { Question } from './question';

// TODO: remove? This really shouldn't be necessary as a separate model. We already know the stationId if we have the questions...
/**
 * Represents all info about a list of questions/fields.
 *
 * @see `QuestionListViewModel` in back end.
 */
export interface QuestionList {
  /** The global Rithm ID for the station that houses the questions. */
  stationRithmId: string;

  /** The list of questions/fields. */
  questions: Question[];
}
