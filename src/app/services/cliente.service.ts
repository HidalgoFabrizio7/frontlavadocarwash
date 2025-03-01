import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/Cliente';
import { Subject } from 'rxjs';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url = `${base_url}/Clientes`;
  private listaCambio = new Subject<Cliente[]>();
  constructor(private http:HttpClient) { }
  list() {
    return this.http.get<Cliente[]>(`${this.url}`);	
  }

  insertar(c:Cliente) {
    return this.http.post(this.url,c);
  }

  setList(listaNueva:Cliente[]){
    return this.http.put(this.url,listaNueva);
  }
  getLista(){
    return this.listaCambio.asObservable();
  }
  listId(id:number){
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }
  update(c:Cliente){
    return this.http.put(`${this.url}/${c.idClientes}`,c);
  }
  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
