import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.page.html',
  styleUrls: ['./item-list.page.scss'],
})
@Injectable()
export class ItemListPage implements OnInit {
  stock: any = [];
  UUID: string = '';
  itemid: string = '';
  itemname: string = '';
  itembrand: string = '';
  itemtype: string = '';
  due: string = '';
  public date: string = new Date().toLocaleDateString('en-US');
  public time: string = new Date().toLocaleTimeString('en-GB');
  public datetime = this.date + ' ' + this.time;
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.getitem();
  }

  ngOnInit() {}
  getitem() {
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
            this.stock.push(response['Items'][i]);
          }
        } else {
          console.log('error');
        }
      });
  }
  // edit items detail
  edit(trans) {
    if (trans === 'add') {
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
  async edititem(UUID: string) {
    let IL_ID, IL_NAME, IL_BRAND, IL_TYPE, IL_DATETIME, IL_DUE;

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
          IL_DUE = 'Due : ' + response['Item'].IL_DUE;

          const alert = await this.alertCtrl.create({
            cssClass: 'Items',
            header: 'Edit Item Details',
            message: IL_DUE,
            inputs: [
              {
                name: 'UUID (Required)',
                type: 'text',
                placeholder: 'UUID',
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
                    JSON.stringify(this.edit('add'));
                  console.log(Items);
                },
              },
            ],
          });
          await alert.present();
        } else {
        }
      });
  }
  // delete items
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
  async additems() {
    let UUID, IL_ID, IL_NAME, IL_BRAND, IL_TYPE, IL_DATETIME, IL_DUE, valid;
    valid = true;
    const alert = await this.alertCtrl.create({
      cssClass: 'Items',
      header: 'Add Item',
      message: IL_DUE,
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
              JSON.stringify(this.edit('add'));
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

  refresher(event) {
    window.location.reload();
  }
}
