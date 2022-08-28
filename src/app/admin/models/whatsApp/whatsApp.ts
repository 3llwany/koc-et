
export interface IWhatsAppMsgModel {
    adminEducationCompanyId: number;
    msg: string;
    sendToStudentWhatsApp: boolean;
    sendToFatherWhatsApp: boolean;
    sendToMotherWhatsApp: boolean;
    file: IFileToUpload;
}


export interface IFileToUpload {
    name: string;
    size: string;
    type: string;
    LastModified: number;
    LastModifiedDate: Date;
    FileAsBase64: string;
}

export interface IWhatsAppResponse {
    isSendAllSuccess: boolean;
    errors: string[];
}