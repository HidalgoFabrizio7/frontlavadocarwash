import { Component, OnInit, ViewChild } from '@angular/core';
import { Mueble } from '../../../models/Mueble';
import { MuebleService } from '../../../services/mueble.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-estadosmueble',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './estadosmueble.component.html',
  styleUrl: './estadosmueble.component.css'
})
export class EstadosmuebleComponent implements OnInit {
  etapaSeleccionada: string = 'lavado'; // ✅ valor por defecto
  listaMuebles: Mueble[] = [];

  pageSize: number = 4;
  pageIndex: number = 0;
  paginatedMuebles: Mueble[] = [];

  fechaSecadoSeleccionada: { [id: number]: Date } = {};
  fechaSecadoGlobal: Date = new Date(); // valor inicial
  minFechaSecado: Date = new Date(); // restringe fechas pasadas
  fotoDespuesGlobal: string = ''; // <- base64

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private muebleService: MuebleService) {}

  ngOnInit(): void {
    this.cargarMueblesPorEtapa();
  }

  onCambioEtapa(): void {
    this.cargarMueblesPorEtapa();
  }

  cargarMueblesPorEtapa(): void {
    this.muebleService.list().subscribe((data: Mueble[]) => {
      const filtrados = data
        .filter(m => m.etapaLavado?.toLowerCase() === this.etapaSeleccionada.toLowerCase())
        .map(m => ({
          ...m,
          fechaSecado: m.fechaSecado ? new Date(m.fechaSecado) : new Date() // ⚠️ valor por defecto si viene vacío
        }));
  
      // Aseguramos que el tipo sea exactamente Mueble[]
      this.listaMuebles = filtrados as Mueble[];
      this.actualizarPaginacion();
    });
  }
  
  

  actualizarPaginacion(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedMuebles = this.listaMuebles.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPaginacion();
  }

  formatearFechaSumandoUnDia(fechaOriginal: Date): string {
    const nuevaFecha = new Date(fechaOriginal);
    nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    return nuevaFecha.toISOString().split('T')[0];
  }  

  onFotoDespuesSeleccionada(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fotoDespuesGlobal = reader.result as string;
        console.log('Imagen después convertida:', this.fotoDespuesGlobal);
      };
    }
  }  

  cambiarEtapa(mueble: Mueble): void {
    let nuevaEtapa = '';
  
    if (mueble.etapaLavado.toLowerCase() === 'lavado') {
      nuevaEtapa = 'Secado';
    } else if (mueble.etapaLavado.toLowerCase() === 'secado') {
      nuevaEtapa = 'Por Entregar';
    } else {
      return;
    }
  
    const fechaFormateada = this.formatearFechaSumandoUnDia(this.fechaSecadoGlobal);
  
    const data = {
      etapaLavado: nuevaEtapa,
      fechaSecado: fechaFormateada,
      fotoDespues: this.fotoDespuesGlobal
    };
  
    this.muebleService.actualizarEtapaYFecha(mueble.idMueble, data).subscribe({
      next: () => {
        this.cargarMueblesPorEtapa();
      },
      error: (err) => {
        console.error('Error al actualizar etapa:', err);
      }
    });
  }
  

  
  
  

}
