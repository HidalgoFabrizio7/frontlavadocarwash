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
import { RegistrarmuebleComponent } from '../../mueble/registrarmueble/registrarmueble.component';
import { ListarmuebleComponent } from '../../mueble/listarmueble/listarmueble.component';
import { FormDataService } from '../../../services/form-data.service';

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
        RegistrarmuebleComponent,
        ListarmuebleComponent
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
    nuevoMueble: boolean = false;
    id: number = 0;
    idLast: number = 0;
    maxFecha: Date = moment().add(0, 'days').toDate();

    constructor(
        private serS: ServicioService,
        private router: Router,
        private formBuilder: FormBuilder,
        private cliS: ClienteService,
        public route: ActivatedRoute,
        private formDataService: FormDataService
    ) { }

    ngOnInit(): void {

        this.route.params.subscribe((data: Params) => {
            this.id = data['id'];
            console.log('modo edicion');
            console.log('ID:', this.id);
            this.edicion = data['id'] != null;

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

            if (this.edicion) {
                this.init();
            }
        });

        this.cliS.list().subscribe((data) => {
            this.listaClientes = data;
            this.clientesFiltrados = this.listaClientes;
        });

        this.form.get('cliente')?.valueChanges.subscribe(value => {
            this.filtrarClientes(value);
        });

        if (this.edicion) {
            this.clienteSeleccionado(this.idClienteTemp);
        }
    }

    /**
     * Filtra la lista de clientes según el valor ingresado.
     * @param value Valor ingresado en el campo de cliente.
     */
    filtrarClientes(value: string): void {
        const filterValue = value ? value.toLowerCase() : '';
        this.clientesFiltrados = this.listaClientes.filter(cliente => cliente.nombreCliente.toLowerCase().includes(filterValue));
    }

    /**
     * Selecciona un cliente de la lista y actualiza el formulario.
     * @param idCliente ID del cliente seleccionado.
     */
    clienteSeleccionado(idCliente: number): void {
        this.idClienteTemp = idCliente;
        const cliente = this.listaClientes.find(c => c.idClientes === idCliente);
        if (cliente) {
            this.form.get('cliente')?.setValue(cliente.nombreCliente);
        }
    }

    /**
     * Envía los datos del formulario si es válido.
     */
    aceptar(): void {
        if (this.form.valid) {
            console.log('Formulario válido, enviando datos...');
            console.log('ID Cliente Temporal:', this.idClienteTemp);
            console.log('Datos del formulario:', this.form.value);

            this.form.get('cliente')?.setValue(this.idClienteTemp);

            this.servicio.idServicio = this.form.value.codigo;
            this.servicio.cliente.idClientes = this.form.value.cliente;
            this.servicio.tipoDeServicio = this.form.value.tiposervicio;
            this.servicio.fechaEnvioServicio = this.form.value.fechaenvio;
            this.servicio.fechaRecojoServicio = this.form.value.fecharecojo;
            this.servicio.fotoNoObligatoriaServicio = this.form.value.fotoNoObligatoriaServicio;
            this.servicio.fotoAntesServicio = this.form.value.fotoAntesServicio;
            this.servicio.fotoDespuesServicio = this.form.value.fotoDespuesServicio;

            console.log('Datos del servicio a enviar:', this.servicio);

            this.serS.insertarYRegresarId(this.servicio).subscribe((data) => {
                this.id = data;
                console.log('ID retornado del servidor:', this.id);
                this.serS.list().subscribe((data) => {
                    this.serS.setList(data);
                });
                this.router.navigate(['/servicio/ediciones', this.id]);
            });

        } else {
            console.log('Formulario inválido, por favor revise los campos.');
        }
    }

    /**
     * Inicializa el formulario con los datos del servicio si está en modo edición.
     */
    init() {
        if (this.edicion && this.id) {  // Asegurar que el ID es válido
            this.serS.listId(this.id).subscribe((data) => {
                console.log('Datos recibidos del servicio:', data);
    
                if (!data) {
                    console.error('Error: No se encontró el servicio con ID:', this.id);
                    return;
                }
    
                this.idClienteTemp = data.cliente?.idClientes ?? 0; // Manejo de null
                console.log('ID Cliente Temporal:', this.idClienteTemp);

                this.form = new FormGroup({
                    codigo: new FormControl(data.idServicio),
                    cliente: new FormControl(data.cliente.nombreCliente),  // Manejo de null

                    tiposervicio: new FormControl(data.tipoDeServicio),
                    fotoNoObligatoriaServicio: new FormControl(data.fotoNoObligatoriaServicio),
                    fechaenvio: new FormControl(data.fechaEnvioServicio),
                    fecharecojo: new FormControl(data.fechaRecojoServicio),
                    fotoAntesServicio: new FormControl(data.fotoAntesServicio),
                    fotoDespuesServicio: new FormControl(data.fotoDespuesServicio),
                });
            });
        }
    }
    

    /**
     * Redirige a la página de registro de nuevo cliente.
     */
    redirigirRegistroCliente(): void {
        this.router.navigate(['/cliente/nuevocliente']);
    }

}