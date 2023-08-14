import "@tinymce/tinymce-react";
import { Types } from "mongoose";
// Frontend
// declare module "@tinymce/tinymce-react" {
//   interface ExtendedEditor extends Editor {
//     getContent(args?: { format: string }): string;
//   }
// }

export interface QuestionFormType {
  title: string;
  explanation: string;
  expectedBehaviour: string;
  tags: string[];
}

export interface ProfileFormType {
  firstName: string;
  lastName: string;
  username: string;
  portfolioLink: string;
  location: string;
  bio: string;
  picture: string;
}
export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface HotNetworkQuestion {
  id: number;
  question: string;
}

export interface PopularTag {
  id: number;
  name: string;
  count: string;
}

export interface IAnswer {
  _id: Types.ObjectId;
  questionId: Types.ObjectId;
  creatorId: Types.ObjectId;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Question {
  _id: number;
  title: string;
  explanation: string;
  expectedBehaviour: string;
  author: string;
  reputation: number;
  date: string;
  tags: string[];
  voteCount: number;
  viewCount: number;
  answers: IAnswer[];
}

export interface Tag {
  name: string;
  count: number;
}

export interface MockUserData {
  companyLink: string;
  location: string;
  about: string;
  stats: {
    questions: number;
    answers: number;
    goldBadges: number;
    silverBadges: number;
    bronzeBadges: number;
  };
  tags: string[];
}

export interface IQuestion {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId;
  title: string;
  explanation: string;
  expectedBehaviour: string;
  answers?: Array<Types.ObjectId>;
  likes?: Array<Types.ObjectId>;
  views?: number;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  portfolioLink?: string;
  picture: string;
  createdAt: Date;
  questionId: Array<Types.ObjectId>;
  answerId: Array<Types.ObjectId>;
}

export interface Job {
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface QueryParams {
  query: string;
  employment_types: string;
  page: string;
}

export interface JobsProps {
  searchParams: QueryParams;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface Filter {
  searchInput: string;
  location: string;
  employmentType: string;
}
