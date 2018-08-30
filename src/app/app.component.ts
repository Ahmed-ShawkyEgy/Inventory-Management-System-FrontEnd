import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';

import {Item} from './models/item';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {OwnershipDialogComponent} from './dialogs/ownership-dialog/ownership-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns = ['actions','serial','name', 'price', 'description', 'purchase_date','owner'];
  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew(Item: Item) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {Item: Item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService

        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refresh();
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number,serial:string, name: string,price: string,description: string, purchase_date: string) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {name: name,id:id,serial:serial, price:price, description:description, purchase_date: purchase_date}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        var owner = this.exampleDatabase.dataChange.value[foundIndex].owner;
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.exampleDatabase.dataChange.value[foundIndex].owner = owner;
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  changeOwner(i:number,id:number)
  {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(OwnershipDialogComponent, {
      data: {item_id:id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        // const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refresh();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number,serial:string, name: string, price: number, description: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {id:id,name:name,serial:serial, price: price, description: description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  // If you don't need a filter or a pagination this can be simplified, you just use code from else block
  private refreshTable() {
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}


export class ExampleDataSource extends DataSource<Item> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Item[] = [];
  renderedData: Item[] = [];

  constructor(public _exampleDatabase: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Item[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllItems();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((Item: Item) => {
        const searchStr = (Item.serial+Item.name + Item.price + Item.description + Item.purchase_date+Item.owner).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: Item[]): Item[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    console.log(this._sort.active);
    return data.sort((a, b) => {
      let propertyA: number | string = '' ;
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'serial': [propertyA, propertyB] = [a.serial, b.serial]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'price': [propertyA, propertyB] = [a.price, b.price]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'purchase_date': [propertyA, propertyB] = [a.purchase_date, b.purchase_date]; break;
        case 'owner': [propertyA, propertyB] = [a.owner, b.owner]; break;
      }

      let comp = (propertyA < propertyB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);

      if(propertyA==null || propertyA=='')
        comp = 1;
      if(propertyB==null || propertyB=='')
        comp = -1;
      if(propertyA==propertyB)
        comp = 0;

      return comp ;
    });
  }
}
