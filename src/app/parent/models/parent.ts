import { year } from "app/admin/models/admin/educations";
import { user } from "../../shared/models/general/general";

export interface IParentChidrenViewModel {
  ChildrenParentId: number;
  Email: string;
  Code: string;
  IsRequestAccepted: number;
}

export interface IParentChildrenDropModel {
  ChildId: number;
  StudentId: number;
  ChildName: string;
  isActive: boolean;
}

export interface ParentViewModule {
  email: string;
  mobile: string;
  name: string;
  userId: number;
  parentId: number;
}

export interface childViewModule {
  childId: number;
  email: string;
  name: string;
  userId: number;
  year: year;
}

export interface IChildrenTeachersViewModel {
  TeacherId: number;
  TeacherName: string;
  TeacherDegree: number;
}

export interface ITeacherRateModel {
  teacherId: number;
  rate: number;
}
