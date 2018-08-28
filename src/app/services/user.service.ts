import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/';
  private httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTM1NDM3MjYwLCJleHAiOjE1MzU0NjYwNjB9.Tk5yBVwyeYv7nw3SGmOrn4lP9_0kJrV2n_NALGpobaBjOmSXc_Jy4nIlPMhU5bEIKOXOlgcxsC7syu1om1ECsw'
  })
};

  constructor (private httpClient: HttpClient) {}


  getAllUsers(){
    return this.httpClient.get(this.API_URL+"users",this.httpOptions);
  }


}
