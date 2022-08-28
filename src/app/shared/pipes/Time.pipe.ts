import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Time'
})
export class TimePipe implements PipeTransform {

  transform(value: any): any {

    if (value) {
      let x = value.search("T");
      if (x != -1) {
        var allDate = value.split('T');
        var thisTime = allDate[1].split(':');
        var suffix = thisTime[0] >= 12 ? "PM" : "AM";
        var hour = thisTime[0] > 12 ? thisTime[0] - 12 : thisTime[0];
        var hour = thisTime[0] == '00' ? 12 : thisTime[0];
        var hour = hour < 10 ? "0" + hour : hour;
        var min = thisTime[1];
        var sec = thisTime[2];
        var newTime = (hour > 12 ? hour - 12 : hour) + ':' + min + ' ' + suffix;

        return newTime;
      }
      else {
        var thisTime = value.split(':');
        var suffix = thisTime[0] >= 12 ? "PM" : "AM";
        var hour = thisTime[0] > 12 ? thisTime[0] - 12 : thisTime[0];
        var hour = thisTime[0] == '00' ? 12 : thisTime[0];
        var hour = thisTime[0] < 10 ? "0" + thisTime[0] : thisTime[0];
        var min = thisTime[1];
        var sec = thisTime[2];
        var newTime = (hour > 12 ? hour - 12 : hour) + ':' + min + ' ' + suffix;

        return newTime;
      }
    }

  }

}
