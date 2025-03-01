import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Users } from '../models/Users';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Users[]>();
  constructor(private http: HttpClient) { }
  list(){
    return this.http.get<Users[]>(`${base_url}/listarini`);
  }
  insert(u: Users){
    return this.http.post(`${base_url}/crearcuenta`, u);
  }

  insertRol(rol: string, idus: number){
    return this.http.post(`${base_url}/usuarios/${idus}/roles?rol=${rol}`,null)
  };

  getList() {
    return this.listaCambio.asObservable();
  }
  setList(listaNueva: Users[]) {
    this.listaCambio.next(listaNueva);
  }

  update(us: Users) {
    return this.http.put(`${this.url}/modificar`, us);
  }

  listId(id: number) {
    return this.http.get<Users>(`${this.url}/${id}`);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
