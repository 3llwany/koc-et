export interface MsgReplayVM {
  Attach: string;
  Date: Date;
  Id: number;
  Message: string;
  Username: string;
  UserprofilePicture: string;
  userId: number;
  IsDelete: boolean;
  isTeacher: boolean;
  isLikedByYou: boolean;
  isShown: boolean;
  Likes: number;
  ParentReply: {
    Id: number;
    MessageThreadId: number;
    Message: string;
    Attach: string;
    MessageDate: Date;
    userId: number;
    replyId: number;
    IsDelete: boolean;
    IsShown: boolean;
    Username: string;
  };
}

export interface MsgsVM {
  Id: number;
  MessageDate: string;
  Opened: boolean;
  TeacherSubjectId: number;
  ThreadText: string;
  ThreadUpdateDate: string;
  ar_name: string;
  attach_path: string;
  email: string;
  lastMessage: string;
  LastReply: string;
  subject_ar_name: string;
  userId: number;
}

export interface SchedulingVM {
  Day: string;
  List: [
    {
      CreationDate: Date;
      CreationUserId: number;
      Day: string;
      DayId: number;
      EducationalComponentUserId: number;
      FromHour: Date;
      ToHour: Date;
      classId: number;
      id: number;
      isActive: boolean;
      messageThread: any;
      teacherPicture: any;
      state: boolean;
      teacherName: string;
    }
  ];
}

export interface INewMsgVM {
  ThreadText: string;
  ReplyText: string;
  TeacherSubjectId: number;
  Attach: any;
}

export interface IReplayToMsgVM {
  threadId: number;
  TeacherSubjectIds: number[];
  ParentReplyId: number;
  Attach: any;
  ReplyText: string;
}
