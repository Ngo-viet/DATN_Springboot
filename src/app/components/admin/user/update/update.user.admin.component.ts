import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {ToastrService} from "ngx-toastr";
import { UpdateUserDTO} from "../../../../dtos/user/update.user.dto";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import {TokenService} from "../../../../services/token.service";
import {UserResponse} from "../../../../responses/user/user.response";
import {UpdateUser} from "../../../../dtos/user/update.admin.user.dto";


@Component({
  selector: 'app-detail.user.admin',
  templateUrl: './update.user.admin.component.html',
  styleUrls: ['./update.user.admin.component.css'],
})

export class UpdateUserAdminComponent implements OnInit {
  userId: number;
  user: User;
  updateUserData: User;
  token:string = '';
  userResponse?: UserResponse;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService,
  ) {
    this.userId = 0;
    this.user = {} as User;
    this.updateUserData = {} as User;

  }

  ngOnInit(): void {
    this.token = <string>this.tokenService.getToken();
    this.getUserDetails();
  }
  getUserDetails(): void{
    this.userService.getUserId(this.userId).subscribe({
      next:(user: User) => {
        this.user = user;
        this.updateUserData = {...user};
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }

  updateUser() {
    // Implement your update logic here
    const updateUserDTO: UpdateUser = {
      fullname: this.updateUserData.fullname,
      address: this.updateUserData.address,
      date_of_birth: this.updateUserData.date_of_birth,
      email: this.updateUserData.email
    };
    this.userService.updateUser(this.user.id, this.token, updateUserDTO).subscribe({
      next: (response: any) => {
        debugger
        this.toastr.success("Cập nhật người dùng thành công", "Thành công", {
          timeOut: 2000
        });
      },
      complete: () => {
        debugger;
        this.router.navigate(['/admin/users']);
      },
      error: (error: any) => {
        debugger;
        this.toastr.error("Cập nhật người dùng thất bại", "Thất bại", {
          timeOut: 2000
        });
        console.error('Error fetching user:', error);
      }
    });
  }


}
