import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class GiftsService {
  constructor(private http: HttpClient) {}

  addGift(data: any) {
    return this.http.post(environment.apiURL + "Admin/addNewGift", data);
  }

  getGiftByID(giftID: any) {
    return this.http.get(environment.apiURL + "Admin/get-gift-by-id/" + giftID);
  }

  getGiftByCategoryID(CategoryID: any) {
    return this.http.get(
      environment.apiURL + "Admin/getGiftsBank/" + CategoryID
    );
  }

  deleteGift(giftID: any) {
    return this.http.get(environment.apiURL + "Admin/removeGift/" + giftID);
  }

  getCategories() {
    return this.http.get(environment.apiURL + "Admin/getGiftsCategories");
  }

  getCategoryById(Id: any) {
    return this.http.get(
      environment.apiURL + "Admin/get-gift-category-by-id/" + Id
    );
  }

  addEditCategory(body: any) {
    return this.http.post(environment.apiURL + "Admin/category-add-edit", body);
  }

  deleteCategory(catId: any) {
    return this.http.get(
      environment.apiURL + "Admin/removeGiftCategory/" + catId
    );
  }
}
