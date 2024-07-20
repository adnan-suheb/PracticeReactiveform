import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from './shared/const/validationPattern';
import { EmployeeIdValidation } from './shared/const/empIdValidation';
import { AsyncEmailValidation } from './shared/const/emailAsybcValidation';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'template';

  signUpForm!: FormGroup

  gender: string[] = ["Male", "Female", "Others"];
  countryArr: string[] = [
    'United States',
    'China',
    'India',
    'Indonesia',
    'Pakistan',
    'Brazil',
    'Nigeria',
    'Bangladesh',
    'Russia',
    'Mexico',
    'Japan',
    'Germany',
    'United Kingdom',
    'France',
    'Italy'
  ];
  fieldTextType!:boolean;

  ngOnInit(): void {
    this.createSignUpForm();
    this.isAddressSame();
    this.patchPermanentAddressValue();
    this.patchPermanentAddressValue();
    this.confirmPassStateHandler();
    this.matchConfirmPassword();
  }

  createSignUpForm() {
    this.signUpForm = new FormGroup({
      fname: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
      lname: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
      username: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.username), Validators.minLength(6), Validators.maxLength(20)]),
      email: new FormControl(null,
        [Validators.required, Validators.pattern(CustomRegex.email), Validators.email],
        [AsyncEmailValidation.isEmailValid]),
      empId: new FormControl(null,
        [Validators.required, EmployeeIdValidation.isEmpIdValid]),
      gender: new FormControl(null, [Validators.required]),
      skills: new FormArray([]),
      currentAddress: new FormGroup(
        {
          country: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          city: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          zipcode: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyNumber), Validators.minLength(6), Validators.maxLength(6)]),
        }
      ),
      permanentAddress: new FormGroup(
        {
          country: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          city: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          zipcode: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyNumber), Validators.minLength(6), Validators.maxLength(6)]),
        }
      ),
      isAddressSame: new FormControl({ value: false, disabled: true }),
      password: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.password)]),
      confirmPassword: new FormControl({ value: null, disabled: true }, [Validators.required])
    })
  }

  onSignUpForm() {
    console.log(this.signUpForm.controls);
    console.log(this.signUpForm.getRawValue());
  }

  get controls() {
    return this.signUpForm.controls
  }
  get currentAddControls() {
    return (this.signUpForm.get('currentAddress') as FormGroup).controls;
  }
  get permanentAddControls() {
    return (this.signUpForm.get('permanentAddress') as FormGroup).controls;
  }

  get skillsFormArray() {
    return this.signUpForm.get('skills') as FormArray
  }

  onSkillAdd(data: any) {
    if (this.skillsFormArray.length < 5) {
      let val = (data as HTMLInputElement).value;
      if (val !== '') {
        let newControl = new FormControl(val, [Validators.required])
        this.skillsFormArray.push(newControl);
      }
      (data as HTMLInputElement).value = '';
    }

  }
  onRemove(data: number) {
    this.skillsFormArray.controls.splice(data, 1)
  }


  isAddressSame() {
    this.controls['currentAddress'].valueChanges.subscribe(res => {
      if (this.controls['currentAddress'].valid) {
        this.controls['isAddressSame'].enable();
        this.controls['permanentAddress'].enable();
      } else {
        this.controls['isAddressSame'].disable();
        this.controls['permanentAddress'].disable();
        this.controls['isAddressSame'].patchValue(false);
      }
    })
  }

  patchPermanentAddressValue() {
    this.signUpForm.get('isAddressSame')?.valueChanges.subscribe(res => {
      if (res) {
        this.controls['permanentAddress'].patchValue(this.controls['currentAddress'].value);
        this.controls['permanentAddress'].disable();
      } else {
        this.controls['permanentAddress'].reset();
        this.controls['permanentAddress'].enable();
      }
    })
  }

  confirmPassStateHandler() {
    this.controls['password'].valueChanges.subscribe(res => {
      if (this.controls['password'].valid) {
        this.controls['confirmPassword'].enable();
      } else {
        this.controls['confirmPassword'].disable();
      }
    })
  }
  matchConfirmPassword() {
    this.controls['confirmPassword'].valueChanges.subscribe(res => {
      if (this.controls['password'].value !== res) {
        this.controls['confirmPassword'].setErrors({ invalid: true });
      } else {
        this.controls['confirmPassword'].setErrors(null);
      }
    })
  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType
  }










}
