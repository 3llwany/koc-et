export interface IAddEditUserModel {
  user: IUserModel;
  roleId: number;
  EduCompId: any;
}

export interface IUserModel {
  user_ID: number;
  ar_name: string;
  account_email: string;
  mobile: string;
  roleName: string;
  roleId: number;
  account_password: string;
}

export interface IUserViewModel {
  centerBrnachesList: IUserModel[];
  itemsCounts: number;
}

export interface IBranchViewModel {
  Id: number;
  Name: string;
  NameEduCompId: number;
}

export interface IUserBranchFunctionViewModel {
  branchUserList: IUserBranchModel[];
}
export interface IUserBranchModel {
  branchId: number;
  branchName: string;
  from: string;
  to: string;
  roleFunctionsList: IUserFunctionModel[];
}
export interface IUserFunctionModel {
  Id: number;
  functionId: number;
  functionName: string;
  centerBranchUserFuncId: number;
}

export interface IAddUserBranchFunctionsModel {
  roleFunctionsIds: number[];
  branchUser: IBranchUserModel;
}
export interface IBranchUserModel {
  userId: number;
  branchId: number;
  from: Date;
  to: Date;
}
