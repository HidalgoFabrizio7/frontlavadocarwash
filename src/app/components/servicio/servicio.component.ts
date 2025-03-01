import { Component } from '@angular/core';
import { ListarservicioComponent } from "./listarservicio/listarservicio.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-servicio',
    imports: [ListarservicioComponent, RouterOutlet],
    templateUrl: './servicio.component.html',
    styleUrl: './servicio.component.css'
})
export class ServicioComponent {
  constructor(public route:ActivatedRoute){}
}
