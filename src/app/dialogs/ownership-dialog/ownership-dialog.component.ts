import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
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
    public dataService:DataService,
            ) { }

              formControl = new FormControl('', [
                Validators.required
              ]);

 users;

  ngOnInit() {

  }



    submit() {
      // emppty stuff
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    stopEdit(): void {
      console.log(this.data);
      if(this.data['user_id']=="s")
      {
        this.dataService.removeOwner(this.data['item_id']);
          // this.ownershipService.removeItemOwnership(this.data['item_id']).subscribe();
      }
      else{
        this.dataService.addOwner(this.data['item_id'],this.data['owner']);
        // this.ownershipService.assignItemToUser(this.data['item_id'],this.data['user_id']).subscribe(data=>{});
      }
    }
  }
