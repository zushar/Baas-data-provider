enum Resource {
  RECORDS = 'records',
  USERS = 'users',
  PROJECTS = 'projects',
  MEMBERS = 'members',
  MENTORS = 'mentors',
}

// Define a type with keys from the Resource enum and boolean values
type ResourceRoles = Partial<{ [K in keyof typeof Resource]: boolean }>;

export type CrudUserRole =
  | 'admin'
  | ResourceRoles
  | Record<string, never> /* for {} */;

export interface IUser {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  role: CrudUserRole;
}

export interface ICredentials extends Pick<IUser, 'username' | 'password'> {}

export interface ILoginResponse extends Omit<IUser, 'password'> {}
