export type RecordType = MemberRecord | ProjectRecord | MentorRecord;

export enum CoreRecordTypeName {
  Member = 'Member',
  Project = 'Project',
  Mentor = 'Mentor',
}

export interface ICoreRecord {
  record: RecordType;
  type: CoreRecordTypeName;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: Date | null;
}

export interface MemberRecord {
  name: string;
  discordUser: string;
  links: {
    github: string;
    linkedIn: string;
  };
  description: string;
}

export interface ProjectRecord {
  githubLink: string;
  discordLink: string;
}

export interface MentorRecord {
  stud: null;
}
