import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroupByService {
  constructor() {}

  //group response data by DayName
  groupBy(collection: any[], property: string): any[] {
    if (!collection) {
      // return null;
    }
    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }
      return previous;
    }, {});
    return Object.keys(groupedCollection).map((Day) => ({
      Day,
      List: groupedCollection[Day],
    }));
  }
}
