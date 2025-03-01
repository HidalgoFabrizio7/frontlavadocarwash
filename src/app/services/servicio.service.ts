import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Servicio } from '../models/Servicio';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private url = `${base_url}/Servicios`;
  private listaCambio = new Subject<Servicio[]>();
  constructor(private http:HttpClient) { }
  list() {
            return this.http.get<Servicio[]>(`${this.url}`);	
          }
  insertar(m:Servicio) {
        return this.http.post(this.url,m);
      }
    
  setList(listaNueva:Servicio[]){
    return this.http.put(this.url,listaNueva);
  }
  getLista(){
    return this.listaCambio.asObservable();
  }
  listId(id:number){
    return this.http.get<Servicio>(`${this.url}/${id}`);
  }
  update(s:Servicio){
    return this.http.put(this.url,s);
  }
  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
