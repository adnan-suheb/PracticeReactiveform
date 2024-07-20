import { AbstractControl, ValidationErrors } from "@angular/forms"


export class AsyncEmailValidation {
    static isEmailValid(control: AbstractControl): Promise<ValidationErrors | null> {

        let val = control.value as string
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (val === "jd@gmail.com") {
                    resolve({
                        emailExist: 'Email already in use.'
                    });
                }
                else {
                    resolve(null)
                }
            }, 1000);
        });
    }
}
