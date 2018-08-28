import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {UserService} from '../../services/user.service';
import {OwnershipService} from '../../services/ownership.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-ownership-dialog',
  templateUrl: './ownership-dialog.component.html',
  styleUrls: ['./ownership-dialog.component.css']
})
export class OwnershipDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OwnershipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService,
    public ownershipService:OwnershipService,
            ) { }

              formControl = new FormControl('', [
                Validators.required
                // Validators.email,
              ]);

 users;

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      data=>{this.users=data;
      console.log(this.users);
    });
  }


    getErrorMessage() {
      return this.formControl.hasError('required') ? 'Required field' :
        this.formControl.hasError('email') ? 'Not a valid email' :
          '';
    }

    submit() {
      // emppty stuff
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    stopEdit(): void {
      console.log(this.data);
      if(this.data['user_id']=="-1")
      {
          this.ownershipService.removeItemOwnership(this.data['item_id']).subscribe();
      }
      else{
        this.ownershipService.assignItemToUser(this.data['item_id'],this.data['user_id']).subscribe(data=>{});
      }
    }
  }
