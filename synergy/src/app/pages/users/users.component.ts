import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";
import {Subject} from "rxjs";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  allUsers!: User[];

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      scrollX: false,
      scrollY: false,
    };
    this.fetchUsers();

  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        this.dtTrigger.next(void 0);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  confirmDelete(id: String) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it.',
      cancelButtonText: 'Cancel',
      customClass: 'swal-wide',
    }).then((result) => {
      if (result.value) {
        this.userService.removeUser(id)
          .subscribe({
            next: () => {
              this.allUsers = this.allUsers.filter(item => item.id !== id);
              Swal.fire({
                title: 'Deleted!',
                text: 'Service definition has been deleted.',
                icon: 'success',
              });
              // this.ngOnInit();
            },
            error: err => {
              console.log(err);
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }


  confirmDeleteDialog(id: String) {
    this.userService.removeUser(id).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  humanize(str: String) {
    let i: number;
    const frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  checkStatus(isActive: boolean) {
    if (isActive) {
      return 'Active';
    }

    return 'Inactive';
  }
}
