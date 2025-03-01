import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarclienteComponent } from './listarcliente/listarcliente.component';

@Component({
    selector: 'app-cliente',
    imports: [RouterOutlet,
        ListarclienteComponent],
    templateUrl: './cliente.component.html',
    styleUrl: './cliente.component.css'
})
export class ClienteComponent {
  constructor(public route:ActivatedRoute){}
}
