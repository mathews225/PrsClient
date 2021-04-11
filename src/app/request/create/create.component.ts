import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Requestline } from 'src/app/requestline/requestline.class';
import { RequestlineService } from 'src/app/requestline/requestline.service';
import { SystemService } from 'src/app/system.service';
import { User } from 'src/app/user/user.class';
import { UserService } from 'src/app/user/user.service';
import { Request } from '../request.class';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-request-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class RequestCreateComponent implements OnInit {

  request: Request = new Request();
  requestlines: Requestline[];
  users: User[];
  currentUser: number;
  waiting: boolean = false;


  constructor(
    private syssvc: SystemService,
    private requestsvc: RequestService,
    private requestlinesvc: RequestlineService,
    private usersvc: UserService,
    private router: Router
  ) { }

  isAdmin(): boolean {
    return this.syssvc.isAdmin();
  }

  save(): void {
    this.request.userId = this.syssvc.loggedInUser.id;
    console.log("Before Create:", this.request);
    this.requestlinesvc.list().subscribe(
      res => {
        this.waiting = !this.waiting;
        console.log("Requestlines:", res);
        this.requestlines = res as Requestline[];
      },
      err => {
        this.waiting = !this.waiting;
        console.error(err)
      }
    );

    this.requestsvc.create(this.request).subscribe(
      res => {
        this.waiting = !this.waiting;
        console.log(`Created Successfully`);
        this.router.navigateByUrl("/request/list");
      },
      err => {
        this.waiting = !this.waiting;
        console.warn(err)
      }
    )
  }

  ngOnInit(): void {
    this.syssvc.verifyLogin();

    this.requestlinesvc.list().subscribe(
      res => {
        this.waiting = !this.waiting;
        console.log("Requestlines:", res);
        this.requestlines = res as Requestline[];
      },
      err => {
        this.waiting = !this.waiting;
        err
      }
    );
    this.usersvc.list().subscribe(
      res => {
        this.waiting = !this.waiting;
        console.log("Requestlines:", res);
        this.users = res as User[];
      },
      err => {
        this.waiting = !this.waiting;
        err
      }
    );

  }

}
