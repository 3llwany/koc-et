import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceExamPic'
})
export class SliceExamPicPipe implements PipeTransform {

  transform(value: any): any {
    let str = value.search("../Attachments")
    if (str != -1) {
      return value.slice(2);
    }
    else {
      return value;
    }

  }

}
