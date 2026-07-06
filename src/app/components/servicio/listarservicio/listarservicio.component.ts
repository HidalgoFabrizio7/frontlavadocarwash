import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { ServicioService } from '../../../services/servicio.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Servicio } from '../../../models/Servicio';
import { After } from 'v8';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
@Component({
    selector: 'app-listarservicio',
    imports: [
        MatTableModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
        CommonModule,
        MatPaginatorModule,
        MatSelectModule,
        FormsModule
      ],
    templateUrl: './listarservicio.component.html',
    styleUrl: './listarservicio.component.css'
})
export class ListarservicioComponent implements OnInit {
  servicios: Servicio[] = [];
  filteredServicios: Servicio[] = [];
  selectedEstado: string = 'Abierto';

  // Si quieres paginación con cards (opcional)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 5;
  pageIndex = 0;

  constructor(private sS: ServicioService, public authService: AuthService) { }

  ngOnInit(): void {
    this.sS.listarTodosOrdenados().subscribe((data) => {
      this.servicios = data;
      this.applyFilter();
    });
    this.sS.getLista().subscribe((data) => {
      this.servicios = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.selectedEstado === '' || !this.selectedEstado) {
      this.filteredServicios = this.servicios.slice();
    } else {
      this.filteredServicios = this.servicios.filter(
        x => x.estadoServicio === this.selectedEstado
      );
    }
    // Reinicia paginación
    this.pageIndex = 0;
  }

  eliminar(id: number) {
    this.sS.eliminar(id).subscribe(() => {
      this.sS.list().subscribe((data) => {
        this.sS.setList(data);
      });
    }, (error) => {
      if (error.status === 500) {
        alert("No se puede eliminar el servicio.");
      } else {
        alert("Ocurrió un error al intentar eliminar el servicio.");
      }
    });
  }

  // Si usas paginación con cards
  get pagedServicios(): Servicio[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredServicios.slice(start, end);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
