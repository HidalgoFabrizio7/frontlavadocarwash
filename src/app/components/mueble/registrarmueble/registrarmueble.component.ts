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
import moment from 'moment';
import { Mueble } from '../../../models/Mueble';
import { Servicio } from '../../../models/Servicio';
import { MuebleService } from '../../../services/mueble.service';
import { ServicioService } from '../../../services/servicio.service';
@Component({
    selector: 'app-registrarmueble',
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
    templateUrl: './registrarmueble.component.html',
    styleUrl: './registrarmueble.component.css'
})
export class RegistrarmuebleComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  mueble: Mueble = new Mueble();
  listaServicio: Servicio[] = [];
  etapaservicio: { value: string; viewValue: string }[] = [
    { value: 'lavado', viewValue: 'lavado' },
    { value: 'Secado', viewValue: 'Secado' },
  ];
  edicion: boolean = false;
  id: number = 0;
  maxFecha: Date = moment().add(-1, 'days').toDate();
  constructor(
      private muS: MuebleService,
      private router: Router,
      private formBuilder: FormBuilder,
      private serS:ServicioService,
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
        codigoservicio: ['', Validators.required],
        etapaservicio: ['', Validators.required],
        fechaenvio: ['', Validators.required],
      });
      this.serS.list().subscribe((data) => {
        this.listaServicio = data;
      });
    }
    aceptar(): void {
      if (this.form.valid) {
        this.mueble.idMueble = this.form.value.codigo;
        this.mueble.etapaLavado = this.form.value.etapaservicio;
        this.mueble.fechaSecado = this.form.value.fechaenvio;
        this.mueble.servicio.idServicio = this.form.value.codigoservicio;
        this.muS.insertar(this.mueble).subscribe((data) => {
          this.muS.list().subscribe((data) => {
            this.muS.setList(data);
          });
        });
        this.router.navigate(['mueble']);
      }
    }
  
    init() {
      if (this.edicion) {
        this.muS.listId(this.id).subscribe((data) => {
          this.form = new FormGroup({
            codigo: new FormControl(data.idMueble),
            etapaservicio: new FormControl(data.etapaLavado),
            fechaenvio: new FormControl(data.fechaSecado),
            codigoservicio: new FormControl(data.servicio.idServicio),
          });
        });
      }
    }
}
