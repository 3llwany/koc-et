export interface Expression {
  Id: number;
  Ar_Name: string;
  En_Name: string;
  ToTeacher: boolean;
}

export interface myAppreciation {
  Ar_Name: string;
  En_Name: string;
  creationDate: Date;
  fromuserName: string;
  userImage: string;
}

export interface appreciationMsg {
  Id: number;
  Ar_Name: string;
  En_Name: string;
}
