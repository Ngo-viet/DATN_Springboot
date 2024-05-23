import {Component, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoginDTO} from "../../dtos/user/login.dto";
import {LoginResponse} from "../../responses/user/login.response";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {UserResponse} from "../../responses/user/user.response";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  // Login User
  // phoneNumber: string = '12345678';
  // password: string= '1234567';

  //Login Admin
  phone_number: string = '';
  password: string = '';

  roles: Role[] = []; //Manảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined;//Biến để lưu giá trịược chọn tuwf dropdown
  userResponse?: UserResponse
  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phone_number}`);
  }
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    //Gọi api lấy danh sách roles và lưu vào biến roles
    debugger
  }

  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }


  login(){

    const loginDTO: LoginDTO = {
      phone_number: this.phone_number,
      password: this.password,
      // role_id: this.selectedRole?.id ?? 1

    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              this.toastr.success("Đăng nhập thành công", "Thành công", {
                timeOut: 2000
              });
              if(this.userResponse?.role.id == 2) {
                this.router.navigate(['/admin']);
              } else if(this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }

            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              this.toastr.error("Số điện thoại hoặc mật khẩu của bạn sai!", "Thất bại", {
                timeOut: 2000
              });
            }
          })
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.toastr.error("Số điện thoại hoặc mật khẩu của bạn sai!", "Thất bại", {
          timeOut: 2000
        });
      }
    });

  }


  showAlert(platform: string): void {
    alert(`${platform} đăng nhập chưa được hỗ trợ.`);
  }
}
