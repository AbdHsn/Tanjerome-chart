export class PatientRecords {
  id: number;
  name: string | null;
  phone: string | null;
  dioptres: number;
  dateOfBirth: Date | null;
  dateOfBirthObject: any | null;
  insertDate: Date | null;
  age: number = 0;
  chartData: ChartData;
}

export enum Status {
  Completed = 'Completed',
  Incompleted = 'Incompleted',
}
export class ChartData {
  label: number[] = [];
  data: number[] = [];
}
