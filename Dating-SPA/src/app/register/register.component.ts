import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm: FormGroup;

  constructor(private auth: AuthService
    , private alertifyService: AlertifyService
    , private formBuilder:FormBuilder
    , private router:Router
    ) { }

  ngOnInit() {
    this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // },
    // this.matchPassword
    // );


  }

  createRegisterForm(){
    this.registerForm=this.formBuilder.group({
      username:['',Validators.required],

      knownAs:['',Validators.required],
      gender:['male',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password:['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword:['',Validators.required]
    },{validators:this.matchPassword});
  }
  matchPassword(form: FormGroup) {
    return  form.get('password').value === form.get('confirmPassword').value ? null : { mismatch: true };
  }

  CancelRegister() {
    this.cancelRegister.emit(false);
  }

  registerUser() {
    if(this.registerForm.valid) {
      this.model=this.registerForm.value;
      this.auth.register(this.model).subscribe(
        () => {
          this.alertifyService.success("user registered successfully");
        },
        error => {
          this.alertifyService.error(error);
        },
        ()=>{
          this.auth.Login(this.model).subscribe(
            ()=>{this.router.navigate(['/members']);}
          )
          

        }
      );
    }
    
  }
}
