export interface IGQLMembersResponse {
  data: Data;
}

export interface Data {
  user: User;
}

export interface User {
  id: string;
  name: string;
  anyPinnableItems: boolean;
  avatarUrl: string;
  bioHTML: string;
  companyHTML: string;
  email: string;
}
