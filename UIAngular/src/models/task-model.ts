export class Tasks {
  id: number = 0;
  title: string | null;
  details: string | null;
  progress_ratio: number;
  status: string | null;
  insert_date: Date;
}

export enum TaskStatus {
  Completed = 'Completed',
  InProgress = 'InProgress',
  Incompleted = 'Incompleted',
}
