import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  ibeacon: any = [];
  distance: any = [];
  items: any = [];
  constructor(
    private http: HttpClient,
    private toast: ToastController,
    private alertCtrl: AlertController
  ) {
    this.location();
    this.furtherlocation();
  }

  ngOnInit() {}
  location() {
    var date1: string = new Date().toLocaleDateString('en-US');
    var time1: any = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
    });
    console.log(date1,time1)
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
            var RSSI = response['Items'][i].device_data.RSSI;
            var POWER = response['Items'][i].device_data.POWER;
            var date = response['Items'][i].device_data.DATE;
            var time = response['Items'][i].device_data.TIME;
            var measure = Math.pow(
              10.0,
              (Math.abs(RSSI) - Math.abs(POWER)) / 20
            ).toString();
            let message = 'Distances ' + ': ' + measure + ' Meter';
            if (date == date1) {
              if (time >= time1) {
            if (measure <= '1') {
              this.ibeacon.push(response['Items'][i]);
              for (let i = 0; i < [measure].length; i++) {
                this.distance = message;

                console.log(message);
              }
            }
          }
        }
      }
        } else {
          console.log('error');
        }
      });
  }
  furtherlocation() {
    var date1: string = new Date().toLocaleDateString('en-US');
    var time1: any = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
    });
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
            var RSSI = response['Items'][i].device_data.RSSI;
            var POWER = response['Items'][i].device_data.POWER;
            var date = response['Items'][i].device_data.DATE;
            var time = response['Items'][i].device_data.TIME;
            var measure = Math.pow(
              10.0,
              (Math.abs(RSSI) - Math.abs(POWER)) / 20
            ).toString();
            let message = 'Distances ' + ': ' + measure + ' Meter';

            if (date == date1) {
              if (time >= time1) {
                if (measure >= '5') {
                  this.items.push(response['Items'][i]);
                  for (let i = 0; i < [measure].length; i++) {
                    this.distance = message;

                    console.log(message);
                  }
                }
              }
            }
          }
        } else {
          console.log('error');
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
        'https://awsapilink' +
          '/' +
          UUID,
        httpOptions
      )
      .subscribe(async (data) => {
        console.log(JSON.stringify(data));

        if (data['Item']) {
          // this.ibeacon.push(data["Item"]);
          var RSSI = data['Item'].device_data.RSSI;
          var POWER = data['Item'].device_data.POWER;
          var uuid = data['Item'].UUID;
          var measure = Math.pow(
            10.0,
            (Math.abs(RSSI) - Math.abs(POWER)) / 20
          ).toString();

          let final = 'This item is located ' + measure + ' Meter from you';

          const alert = await this.alertCtrl.create({
            header: 'Details',
            subHeader: final,
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
  refresher(event) {
    window.location.reload();
  }
}
