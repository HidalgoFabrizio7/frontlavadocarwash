import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Cobranza } from '../models/Cobranza';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class CobranzaService {
  private url = `${base_url}/Cobranza`;
  private listaCambio = new Subject<Cobranza[]>();
  constructor(private http:HttpClient) { }
    list() {
      return this.http.get<Cobranza[]>(`${this.url}`);	
    }
  
    insertar(cb:Cobranza) {
      return this.http.post(this.url,cb);
    }
  
    setList(listaNueva:Cobranza[]){
      return this.http.put(this.url,listaNueva);
    }
    getLista(){
      return this.listaCambio.asObservable();
    }
    listId(id:number){
      return this.http.get<Cobranza>(`${this.url}/${id}`);
    }
    update(cb:Cobranza){
      return this.http.put(`${this.url}/${cb.idCobranza}`,cb);
    }
    
    eliminar(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
}
