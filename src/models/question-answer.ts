/**
 * The answer of the question.
 */
export interface QuestionAnswer {

  /** The Id Specific Question.*/
  questionRithmId: string;

  /** The references attribute.*/
  referAttribute: string;

  /** Whether the current question has multiple answers in it.*/
  asArray: [];

  /** Whether the current question has int answer.*/
  asInt: number;

  /** Whether the current question has decimal answer.*/
  asDecimal: number;

  /** Whether the current question has string answer.*/
  asString: string;

  /** Whether the current question has date answer.*/
  asDate: string;

  /** The value of the Answer.*/
  value: string;
}
