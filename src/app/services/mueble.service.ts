import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Mueble } from '../models/Mueble';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class MuebleService {
  private url = `${base_url}/muebles`;
  private listaCambio = new Subject<Mueble[]>();
  constructor(private http:HttpClient) { }
    list() {
          return this.http.get<Mueble[]>(`${this.url}`);	
        }
    insertar(m:Mueble) {
          return this.http.post(this.url,m);
        }
      
    setList(listaNueva:Mueble[]){
      return this.http.put(this.url,listaNueva);
    }
    getLista(){
      return this.listaCambio.asObservable();
    }
    listId(id:number){
      return this.http.get<Mueble>(`${this.url}/${id}`);
    }
    update(m:Mueble){
      return this.http.put(`${this.url}/${m.idMueble}`,m);
    }

    eliminar(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
}
