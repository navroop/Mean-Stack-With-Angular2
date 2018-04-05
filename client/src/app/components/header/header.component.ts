import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  formLogin: FormGroup;
  processing = false;
  loginMessage;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }


 ngOnInit() {
   this.createForm();
 }

  createForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  disableForm() {
    this.formLogin.get('username').disable();
    this.formLogin.get('password').disable();
  }

  enableForm() {
    this.formLogin.get('username').enable();
    this.formLogin.get('password').enable();
  }

  loginUser() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.formLogin.get('username').value,
      password: this.formLogin.get('password').value
    };
    this.authService.login(user)
      .subscribe(data => {
        if (!data.success) {
          this.loginMessage = data.message;
          this.processing = false;
          this.enableForm();
        } else {
          this.loginMessage = data.message;
          this.authService.storeUserData(data.token, data.user);
            this.router.navigate(['/dashboard']);
        }
      });
  }

}
