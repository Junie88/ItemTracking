import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-overdue',
  templateUrl: './overdue.page.html',
  styleUrls: ['./overdue.page.scss'],
})
export class OverduePage implements OnInit {
  stock: any = [];
  futurestock: any = [];
  todaystock: any = [];
  UUID: string = '';
  itemid: string = '';
  itemname: string = '';
  itembrand: string = '';
  itemtype: string = '';
  public date: string = new Date().toLocaleDateString('en-US');
  public time: string = new Date().toLocaleTimeString('en-GB');
  public datetime = this.date + ' ' + this.time;
  due: string = '';
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.getitem();
  }

  ngOnInit() {}
  getitem() {
    console.log(this.datetime);
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
          var date = response['Items'][i].IL_DUE;
          console.log(date)
          if (date != 0) {
            if (date < this.datetime == true) {
             const arr= new Array( date);
             arr.sort();
             console.log(arr)
              this.stock.push(response['Items'][i]);
              var notify = response['Items'][i].UUID;
              console.log('Item due for', notify);
            }
          }
          if (date > this.datetime == true) {
            const arr = new Array(date);
            arr.reverse();
            console.log(date);
            this.futurestock.push(response['Items'][i]);
            var notify = response['Items'][i].UUID;

            console.log('Item due for', notify);
          }
        }
      });
  }
  editdetails(trans) {
    if (trans === 'edit') {
      let params = JSON.stringify({
        ['UUID']: this.UUID,
        ['IL_ID']: this.itemid,
        ['IL_NAME']: this.itemname,
        ['IL_BRAND']: this.itembrand,
        ['IL_TYPE']: this.itemtype,
        ['IL_DATETIME']: this.date,
        ['IL_DUE']: this.due,
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

          if (response['Put item']) {
            console.log('item updated');
            
          } else {
            this.alertCtrl.create();
          }
        });
    }
  }
  async edit(UUID: string) {
    let IL_ID, IL_NAME, IL_BRAND, IL_TYPE, IL_DATETIME, IL_DUE,valid;
    valid = true;
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    await this.http
      .get(
        'https://awsapilink' + UUID,
        httpOptions
      )
      .subscribe(async (response) => {
        console.log(JSON.stringify(response));

        if (response['Item']) {
          UUID = response['Item'].UUID;
          IL_ID = response['Item'].IL_ID;
          IL_NAME = response['Item'].IL_NAME;
          IL_BRAND = response['Item'].IL_BRAND;
          IL_TYPE = response['Item'].IL_TYPE;
          IL_DUE = response['Item'].IL_DUE;
          const alert = await this.alertCtrl.create({
            cssClass: 'Items',
            header: 'Edit Item Details',
            inputs: [
              {
                name: 'UUID',
                type: 'text',
                placeholder: 'UUID (Required)',
                value: UUID,
              },
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
              {
                name: 'IL_DUE',
                // type: 'date',
                placeholder: 'Item Due (m/dd/yyyy)',
                value: IL_DUE,
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
                    (this.due = Items.IL_DUE),
                    JSON.stringify(this.editdetails('edit'));
                  console.log(Items);
                  if(this.UUID ==""){
                    
                    valid = false;
                    this.toast
                    .create({
                      message: 'Insert Failed.Please add UUID',
                      duration: 3000,
                    })
                    .then((toast) => {
                      toast.present();
                    });
                   }
                  
                  else{
                    this.toast
                  .create({
                    message: 'Successfully Updated',
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
        } else {
          console.log('undefined');
        }
        //refresh after update
      });
  }
  refresher(event) {
    window.location.reload();
  }
}
