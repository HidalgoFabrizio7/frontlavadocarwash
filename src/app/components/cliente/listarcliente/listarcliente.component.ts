import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente } from '../../../models/Cliente';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClienteService } from '../../../services/cliente.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-listarcliente',
    imports: [
        MatTableModule,
        MatIconModule,
        CommonModule,
        MatPaginatorModule,
        RouterModule
    ],
    templateUrl: './listarcliente.component.html',
    styleUrl: './listarcliente.component.css'
})
export class ListarclienteComponent implements OnInit{
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
    this.cS.list().subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.cS.getLista().subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
  }
  
  eliminar(id: number) {
    this.cS.eliminar(id).subscribe((data)=>{
      this.cS.list().subscribe((data)=>{
        this.cS.setList(data);
        });
      },
      (error) => {
        if (error.status === 500) {
          alert("No se puede eliminar el servicio.");
        } else {
          alert("Ocurrió un error al intentar eliminar el servicio.");
        }
      }
    );
    }
}
