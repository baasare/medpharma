import {User} from "./user.model";

export class Consultation {
  id!: String;
  date!: string
  officer!: User;
  patient!: User;
  consultation_type!: string;
  healthcare_provider!: String;
  condition!: String;
  notes!: String;
  medication!: String;
  status!: string;
}
