import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formSignup: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  phoneNumberValid;
  phoneNumberMessage;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
   }

   ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formSignup = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      phonenumber: ['', Validators.required],
      password: ['', Validators.required],
      terms: [false, Validators.required]
    });
  }

  disableForm() {
    this.formSignup.get('username').disable();
    this.formSignup.get('phonenumber').disable();
    this.formSignup.get('email').disable();
    this.formSignup.get('password').disable();
    this.formSignup.get('terms').disable();
  }

  enableForm() {
    this.formSignup.get('username').enable();
    this.formSignup.get('phonenumber').enable();
    this.formSignup.get('email').enable();
    this.formSignup.get('password').enable();
    this.formSignup.get('terms').enable();
  }

  createAccount() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.formSignup.get('username').value,
      phonenumber: this.formSignup.get('phonenumber').value,
      email: this.formSignup.get('email').value,
      password: this.formSignup.get('password').value,
      terms: this.formSignup.get('terms').value
    };

    this.authService.registerUser(user)
      .subscribe( data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
          this.enableForm();
        } else {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
        }
      });
  }

  checkEmail() {
    this.authService.checkEmail(this.formSignup.get('enail').value)
    .subscribe( data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkPhoneNumber() {
    this.authService.checkPhoneNumber(this.formSignup.get('phonenumber').value)
    .subscribe( data => {
      if (!data.success) {
        this.phoneNumberValid = false;
        this.phoneNumberMessage = data.message;
      } else {
        this.phoneNumberValid = true;
        this.phoneNumberMessage = data.message;
      }
    });
  }

}
