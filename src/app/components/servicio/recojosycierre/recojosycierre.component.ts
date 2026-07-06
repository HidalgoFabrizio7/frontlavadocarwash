import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ServicioService } from '../../../services/servicio.service';
import { Servicio } from '../../../models/Servicio';

@Component({
  selector: 'app-recojosycierre',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './recojosycierre.component.html',
  styleUrl: './recojosycierre.component.css'
})
export class RecojosycierreComponent implements OnInit {
  servicios: Servicio[] = [];
  soloHoy = false;
  pageSize = 5;
  pageIndex = 0;

  constructor(private serS: ServicioService) { }

  ngOnInit(): void {
    this.serS.listarFuturos().subscribe(data => this.servicios = data);
  }

  toggleSoloHoy(): void {
    this.soloHoy = !this.soloHoy;
    this.pageIndex = 0;
  }

  get serviciosFiltrados(): Servicio[] {
    if (!this.soloHoy) return this.servicios;
    const hoy = new Date();
    return this.servicios.filter(s => this.mismoDiaLocal(new Date(s.fechaRecojoServicio), hoy));
  }

  get pagedServicios(): Servicio[] {
    const start = this.pageIndex * this.pageSize;
    return this.serviciosFiltrados.slice(start, start + this.pageSize);
  }

  onPageChange(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  private mismoDiaLocal(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
}
