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

  constructor(public dialogRef: MatDialogRef<OwnershipDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }

              formControl = new FormControl('', [
                Validators.required
                // Validators.email,
              ]);


  ngOnInit() {
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
      this.dataService.updateItem(this.data);
    }
  }
