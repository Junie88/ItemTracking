import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-nostock',
  templateUrl: './nostock.page.html',
  styleUrls: ['./nostock.page.scss'],
})
export class NostockPage implements OnInit {
  item: any = [];
  stock: any = [];
  Items: any;
  data: any = [];
  DATETIME: string = '';
  UUID: string;

  itemid: string = '';
  itemname: string = '';
  itembrand: string = '';
  itemtype: string = '';
  datetime: string = '';

  constructor(
    private http: HttpClient,
    private NavCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.getstock();
  }

  ngOnInit() {}
  getstock() {
    var date1: string = new Date().toLocaleDateString('en-US');
    var time1: any = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
    });

    console.log(time1);
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

        for (let i = 0; i < response['Items'].length; i++) {
          var date = response['Items'][i].device_data.DATE;
          var time = response['Items'][i].device_data.TIME;

          console.log(time);
          console.log(date);

          if (date < date1 == true) {
            this.item.push(response['Items'][i]);
            var notify = response['Items'][i].UUID;
            console.log('Item missing for', notify);
          } else if ((date = date1)) {
            console.log('here');
            if (time < time1) {
              this.item.push(response['Items'][i]);
              var notify = response['Items'][i].UUID;
              console.log('Item missing for', notify);
            }
          }
        }
      });
  }
  async details(UUID: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    this.http
      .get(
        'https://awsapilink' + UUID,
        httpOptions
      )
      .subscribe(async (data) => {
        console.log(data);

        if (data['Item']) {
          this.stock.push(data['Item']);
          console.log('stock', this.stock);
          var uuid = 'UUID: ' + data['Item'].UUID;
          var itemn = 'Item Name: ' + data['Item'].IL_NAME;
          var itemid = 'Item ID: ' + data['Item'].IL_ID;
          var itembrand = data['Item'].IL_BRAND;
          var itemtype = data['Item'].IL_TYPE;
          console.log('here1', itemn, itemid);
          // this.alertCtrl.create();
          const alert = await this.alertCtrl.create({
            header: uuid,
            subHeader: itemn,
            message: itemid,
            inputs: [
              {
                name: 'IL_BRAND',
                value: itembrand,
              },

              {
                name: 'IL_TYPE',
                value: itemtype,
              },
            ],
            buttons: ['OK'],
          });
          (await alert).present();
        } else {
          this.toast
            .create({
              message: 'Unable to find details for this data',
              duration: 3000,
            })
            .then((toast) => {
              toast.present();
            });
        }
      });
  }

  async delete(UUID: string) {
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
                  UUID,
                httpOptions
              )
              .subscribe((response) => {});
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

  refresher(event) {
    window.location.reload();
    event.target.complete();
  }
}
