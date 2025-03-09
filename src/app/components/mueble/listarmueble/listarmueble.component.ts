import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Mueble } from '../../../models/Mueble';
import { MuebleService } from '../../../services/mueble.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-listarmueble',
    standalone: true,
    imports: [
        MatTableModule,
        MatIconModule,
        RouterModule,
        CommonModule,
        MatPaginatorModule
    ],
    templateUrl: './listarmueble.component.html',
    styleUrls: ['./listarmueble.component.css']
})
export class ListarmuebleComponent implements OnInit, AfterViewInit {
  datasource = new MatTableDataSource<Mueble>();
  idServicio: number = 0;
  displayedColumns: string[] = [
      'codigo',
      'descripcion',
      'etapa',
      'fechasecado',
      'accion01',
      'accion02'
    ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
      private mS: MuebleService,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((data: Params) => {
      if (data['id'] != null) {
        this.idServicio = data['id'];

        // Obtener lista de muebles por servicio
        this.mS.listarPorServicio(this.idServicio).subscribe((data) => {
          this.datasource.data = data;  // Reutiliza la misma instancia
        });
      } else {
        // Obtener lista general de muebles
        this.mS.list().subscribe((data) => {
          this.datasource.data = data;  // Reutiliza la misma instancia
        });
      }
    });

    this.mS.getLista().subscribe((data) => {
      this.datasource.data = data; // Reutiliza la misma instancia
    });
  }

  // Asignar el paginator después de que Angular haya inicializado la vista
  ngAfterViewInit() {
    setTimeout(() => {
      this.datasource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.mS.eliminar(id).subscribe(
      () => {
        this.mS.list().subscribe((data) => {
          this.mS.setList(data);
          this.datasource.data = data; // Mantiene la referencia al datasource
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
