import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const base_url = environment.base;

export interface IngresosDTO {
  total: number;
}

export interface ServiciosEnColaDTO {
  total: number;
}

export interface FlujoServiciosDTO {
  fecha: string;
  cantidad: number;
}

export interface TopMuebleDTO {
  descripcion: string;
  cantidad: number;
}

export interface TopClienteDTO {
  nombre: string;
  cantidad: number;
}

export interface TiempoProcesoDTO {
  tipoDeServicio: string;
  diasPromedio: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = `${base_url}/dashboard`;

  constructor(private http: HttpClient) { }

  getIngresos() {
    return this.http.get<IngresosDTO>(`${this.url}/ingresos`);
  }

  getServiciosEnCola() {
    return this.http.get<ServiciosEnColaDTO>(`${this.url}/servicios-en-cola`);
  }

  getFlujoServicios() {
    return this.http.get<FlujoServiciosDTO[]>(`${this.url}/flujo-servicios`);
  }

  getTopMueble() {
    return this.http.get<TopMuebleDTO[]>(`${this.url}/top-mueble`);
  }

  getTopCliente() {
    return this.http.get<TopClienteDTO[]>(`${this.url}/top-cliente`);
  }

  getTiempoProceso() {
    return this.http.get<TiempoProcesoDTO[]>(`${this.url}/tiempo-proceso`);
  }
}
