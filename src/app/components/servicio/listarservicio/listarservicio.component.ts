import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { ServicioService } from '../../../services/servicio.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Servicio } from '../../../models/Servicio';
@Component({
    selector: 'app-listarservicio',
    imports: [
        MatTableModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
        CommonModule,
        MatPaginatorModule
      ],
    templateUrl: './listarservicio.component.html',
    styleUrl: './listarservicio.component.css'
})
export class ListarservicioComponent implements OnInit{
  datasource: MatTableDataSource<Servicio> = new MatTableDataSource();
  displayedColumns: string[] = [
    'codigo',
    'tiposervicio',
    'foto2',
    'foto3', 
    'fechaenvio',
    'fecharecojo',
    'accion01',
    'accion02'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private sS:ServicioService){}

  ngOnInit(): void {
    this.sS.list().subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.sS.getLista().subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
  }
  
  eliminar(id: number) {
    this.sS.eliminar(id).subscribe((data)=>{
      this.sS.list().subscribe((data)=>{
        this.sS.setList(data);
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
