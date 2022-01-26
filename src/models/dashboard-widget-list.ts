import { DashboardItem } from 'src/models';

export interface DashboardWidgetList {
  /** Specific rithm id.*/
  rithmId: string;

  /** Name widget list.*/
  name: string;

  /** List for widgets in the dashbaord. */
  widgets: DashboardItem[];
}
