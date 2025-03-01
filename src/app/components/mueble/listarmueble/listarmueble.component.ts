import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Mueble } from '../../../models/Mueble';
import { MuebleService } from '../../../services/mueble.service';

@Component({
    selector: 'app-listarmueble',
    imports: [
        MatTableModule,
        MatIconModule,
        RouterModule,
        CommonModule,
        MatPaginatorModule
    ],
    templateUrl: './listarmueble.component.html',
    styleUrl: './listarmueble.component.css'
})
export class ListarmuebleComponent implements OnInit{
  datasource: MatTableDataSource<Mueble> = new MatTableDataSource();
  displayedColumns: string[] = [
      'codigo',
      'descripcion',
      'etapa',
      'fechasecado',
      'accion01',
      'accion02'
    ];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private mS:MuebleService){}
  
  
    ngOnInit(): void {
      this.mS.list().subscribe((data) => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
      });
      this.mS.getLista().subscribe((data) => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
      });
    }
    
    eliminar(id: number) {
      this.mS.eliminar(id).subscribe((data)=>{
        this.mS.list().subscribe((data)=>{
          this.mS.setList(data);
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
