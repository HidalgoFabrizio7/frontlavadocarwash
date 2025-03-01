import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Cliente } from '../../../models/Cliente';
import { ClienteService } from '../../../services/cliente.service';
@Component({
    selector: 'app-registrarcliente',
    imports: [
        MatIconModule,
        MatFormFieldModule,
        NgIf,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        CommonModule,
        RouterLink,
    ],
    templateUrl: './registrarcliente.component.html',
    styleUrl: './registrarcliente.component.css'
})
export class RegistrarclienteComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  cliente: Cliente = new Cliente();
  edicion: boolean = false;
  id: number = 0;
  constructor(
      private cliS: ClienteService,
      private router: Router,
      private formBuilder: FormBuilder,
      private route:ActivatedRoute
    ) { }
  
    ngOnInit(): void {
      this.route.params.subscribe((data: Params) => {
        this.id = data['id'];
        this.edicion = data['id'] != null;
        this.init();
      });
      this.form = this.formBuilder.group({
        codigo: [''],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        numero: ['', Validators.required],
        dni: ['', Validators.required],
        direccion: ['', Validators.required],
      });
    }
    aceptar(): void {
      if (this.form.valid) {
        this.cliente.idClientes = this.form.value.codigo;
        this.cliente.nombreCliente= this.form.value.nombre;
        this.cliente.apellidoClientes = this.form.value.apellido;
        this.cliente.numeroCelularClientes = this.form.value.numero;
        this.cliente.dniClientes = this.form.value.dni;
        this.cliente.direccionClientes = this.form.value.direccion;
        this.cliS.insertar(this.cliente).subscribe((data) => {
          this.cliS.list().subscribe((data) => {
            this.cliS.setList(data);
          });
        });
        this.router.navigate(['cliente']);
      }
    }
  
    init() {
      if (this.edicion) {
        this.cliS.listId(this.id).subscribe((data) => {
          this.form = new FormGroup({
            codigo: new FormControl(data.idClientes),
            nombre: new FormControl(data.nombreCliente),
            apellido: new FormControl(data.apellidoClientes),
            numero: new FormControl(data.numeroCelularClientes),
            dni: new FormControl(data.dniClientes),
            direccion: new FormControl(data.direccionClientes),
          });
        });
      }
    }
}
