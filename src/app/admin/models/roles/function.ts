import { IFunctionsModel } from "./roles";

export interface IFunctionViewModel {
    functions: IFunctionsModel[];
    itemsCount: number;
}

export interface IAddEditFunctionModel {
    Id: number;
    functionName: string;
    function_en_name: string;
    functionURL: string;
}


export interface IBranchesViewModel {
    centerBrnachesList: IBranchModel[];
    itemsCount: number;
}
export interface IBranchModel {
    Id: number;
    Name: string;
    districtId: number;
    EduCompId: number;
    districtName: string;
}

export interface IAddEditBranchModel {
    Id: number;
    EduCompId: number;
    Name: string;
    districtId: number;
}

export interface IDistrictDropModel {
    Id: number;
    Ar_Name: string;
}

