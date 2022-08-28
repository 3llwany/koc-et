import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";

export class CustomeValidator {
  // No White Space
  static whiteSpace(control: AbstractControl): ValidationErrors | null {
    if (((control.value as string) || "").trim().length === 0) {
      return { whiteSpace: true };
    }
    return null;
  }

  // No minus numbers
  static minusNum(control: AbstractControl): ValidationErrors | null {
    if ((control.value as number) < 0) {
      return { minusNum: true };
    }
    return null;
  }

  static bigZero(control: AbstractControl): ValidationErrors | null {
    if ((control.value as number) <= 0) {
      return { bigZero: true };
    }
    return null;
  }

  static ZeroLength(control: AbstractControl): ValidationErrors | null {
    if (control.value.length <= 0) {
      return { ZeroLength: true };
    }
    return null;
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors! && !matchingControl.errors?.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  static rchargeAmount(control: AbstractControl): ValidationErrors | null {
    if (control.value < 10 || control.value > 1000) {
      return { rchargeAmount: true };
    }
    return null;
  }

  static noSpace(control: AbstractControl): ValidationErrors | null {
    if (
      control.value.length > 0 &&
      (control.value as string).trim().indexOf(" ") >= 0
    ) {
      return { noSpace: true };
    }
    return null;
  }

  static startsWith(control: AbstractControl): ValidationErrors | null {
    if (
      control.value.length > 0 &&
      !(control.value as string).startsWith("01")
    ) {
      return { startsWith: true };
    }
    return null;
  }
}
