export interface IUserBalanceVM {
  userBalance: IuserBalance;
}

export interface IuserBalance {
  ActualBalance: number;
  Balance: number;
  Expenses: number;
  amount: number;
  card_number: any;
  creditCard: any;
  cvv: any;
  expiry_month: any;
  expiry_year: any;
}

export interface IGetPaymentsVM {
  itemsCount: number;
  userPaymentsHistoryList: IUserPaymentsVM[];
}

export interface IGetPaymentsHistoryVM {
  itemsCount: number;
  userPaymentsHistoryListModified: IUserPaymentsHistoryVM[];
}

export interface IGetUserPaymentsVM {
  totalCount: number;
  userPayments: IUserPaymentsVM[];
}

export interface IGetUserPaymentsHistoryVM {
  totalCount: number;
  userPayments: IUserPaymentsHistoryVM[];
}
export interface IUserPaymentsVM {
  CreatedByUserId: number;
  Date: Date;
  EduCompId: number;
  Id: number;
  amount: number;
  cowpay_reference_id: string;
  currency_code: string;
  customer_merchant_profile_id: number;
  invoice_id: any;
  invoice_key: any;
  merchant_reference_id: string;
  order_status: string;
  payment_gateway_reference_id: string;
  payment_method: string;
  teacherId: number;
}

export interface IUserPaymentsHistoryVM {
  BeforeDiscount: number;
  Code: number;
  CustomDiscountId: number;
  CustomDiscountValue: number;
  Date: Date;
  date: Date;
  Description: number;
  Discount: number;
  DiscountType: number;
  Id: number;
  Payment_Method_EduCompId: number;
  Payment_Method_ID: number;
  amount: number;
  fullPrice: number;
  itemId: number;
  itemTypeArName: string;
  item_type_name: string;
  itemTypeEnName: string;
  itemTypeId: number;
  partName: string;
  material_name: string;
  subject_name: string;
  serviceProviderId: number;
  uTeacherId: number;
  userId: number;
}

export interface studentStatusVM {
  discounts: string;
  fromDate: Date;
  note: string;
  toDate: Date;
  code: string;
  groupName: string;
  statusAr: string;
  statusEn: string;
  userName: string;
}
