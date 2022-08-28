
export interface IRolesViewModel {
    Id: number;
    roleName: string;
}


export interface IFunctionsModel {
    Id: number;
    functionName: string;
    function_en_name: string;
    functionURL: string;
}

export interface IRoleFunctionsModel {
    Id: number;
    roleId: number;
    roleName: string;
    function: IFunctionsModel;
}

export interface IAddEditRoleFunctionsModel {
    roleId: number;
    functionsList: number[];
}