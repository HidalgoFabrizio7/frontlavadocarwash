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
import { Servicio } from '../../../models/Servicio';
import { ServicioService } from '../../../services/servicio.service';
import { Cliente } from '../../../models/Cliente';
import { ClienteService } from '../../../services/cliente.service';
import moment from 'moment';

@Component({
    selector: 'app-registrarservicio',
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
    templateUrl: './registrarservicio.component.html',
    styleUrl: './registrarservicio.component.css'
})
export class RegistrarservicioComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  servicio: Servicio = new Servicio();
  listaClientes: Cliente[] = [];
  tiposervicio: { value: string; viewValue: string }[] = [
    { value: 'Servicio en domicilio', viewValue: 'Servicio en domicilio' },
    { value: 'Servicio en la empresa', viewValue: 'Servicio en la empresa' },
  ];
  edicion: boolean = false;
  id: number = 0;
  maxFecha: Date = moment().add(-1, 'days').toDate();

  constructor(
    private serS: ServicioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cliS:ClienteService,
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
      cliente: ['', Validators.required],
      tiposervicio: ['', Validators.required],
      fechaenvio: ['', Validators.required],
      fecharecojo: ['', Validators.required],
    });
    this.cliS.list().subscribe((data) => {
      this.listaClientes = data;
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.servicio.idServicio = this.form.value.codigo;
      this.servicio.cliente.nombreCliente = this.form.value.cliente;
      this.servicio.tipoDeServicio = this.form.value.tiposervicio;
      this.servicio.fechaEnvioServicio = this.form.value.fechaenvio;
      this.servicio.fechaRecojoServicio = this.form.value.fecharecojo;
      this.serS.insertar(this.servicio).subscribe((data) => {
        this.serS.list().subscribe((data) => {
          this.serS.setList(data);
        });
      });
      this.router.navigate(['servicio']);
    }
  }

  init() {
    if (this.edicion) {
      this.serS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idServicio),
          cliente: new FormControl(data.cliente.nombreCliente),
          tiposervicio: new FormControl(data.tipoDeServicio),
          fechaenvio: new FormControl(data.fechaEnvioServicio),
          fecharecojo: new FormControl(data.fechaRecojoServicio),
        });
      });
    }
  }
}
