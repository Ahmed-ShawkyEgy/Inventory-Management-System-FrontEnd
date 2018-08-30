import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Item} from '../models/item';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = 'http://10.1.1.6:8080/api/items/';
  private httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
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
        data.map((item)=>{
          item['purchase_date'] = item['purchase_date'].substr(0,10);
        });
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
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



    // ADD, POST METHOD
    addItem(item: Item): void {

    this.httpClient.post(this.API_URL, item,this.httpOptions).subscribe(data => {
      this.dialogData = item;
      // this.toasterService.showToaster('Successfully added', 3000);
      console.log("Successfully added");
      },
      (err: HttpErrorResponse) => {
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      // console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      console.log(Item);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(item: Item): void {
     console.log(item);
    this.httpClient.put(this.API_URL + item.id, item,this.httpOptions).subscribe(data => {
        this.dialogData = item;
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
    this.httpClient.delete(this.API_URL + id,this.httpOptions).subscribe(data => {
        // this.toasterService.showToaster('Successfully deleted', 3000);
        console.log('Successfully deleted');
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
        console.log('Error occurred. Details: ' + err.name + ' ' + err.message);
      }
    );
  }

  removeOwner(id:number)
  {
    this.httpClient.post(this.API_URL+'discard/'+id,{},this.httpOptions).subscribe();
  }

  addOwner(id:number,owner:string)
  {
    this.httpClient.post(this.API_URL+'acquire',
    {
    	"ownerName":owner,
    	"itemId":id
    },
    this.httpOptions
  ).subscribe(data=>{
    console.log(data);




  });
  }
}
