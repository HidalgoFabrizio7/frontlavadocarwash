import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Cobranza } from '../../../models/Cobranza';
import { CobranzaService } from '../../../services/cobranza.service';
import { Servicio } from '../../../models/Servicio';
import { ServicioService } from '../../../services/servicio.service';
import moment from 'moment';
@Component({
    selector: 'app-registrarcobranza',
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
    templateUrl: './registrarcobranza.component.html',
    styleUrl: './registrarcobranza.component.css'
})
export class RegistrarcobranzaComponent implements OnInit{
    form: FormGroup = new FormGroup({});
    cobranza: Cobranza = new Cobranza();
    edicion: boolean = false;
    id: number = 0;
    maxFecha: Date = moment().add(-1, 'days').toDate();
    listaServicio: Servicio[] = [];
    metodopago: { value: string; viewValue: string }[] = [
      { value: 'yape', viewValue: 'yape' },
      { value: 'plin', viewValue: 'plin' },
      { value: 'transferencia', viewValue: 'transferencia' },
    ];
    //que sea otra tabla para que se pueda agregar mas items
    constructor(
        private cobS: CobranzaService,
        private router: Router,
        private formBuilder: FormBuilder,
        private route:ActivatedRoute,
        private serS: ServicioService,
      ) { }
    
      ngOnInit(): void {
        this.route.params.subscribe((data: Params) => {
          this.id = data['id'];
          this.edicion = data['id'] != null;
          this.init();
        });
        this.form = this.formBuilder.group({
          codigo: [''],
          fechacobro: ['', Validators.required],
          mediopago: ['', Validators.required],
          codigoservicio: ['', Validators.required],
        });
        this.serS.list().subscribe((data) => {
          this.listaServicio = data;
        });
      }
      aceptar(): void {
        if (this.form.valid) {
          this.cobranza.idCobranza = this.form.value.codigo;
          this.cobranza.fechaCobro= this.form.value.nombre;
          this.cobranza.medioPago = this.form.value.apellido;
          this.cobranza.servicio.idServicio = this.form.value.numero;
          this.cobS.insertar(this.cobranza).subscribe((data) => {
            this.cobS.list().subscribe((data) => {
              this.cobS.setList(data);
            });
          });
          this.router.navigate(['cobranza']);
        }
      }
    
      init() {
        if (this.edicion) {
          this.cobS.listId(this.id).subscribe((data) => {
            this.form = new FormGroup({
              codigo: new FormControl(data.idCobranza),
              nombre: new FormControl(data.fechaCobro),
              apellido: new FormControl(data.medioPago),
              numero: new FormControl(data.servicio.idServicio),
            });
          });
        }
      }
}
