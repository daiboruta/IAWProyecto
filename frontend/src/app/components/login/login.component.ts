import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { TokenPayload } from '../../models/user-details'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: TokenPayload = {
    
    name: '',
    password: ''
  };

  hide = true;

  constructor(private auth: AuthenticationService, private router: Router, private snackBar: MatSnackBar) { }

  login() {
    
    this.auth.login(this.credentials).subscribe(() => {
      
      this.router.navigateByUrl('/mes');
    }, (err) => {
      
      this.snackBar.open(`${err.error.message}`, 'OK', {
        duration: 3000,
      });
      console.error(err);
    });
  }

  ngOnInit() {
  }
}
