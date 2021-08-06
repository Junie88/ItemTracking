import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
@Injectable()
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  constructor(
    private NavCtrl: NavController,
    private http: HttpClient,
    public toast: ToastController
  ) {}

  ngOnInit() {}

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    this.http
      .get(
        'https://awsapilink' +
          username +
          '/' +
          password,
        httpOptions
      )
      .subscribe((response) => {
        console.log(response);

        if (response['Item']) {
          this.toast
            .create({
              message: 'Successfully Login',
              duration: 3000,
            })
            .then((toast) => {
              toast.present();
            });
          this.NavCtrl.navigateForward(['/main']);
        } else if ((response = ['{}'])) {
          this.toast
            .create({
              message: 'Invalid Credential',
              duration: 3000,
            })
            .then((toast) => {
              toast.present();
            });
        }
      });
  }
}
