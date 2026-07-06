import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente } from '../../../models/Cliente';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-listarcliente',
    standalone: true,
    imports: [
        MatTableModule,
        MatIconModule,
        CommonModule,
        MatPaginatorModule,
        RouterLink
    ],
    templateUrl: './listarcliente.component.html',
    styleUrl: './listarcliente.component.css'
})
export class ListarclienteComponent implements OnInit {
  datasource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'apellido',
    'numero',
    'dnicliente', 
    'direccion',
    'accion01',
    'accion02'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cS:ClienteService){}


  ngOnInit(): void {
    // Cargar datos iniciales
    this.cS.list().subscribe((data) => {
      this.datasource.data = data; // Asignar los datos directamente
      this.datasource.paginator = this.paginator; // Configurar paginador
    });

    // Suscribirse a cambios en la lista
    this.cS.getLista().subscribe((data) => {
      this.datasource.data = data; // Actualizar datos cuando cambie la lista
    });
  }
  
  eliminar(id: number) {
    this.cS.eliminar(id).subscribe({
      next: () => {
        // Actualizar la lista después de eliminar
        this.cS.list().subscribe((data) => {
          this.cS.setList(data); // Actualiza el Observable
          this.datasource.data = data; // Actualiza la tabla directamente
        });
      },
      error: (error) => {
        if (error.status === 500) {
          alert('No se puede eliminar el cliente.');
        } else {
          alert('Ocurrió un error al intentar eliminar el cliente.');
        }
      }
    });
  }
}
