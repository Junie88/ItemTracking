import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  item: any = [];
  stock: any = [];
  Items: any;
  data: any = [];
  DATETIME: string = '';
  UUID: string;
  clickSub: any;
  itemid: string = '';
  itemname: string = '';
  itembrand: string = '';
  itemtype: string = '';
  datetime: string = '';
  constructor(private http: HttpClient, private alertCtrl: AlertController, private toast: ToastController) {
    
    this.getnostock();
    this.getitemdue();
   }

  ngOnInit() {
  }

  getnostock()
  {
    var date1: string = new Date().toLocaleDateString('en-US');
    var time1: string = new Date().toLocaleTimeString('en-GB', {
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
          if (date < date1 == true) {
            
            this.item.push(response['Items'][i]);
            var notify = response['Items'][i].UUID;
            console.log('Item missing for', notify);
             
          }
          else if (date = date1) {
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
  getitemdue() {

    var today = new Date().toLocaleDateString('en-US');
    console.log(today);
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
          if(date != null){
          if (date === today) {
            this.stock.push(response['Items'][i]);
            var notify = response['Items'][i].UUID;
            console.log('Item due for', notify);
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
          //  this.stock.push(data['Item']);
          console.log('stock', this.stock);
          var uuid = 'UUID: ' + data['Item'].UUID;
          var itemn = 'Item Name: ' + data['Item'].IL_NAME;
          var itemid = 'Item ID: ' + data['Item'].IL_ID;
          var itembrand = data['Item'].IL_BRAND;
          var itemtype = data['Item'].IL_TYPE;
         
         
          const alert = await this.alertCtrl.create({
            header: uuid,
            subHeader: itemn,
            message: itemid,
            inputs: [
              {
                name: 'IL_BRAND',
                placeholder: 'Item brand',
                value: itembrand,
              },

              {
                name: 'IL_TYPE',
                placeholder: 'Item Type',
                value: itemtype,
              },
            ],
            buttons: ['OK'],
          });
          (await alert).present();
        }
        else{
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

}
