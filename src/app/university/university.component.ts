import { AngularFireStorage } from '@angular/fire/storage';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { result } from 'lodash';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css']
})


export class UniversityComponent implements OnInit {

  @Input() list: string[] = [
  ];
  // two way binding for input text
    inputItem = '';
    listObs: any;
    posts: any;
    imglink: any;
    team_name: any;
    gotLink: any;
  // enable or disable visiblility of dropdown
  listHidden = true;
  showError = false;
  selectedIndex = -1;
  // the list to be shown after filtering
    filteredList: string[] = [];
    
    constructor(
        private afs: AngularFirestore,
        public ngZone: NgZone,
        public router: Router,
        private storage: AngularFireStorage
  ) { }
    ngOnInit() {
        this.afs.collection("competition").doc("currrentTeam").valueChanges().subscribe((result:any) => {
            this.team_name = result.name
            this.getImgDownloadLink(result.image).then(data=>{
                this.imglink= data;
             }).catch(err => {
                this.imglink= 'nop';
              });     
           
        })
        this.afs.collection("competition").doc("youtube").valueChanges().subscribe((result:any) => {
            this.gotLink = result.link  
           
        })
        this.posts = this.afs.collection("Unimarks", ref => ref.orderBy(`team_name`)).valueChanges().pipe();
        this.listObs = this.afs.collection("Unimarks")
        this.listObs.get().subscribe((data: any)=> {
            data.forEach((data:any) => {
                this.list.push(data.data().team_name);
            });
            console.log(this.list)
        });
        console.log(this.list)
        this.filteredList = this.list;
  }
  // modifies the filtered list as per input
  getFilteredList() {
      this.listHidden = false;
      if (!this.listHidden && this.inputItem !== undefined) {
          this.filteredList = this.list.filter((item) =>  item.toLowerCase().startsWith(this.inputItem.toLowerCase()));
  }
}
  // select highlighted item when enter is pressed or any item that is clicked
  getImgDownloadLink(link:string){
    return new Promise((resolve, reject) => {
      this.storage.storage.refFromURL(link).getDownloadURL().then(url => {
      resolve(url);
      });
    });
  }
  selectItem(ind:any) {
      this.inputItem = this.filteredList[ind];
      this.listHidden = true;
      this.selectedIndex = ind;
  }
  // navigate through the list of items
  onKeyPress(event:any) {
      if (!this.listHidden) {
          if (event.key === 'Escape') {
              this.selectedIndex = -1;
              this.toggleListDisplay(0);
          }else if (event.key === 'Enter') {
              this.toggleListDisplay(0);
          }else if (event.key === 'ArrowDown') {
              this.listHidden = false;
              this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
              if (this.filteredList.length > 0 && !this.listHidden) {
                  document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
              }
          } else if (event.key === 'ArrowUp') {
              this.listHidden = false;
              if (this.selectedIndex <= 0) {
                  this.selectedIndex = this.filteredList.length;
              }
              this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;
              if (this.filteredList.length > 0 && !this.listHidden) {
              document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
              }
          }
      }
  }
  // show or hide the dropdown list when input is focused or moves out of focus
  toggleListDisplay(sender: number) {
      if (sender === 1) {
          this.listHidden = false;
          this.getFilteredList();
      } else {
          // helps to select item by clicking
          setTimeout(() => {
              this.selectItem(this.selectedIndex);
              this.listHidden = true;
              if (!this.list.includes(this.inputItem)) {
                  this.showError = true;
                  this.filteredList = this.list;
              } else {
                  this.showError = false;
              }
          }, 500);
      }
  }
    teamUpdate(data: any) {
        console.log(data)
        this.afs.collection("Unimarks").doc(data).get().subscribe((result: any) => {
            console.log(result.data())
            this.afs.collection("competition").doc("currrentTeam").update({
                name: data,
                image: result.data().image
            });
            
      })
       
    }
    University() {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
    }
    
    setMarks(marks: any, team: string) {
        console.log(team)
        this.afs.collection('Unimarks').doc(team).update({
            overall_score:marks
        })
        
    }
    setLink(link: any) {
        this.afs.collection('competition').doc('youtube').update({
            link
        })
        
    }
}
