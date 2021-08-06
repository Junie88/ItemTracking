import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.page.html',
  styleUrls: ['./new-item.page.scss'],
})
export class NewItemPage implements OnInit {
  ibeacon: any = [];
  UUID: string;
  Major: string;
  Minor: string;
  DateTime: string;
  RSSI: string;
  Power: string;
  Items: any = [];
  itemid: string = '';
  itemname: string = '';
  itembrand: string = '';
  itemtype: string = '';
  public date: string = new Date().toLocaleDateString('fr-ca');
  public time: string= new Date().toLocaleTimeString();
  public datetime = this.date +' ' + this.time;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.getitem();
  }

  ngOnInit() {}

  //get item details from ibeacon database
  getitem() {
    var date1: string = new Date().toLocaleDateString('en-US');
    var time1: any = new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Jakarta'});
    console.log(date1)
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

          if (date == date1) {
            if (time >= time1){
            this.ibeacon.push(response['Items'][i]);
            var notify = response['Items'][i].UUID;
            console.log('Item missing for', notify);
            }
          } else {
            console.log("Missing");
          }
        }
      });
  }

  //edit item details
  //send data from ibeacon to item list database
  edititem(trans) {
    if (trans === 'add') {
      let params = JSON.stringify({
        ['UUID']: this.UUID,
        ['IL_ID']: this.itemid,
        ['IL_NAME']: this.itemname,
        ['IL_BRAND']: this.itembrand,
        ['IL_TYPE']: this.itemtype,
        ['IL_DATETIME']: this.date,
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
            this.alertCtrl.create();
          }
        });
    }
    
  }
  //edit in form format
  //this is to safe in item list
  async edit(UUID: string) {
    let IL_ID, IL_NAME, IL_BRAND, IL_TYPE, IL_DATETIME;

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
      .subscribe((response) => {
        console.log(JSON.stringify(response));

        if (response['Item']) {
          UUID ="UUID: "+ response['Item']['UUID'];
        } else {
          console.log('error');
        }
      });

    const alert = await this.alertCtrl.create({
      cssClass: 'Ibeacon',
      header: 'Edit Ibeacon Details',
      message: UUID,
      inputs: [
        {
          name: 'IL_ID',
          type: 'text',
          placeholder: 'Item ID',
          value: IL_ID,
        },
        {
          name: 'IL_NAME',
          type: 'text',
          placeholder: 'Item Name',
          value: IL_NAME,
        },
        {
          name: 'IL_TYPE',
          type: 'text',
          placeholder: 'Item Type',
          value: IL_TYPE,
        },
        {
          name: 'IL_BRAND',
          type: 'text',
          placeholder: 'Item Brand',
          value: IL_BRAND,
        },
        {
          name: 'IL_DATETIME',
          type: 'text',
          placeholder: 'Item DateTime',
          value: this.datetime,
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
            (this.UUID = Items.UUID),
              (this.itemid = Items.IL_ID),
              (this.itemname = Items.IL_NAME),
              (this.itembrand = Items.IL_BRAND),
              (this.itemtype = Items.IL_TYPE),
              (this.date = this.datetime),
              JSON.stringify(this.edititem('add'));
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
   
  }
//delete specific item
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
              .subscribe((response) => {
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
    // window.stop();
    event.target.complete();
  }
}
