import { Component } from '@angular/core';
import { ListarcobranzaComponent } from "./listarcobranza/listarcobranza.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-cobranza',
    imports: [ListarcobranzaComponent, RouterOutlet],
    templateUrl: './cobranza.component.html',
    styleUrl: './cobranza.component.css'
})
export class CobranzaComponent {
  constructor(public route:ActivatedRoute){}
}
