import { Injectable, NgZone } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import *  as  data from 'data copy.json';
import { Dictionary, result } from 'lodash';
declare var require:any;
const FileSaver = require('file-saver');
var UserList:any= []

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private basePath = '/Submission';
  userData: any;
  

  constructor(
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private functions: AngularFireFunctions,
  ) {
    this.firebaseAuth.authState.subscribe(user =>{
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        if (this.userData.uid == 'CSwtJHMo9phJPT4SnhF6lYU5XVc2') {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
          
        } else {
          this.SignOut()
        }
      }else{
        localStorage.removeItem('user');
      }
    })
  }
  
  async SignIn(email:string,password:string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
      .then(result => {
        this.userData = result.user;
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('uid', this.userData.uid);
        if (this.userData.uid == 'CSwtJHMo9phJPT4SnhF6lYU5XVc2') {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
          
        } else {
          this.SignOut()
        }
        
      
    }).catch((error)=>{
      window.alert(error.message)
    })
  }
  
  SignOut(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('uid');
    this.router.navigate(['signIn']);

  }

  async createUser() {
    let products = (data as any).default;
    let no = 0
    for (var val of products) {
      no++;
      let name = val["team_name"].replace(/\s/g, "").toLowerCase();
      let username = name + '@slrc.com';
      let paswwd = val["password"];
      console.log(no,username,paswwd);
      await this.firebaseAuth.createUserWithEmailAndPassword(username, paswwd).then((result:any) => {
        var Users:Dictionary<string> = {};
        Users['id'] = result.user.uid;
        Users['teamName'] = val["team_name"];
        console.log(Users)
        this.db.collection(`Users`).doc(`${result.user.uid}`).set({
          id: result.user.uid,
          teamName: val["team_name"]
        });
        UserList.push(Users)
      });       
    }
    console.log(UserList)
    for (var user of UserList) {
      console.log(user['id'])
      await this.db.collection(`Usersddd`).doc(`w5K3HqehFOeCHyLZ5BFI9FQPqdi1`).set({
          id: user['id'],
          teamName: user['teamName']
        });
    }


  
  }
  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return (user !== null) ? true : false;
  }


  get routeGuard(): boolean {
    this.firebaseAuth.authState.subscribe(user => {
      if(!user){
        this.router.navigate(['signIn']);
      } 
    })
    return true;
  }

  readData(collection: any) {
    return this.db.collection(collection);
  }


  downloadLink(link:string){
    this.storage.storage.refFromURL(link).getDownloadURL().then(url => {
      FileSaver.saveAs(url);
    })
  }
  downloadLink2(link:string){
    this.storage.storage.refFromURL(link).getDownloadURL().then(url => {
      return url;
    })
  }

}
