import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '@apiService';
import { URLS } from '@urls';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiCallService) { }

  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit(){
    console.log(this.loginForm.get('email').value);
    console.log(this.loginForm.get('password').value);

    let postData = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    this.apiService.login(URLS.POST_LOGIN, postData).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

}
