import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NavController, ToastController} from '@ionic/angular';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

 

  constructor(private NavCtrl: NavController, private http:HttpClient, private toast: ToastController) { 
   
  }

  ngOnInit() {
  }

  adminconfig(){
    this.NavCtrl.navigateForward(['/admin-config'])
   
    
  }
  newitem(){
    this.NavCtrl.navigateForward(['/new-item'])
 
  }
  itemlist(){
    this.NavCtrl.navigateForward(['/item-list'])
   
  }
  nostock(){
    this.NavCtrl.navigateForward(['/nostock'])
   
  }
  overdue(){
    this.NavCtrl.navigateForward(['/overdue'])
    
  }
  notification(){
    this.NavCtrl.navigateForward(['/notification']);
   
  }
  
  logout (){
    this.toast
    .create({
      message: 'You have successfully logout',
      duration: 3000,
    })
    .then((toast) => {
      toast.present();
    });
    this.NavCtrl.navigateForward(['/login'])
    window.location.reload();
    window.stop();
  }

  location(){
    
    this.NavCtrl.navigateForward(['/location'])
    
  }

}
