import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/Role';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = `${base_url}/roles`;
  constructor(private http:HttpClient) { }
    insert(r: Role){
      return this.http.post(this.url, r);
    }
 
}
