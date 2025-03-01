import { Component } from '@angular/core';
import { ListarmuebleComponent } from "./listarmueble/listarmueble.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-mueble',
    imports: [ListarmuebleComponent, RouterOutlet],
    templateUrl: './mueble.component.html',
    styleUrl: './mueble.component.css'
})
export class MuebleComponent {
  constructor(public route:ActivatedRoute){}
}
