import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Cobranza } from '../../../models/Cobranza';
import { CobranzaService } from '../../../services/cobranza.service';

@Component({
    selector: 'app-listarcobranza',
    imports: [
        MatTableModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
        CommonModule,
        MatPaginatorModule,
    ],
    templateUrl: './listarcobranza.component.html',
    styleUrl: './listarcobranza.component.css'
})
export class ListarcobranzaComponent implements OnInit{
  datasource: MatTableDataSource<Cobranza> = new MatTableDataSource();
    displayedColumns: string[] = [
      'codigo',
      'tiposervicio',
      'foto1',
      'foto2',
      'foto3', 
      'fechaenvio',
      'fecharecojo',
      'accion01',
      'accion02'
    ];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private coS:CobranzaService){}
  
  
    ngOnInit(): void {
      this.coS.list().subscribe((data) => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
      });
      this.coS.getLista().subscribe((data) => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
      });
    }
    
    eliminar(id: number) {
      this.coS.eliminar(id).subscribe((data)=>{
        this.coS.list().subscribe((data)=>{
          this.coS.setList(data);
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
