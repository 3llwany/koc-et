export interface ICahsPaymentsTableMV {
  CreateBranchId: number;
  CreatedByUserId: number;
  CreationDate: Date;
  Date: Date;
  EditedDate: Date;
  EditedUserId: number;
  EduCompId: number;
  Id: number;
  UpdateBranchId: number;
  amount: number;
  centerId: number;
  centerName: string;
  cowpay_reference_id: string;
  currency_code: string;
  customer_merchant_profile_id: number;
  invoice_id: number;
  invoice_key: null;
  merchant_reference_id: string;
  order_status: string;
  payment_gateway_reference_id: string;
  payment_method: string;
  state: any;
  teacherId: number;
  teacherName: string;
}