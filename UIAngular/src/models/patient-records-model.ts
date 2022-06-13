export class PatientRecords {
  id: number;
  name: string | null;
  phone: string | null;
  dioptres: number | null;
  dateOfBirth: Date | null;
  insertDate: Date | null;
}

export enum Status {
  Completed = 'Completed',
  Incompleted = 'Incompleted',
}
