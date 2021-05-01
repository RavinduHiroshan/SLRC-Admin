import { UniversityComponent } from './../university/university.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, NgZone, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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
    private afs: AngularFirestore,
    public ngZone: NgZone,
    public router: Router,
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
    this.authService.readData('Marks').doc(team).valueChanges().subscribe(result => {
      console.log(result);
      this.Score = result;
      this.OverallScore = this.Score['Overall_Score']
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


  setMarks(teamName: string, task: any, data: any, s:any) {
    let sb = `sb${task}_${s}`
    this.afs.collection('Marks').doc(teamName).update({
      [task]: Number(data)
      
    })
    this.afs.collection('Users').doc(this.id).update({
      [sb]: String(data)+`sb${s}`
    })
  }
  setMarks2(teamName: string,value: any) {
    this.afs.collection('Marks').doc(teamName).update({
      Overall_Score: Number(value)
    })
  }
  University() {
    this.ngZone.run(() => {
      this.router.navigate(['university']);
    });
  }

}
