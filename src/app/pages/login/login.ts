import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/service/user';
import { GLOBAL_CONSTANT } from '../../core/constant/global';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  isSignup = false;

  selectedRole: 'HR' | 'Employee' = 'Employee';

  fullName = '';
  email = '';
  employeeId = '';
  password = '';
  confirmPassword = '';

  newCreateReqObj: any = {
    employeeId: 0,
    employeeName: "",
    contactNo: "",
    emailId: "",
    deptId: "",
    password: "",
    gender: "",
    role: "",
  }
  loginObj: any = { emailId: "", password: "" };
  userService = inject(User);
  router = inject(Router);
  http = inject(HttpClient);

  toggleAuth(): void {
    this.isSignup = !this.isSignup;

    // Clear form fields
    this.fullName = '';
    this.email = '';
    this.employeeId = '';
    this.password = '';
    this.confirmPassword = '';
  }

  submitForm(): void {
    debugger;

    if (this.isSignup) {

      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      console.log('Registration Details:', {
        fullName: this.fullName,
        email: this.email,
        employeeId: this.employeeId,
        password: this.password,
        role: this.selectedRole
      });
      this.userService.CreateUser(this.newCreateReqObj).subscribe({
        next: (res: any) => {
          // debugger;
          if (res.result) {
            localStorage.setItem(GLOBAL_CONSTANT.LOCAL_LOGIN_KEY, JSON.stringify(res.data.employee));
            localStorage.setItem(GLOBAL_CONSTANT.LOCAL_TOKEN_KEY, res.data.token);
            // this.router.navigate(['admin/clinet-list'])
          } else {
            alert(res.message)
          }
        },
        error: (error: any) => {

        }
      });

      // alert('Registration form submitted!');

    } else {

      console.log('Login Details:', {
        email: this.email,
        password: this.password,
      });
      // alert('Login form submitted!');
      this.userService.loginUser(this.loginObj).subscribe({
        next: (res: any) => {
          // debugger;
          if (res.result) {
            localStorage.setItem(GLOBAL_CONSTANT.LOCAL_LOGIN_KEY, JSON.stringify(res.data.employeeId));
            localStorage.setItem(GLOBAL_CONSTANT.LOCAL_TOKEN_KEY, res.data.token);
            this.router.navigate(['dashboard'])
          } else {
            alert(res.message)
          }
        },
        error: (error: any) => {

        }
      });
    }
  }
}
