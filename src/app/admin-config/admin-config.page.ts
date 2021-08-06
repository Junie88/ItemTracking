import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.page.html',
  styleUrls: ['./admin-config.page.scss'],
})
@Injectable()
export class AdminConfigPage implements OnInit {
  admin: any = [];
  id: number;
  username: string;
  password: string;
  datetime: string;
  public item: any;
  public date: string = new Date().toLocaleDateString();
  public time: string= new Date().toLocaleTimeString('en-GB');
 
  constructor(
    private http: HttpClient,
    private NavCtrl: NavController,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.getgroup();
  }

  ngOnInit() {}

  getgroup() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    this.http
      .get(
        'https://awsapilink',
        httpOptions
      )
      .subscribe((response) => {
        console.log(JSON.stringify(response));
        if (response['Items']) {
          for (let i = 0; i < response['Items'].length; i++) {
            this.admin.push(response['Items'][i]);
          }
        } else {
          console.log('Undefined');
        }
      });

  }
  edit(trans) {
    
    if (trans === 'add') {
      let params = JSON.stringify({
        ['A_USERNAME']: this.username,
        ['A_PASSWORD']: this.password,
        ['A_ID']: this.id,
        ['A_DATETIME']: this.datetime,
      });

      console.log(params);

      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      };
      this.http
        .put(
          'https://awsapilink',
          params,
          httpOptions
        )
        .subscribe((response) => {
          console.log(response);

          if (response['Items']) {
            console.log('item updated');
          } else {
          }
        });
    }    
  }


async addadmin(){
  
  let A_USERNAME, A_PASSWORD, A_ID, A_DATETIME,valid;
  let now  =  this.date +' ' +this.time;
  valid = true;
        const alert = await this.alertCtrl.create({
          cssClass: 'Admin',
          header: 'Add User',
          inputs: [
            
            {
              name: 'A_ID',
              type: 'text',
              placeholder: 'Admin ID',
              value: A_ID,
            },
            {
              name: 'A_USERNAME',
              type: 'text',
              placeholder: 'Admin Username',
              value: A_USERNAME,
            },
            {
              name: 'A_PASSWORD',
              type: 'text',
              placeholder: 'Admin Password',
              value: A_PASSWORD,
            },
            {
              name: 'A_DATETIME',
              type: 'text',
              placeholder: 'DateTime',
              value: now,
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'Ok',
              handler: (Items) => {
                (this.id = Items.A_ID),
                  (this.username = Items.A_USERNAME),
                  (this.password = Items.A_PASSWORD),
                  (this.datetime = now),
                  JSON.stringify(this.edit('add'));
                console.log(Items);
                
                  if(this.username ==""){
                    
                    valid = false;
                    this.toast
                    .create({
                      message: 'Insert Failed.Please add valid Username & Password',
                      duration: 3000,
                    })
                    .then((toast) => {
                      toast.present();
                    });
                   }
                  
                  else{
                    this.toast
                  .create({
                    message: 'Successfully Added',
                    duration: 3000,
                  })
                  .then((toast) => {
                    toast.present();
                  });
                  }
              },
            },
          ],
        });
        await alert.present();
  
}
  async editadmin(username: string, password: string) {
    let A_USERNAME, A_PASSWORD, A_ID, A_DATETIME;
    let now  =  this.date +' ' +this.time;
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
      .subscribe(async (response) => {
        console.log(JSON.stringify(response));

        if (response['Item']) {
          A_ID = response['Item'].A_ID;
          A_USERNAME = response['Item'].A_USERNAME;
          A_PASSWORD = response['Item'].A_PASSWORD;
          A_DATETIME = response['Item'].A_DATETIME;

          const alert = await this.alertCtrl.create({
            cssClass: 'Admin',
            header: 'Edit Admin Details',
            inputs: [
              {
                name: 'A_ID',
                type: 'text',
                placeholder: 'Admin ID',
                value: A_ID,
              },
              {
                name: 'A_USERNAME',
                type: 'text',
                placeholder: 'Admin Username',
                value: A_USERNAME,
              },
              {
                name: 'A_PASSWORD',
                type: 'text',
                placeholder: 'Admin Password',
                value: A_PASSWORD,
              },
              {
                name: 'A_DATETIME',
                type: 'text',
                placeholder: 'DateTime',
                value: now,
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                },
              },
              {
                text: 'Ok',
                handler: (Items) => {
                  (this.id = Items.A_ID),
                    (this.username = Items.A_USERNAME),
                    (this.password = Items.A_PASSWORD),
                    (this.datetime = now),
                    JSON.stringify(this.edit('add'));
                  console.log(Items);
                  this.toast
                    .create({
                      message: 'Successfully Updated',
                      duration: 3000,
                    })
                    .then((toast) => {
                      toast.present();
                    });
                },
              },
            ],
          });
          await alert.present();
        } else {
          console.log('error');
        }
      });
  }

  async delete(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    const alert = await this.alertCtrl.create({
      header: 'Delete Item',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          role: 'Ok',
          cssClass: 'danger',
          handler: () => {
            this.http
              .delete(
                'https://awsapilink' +
                  username +
                  '/' +
                  password,
                httpOptions
              )
              .subscribe((response) => {
                console.log(response);
              });
            this.toast
              .create({
                message: 'Successfully Deleted',
                duration: 3000,
              })
              .then((toast) => {
                toast.present();
              });
          },
        },
      ],
    });
    await alert.present();
    
  }
  refresher(event){
    window.location.reload();
  }
}
