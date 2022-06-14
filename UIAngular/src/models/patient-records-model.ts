export class PatientRecords {
  id: number;
  name: string | null;
  phone: string | null;
  dioptres: number;
  dateOfBirth: Date | null;
  dateOfBirthObject: any | null;
  insertDate: Date | null;
  age: number = 0;
}

export enum Status {
  Completed = 'Completed',
  Incompleted = 'Incompleted',
}
