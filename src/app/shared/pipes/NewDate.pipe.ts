import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NewDate'
})
export class NewDatePipe implements PipeTransform {

  transform(value: any): any {

    var allDate = value.split('T');
    var thisDate = allDate[0].split('-');
    var newDate = [thisDate[2], thisDate[1], thisDate[0]].join("-");

    return newDate;
  }

}
