import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { Dictionary, result } from 'lodash';
var userTask: any[] = [];
let imgae: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
  


export class DashboardComponent implements OnInit {
  posts: Observable<any> | undefined;
  selectedUser: Observable<any> | undefined;
  posts_length: any;
  dataSource: any[] = [];
  submission = {};
  bo = false;
  team = '';
  Score: any;
  id = '';
  OverallScore: any;
  
  index=1;
  taskNum:any;

  constructor(
    public authService: FirebaseService,
    private afs:AngularFirestore
  ) {
  }

  ngOnInit(): void {
    this.posts = this.afs.collection("Users", ref => ref.orderBy(`teamName`)).valueChanges().pipe();
  }

  read(val: string, team: string, id: string) {
    this.id = id;
    this.team = team;
    console.log(team)
    this.bo = true;
    this.selectedUser = this.afs.collection(`Users/${val}/Submission`).valueChanges().pipe();
    this.authService.readData('Marks').doc(team).get().subscribe(result => {
      console.log(result.data());
      this.Score = result.data();
      this.OverallScore = this.Score['OverallScore']

    })
  }
  back() {
    this.bo = false;
  }
  download(link: string) {
    const lin = `gs://slrc-school.appspot.com/${link}`
    console.log(lin)
    this.authService.downloadLink(lin)
  }
  time(utcDate: string) {
    // ISO-8601 formatted date returned from server utcDate:string
    var localDate = new Date(utcDate);
    return localDate;
  }

  show() {
    const lin = `gs://slrc-school.appspot.com/Tasks/1/Did you know 4.png`
    console.log(lin)
    imgae = this.authService.downloadLink2(lin)
  }


  // click(id: string,uid:string) {
  //   console.log(id)
  //   // 1. Select the div element using the id property
  //   const app = document.getElementById(id);
  //   // 2. Create a new <p></p> element programmatically
  //   const p = document.createElement("li");
  //   // 3. Add the text content
  //   const value = this.authService.readData(`Users/${uid}/Submission`).get().forEach(data => {
  //     data.forEach(data => {
  //       const doc: any = data.data();
  //       console.log(doc);
        
  //     })
  //   })
  //   p.textContent = "Hello, World!";
  //   // 4. Append the p element to the div element
  //   app?.appendChild(p);
  // }
  setMarks(teamName: string, task: any, data: any, s:any) {
    let sb = `sb${task}_${s}`
    this.afs.collection('Marks').doc(teamName).update({
      [task]: data
      
    })
    this.afs.collection('Users').doc(this.id).update({
      [sb]: data
    })

  }

  
  hello() {
    
  }

}
