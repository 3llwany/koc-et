export interface gift {
  Id: number;
  description: string;
  giftCategoryId: number;
  giftEn_Name: string;
  giftName: string;
  giftPicture: any;
  giftPictureFileBase: any;
  giftPoints: number;
  giftQuantity: number;
}

export interface giftCategory {
  Id: number;
  CategoryGiftsCount: number;
  CategoryEn_Name: string;
  CategoryName: string;
}
