import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
        MatAutocompleteModule,
        CommonModule,
        RouterLink,
        AsyncPipe,
    ],
    templateUrl: './registrarservicio.component.html',
    styleUrls: ['./registrarservicio.component.css']
})
export class RegistrarservicioComponent implements OnInit {
    form: FormGroup = new FormGroup({});
    servicio: Servicio = new Servicio();
    idClienteTemp: number = 0;
    listaClientes: Cliente[] = [];
    clientesFiltrados: Cliente[] = [];
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
        private cliS: ClienteService,
        private route: ActivatedRoute
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
            fotoNoObligatoriaServicio: [''],
            fotoAntesServicio: [''],
            fotoDespuesServicio: ['']
        });
        this.cliS.list().subscribe((data) => {
            this.listaClientes = data;
            this.clientesFiltrados = this.listaClientes;
        });
        this.form.get('cliente')?.valueChanges.subscribe(value => {
            this.filtrarClientes(value);
        });
    }

    filtrarClientes(value: string): void {
        const filterValue = value ? value.toLowerCase() : '';
        this.clientesFiltrados = this.listaClientes.filter(cliente => cliente.nombreCliente.toLowerCase().includes(filterValue));
    }

    clienteSeleccionado(idCliente: number): void {
      this.idClienteTemp = idCliente;
      const cliente = this.listaClientes.find(c => c.idClientes === idCliente);
      if (cliente) {
        this.form.get('cliente')?.setValue(cliente.nombreCliente);
      }
    }

    aceptar(): void {
        if (this.form.valid) {

            console.log('Formulario válido, enviando datos...');
            console.log('ID Cliente Temporal:', this.idClienteTemp);
            console.log('Datos del formulario:', this.form.value);

            this.servicio.idServicio = this.form.value.codigo;
            this.servicio.cliente.idClientes = this.idClienteTemp;
            this.servicio.tipoDeServicio = this.form.value.tiposervicio;
            this.servicio.fechaEnvioServicio = this.form.value.fechaenvio;
            this.servicio.fechaRecojoServicio = this.form.value.fecharecojo;
            this.servicio.fotoNoObligatoriaServicio = this.form.value.fotoNoObligatoriaServicio;
            this.servicio.fotoAntesServicio = this.form.value.fotoAntesServicio;
            this.servicio.fotoDespuesServicio = this.form.value.fotoDespuesServicio;
            
            console.log('Datos del servicio a enviar:', this.servicio);

            this.serS.insertar(this.servicio).subscribe((data) => {
              console.log('Respuesta del servidor:', data);  
              this.serS.list().subscribe((data) => {
                    this.serS.setList(data);
                });
            });
            this.router.navigate(['servicio']);
        } else {
          console.log('Formulario inválido, por favor revise los campos.');
      }
    }

    init() {
        if (this.edicion) {
            this.serS.listId(this.id).subscribe((data) => {
                this.form = new FormGroup({
                    codigo: new FormControl(data.idServicio),
                    cliente: new FormControl(data.cliente.idClientes),
                    tiposervicio: new FormControl(data.tipoDeServicio),
                    fechaenvio: new FormControl(data.fechaEnvioServicio),
                    fecharecojo: new FormControl(data.fechaRecojoServicio),
                    fotoNoObligatoriaServicio: new FormControl(data.fotoNoObligatoriaServicio),
                    fotoAntesServicio: new FormControl(data.fotoAntesServicio),
                    fotoDespuesServicio: new FormControl(data.fotoDespuesServicio)
                });
            });
        }
    }

    redirigirRegistroCliente(): void {
        this.router.navigate(['/cliente/nuevocliente']);
    }
}
