import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Item} from '../models/item';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = 'http://localhost:8080/api/items';
  private httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTM1MzU0ODg4LCJleHAiOjE1MzUzNTg0ODh9.kUCmYMUUqefZnm3em__ckQGm4wcvwpDHCctLj0CQAx9Qrx4ZdwXYWu3aHrsauhAZwOZYbJ6yY3vhF8cF3EjamA'
  })
};
  dataChange: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Item[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllItems(): void {
    this.httpClient.get<Item[]>(this.API_URL,this.httpOptions).subscribe(data => {
      console.log(data);
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log('Get all Items error!!!');
      console.log (error.name + ' ' + error.message);
      });

}

  // DEMO ONLY, you can find working methods below
  // addItem (item: Item): void {
  //   this.dialogData = item;
  // }

  // updateItem (item: Item): void {
  //   this.dialogData = item;
  // }
  //
  // deleteItem (id: number): void {
  //   console.log(id);
  // }
// }



/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:*/

    // ADD, POST METHOD
    addItem(item: Item): void {
    this.httpClient.post(this.API_URL, Item).subscribe(data => {
      this.dialogData = Item;
      // this.toasterService.showToaster('Successfully added', 3000);
      console.log("Successfully added");
      },
      (err: HttpErrorResponse) => {
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(Item: Item): void {
    this.httpClient.put(this.API_URL + Item.item_id, Item).subscribe(data => {
        this.dialogData = Item;
        // this.toasterService.showToaster('Successfully edited', 3000);
        console.log('Successfully edited');
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        // this.toasterService.showToaster('Successfully deleted', 3000);
        console.log('Successfully deleted');
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      }
    );
  }
}
