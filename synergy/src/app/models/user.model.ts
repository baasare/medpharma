
export class User {
  id!: String;
  email!: String;
  first_name!: string;
  last_name!: string;
  phone_number!: String;
  user_type!: string;
  is_active!: String;
  date_joined!: string;
}

export class NewUser {
  email!: String;
  first_name!: String;
  last_name!: String;
  phone_number!: String;
  user_type!: String;
  password!: String;
}
