import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
        MatAutocompleteModule
    ],
    templateUrl: './registrarmueble.component.html',
    styleUrls: ['./registrarmueble.component.css'] // Corrección aquí
})
export class RegistrarmuebleComponent implements OnInit, OnChanges {
  @Input() muebleId: number = 0;
  @Input() key: number = 0; // Clave para forzar el reinicio del componente

  form: FormGroup = new FormGroup({});
  mueble: Mueble = new Mueble();
  listaServicio: Servicio[] = [];
  etapaservicio: { value: string; viewValue: string }[] = [
    { value: 'lavado', viewValue: 'lavado' },
    { value: 'Secado', viewValue: 'Secado' },
  ];
  descripcionControl = new FormControl('');
  filteredDescripciones: Observable<string[]> = of([]);
  descripcionesExistentes: string[] = [];
  edicion: boolean = false;
  id: number = 0;
  idServicio: number = 0;
  base64String: string | null = null;
  base64String2: string | null = null;
  maxFecha: Date = moment().add(-1, 'days').toDate();

  constructor(
      private muS: MuebleService,
      private router: Router,
      private formBuilder: FormBuilder,
      private serS: ServicioService,
      private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
      console.log('Registrarmueble inicializado con key:', this.key);
      this.initializeForm();

          // Obtener descripciones existentes
      this.muS.list().subscribe((muebles) => {
        this.descripcionesExistentes = [...new Set(muebles.map(m => m.descripcion))];
        this.setupAutocomplete();
      });

      // Suscripción a parámetros del padre para determinar el servicio (opcional)
      this.route.parent?.params.subscribe((data: Params) => {
        const urlSegments = this.route.snapshot.url;
        if (urlSegments.length > 0 && urlSegments[urlSegments.length - 1].path === 'registro') {
          this.idServicio = data['id'];
          this.edicion = false;
          console.log('idServicio:', this.idServicio);
          console.log("es registro");
        }
      });

      this.route.params.subscribe((data: Params) => {
        const urlSegments = this.route.snapshot.url;
        if (data['id'] != null && !this.route.parent?.snapshot.url[0].path.startsWith('servicio')) {
          console.log('Edición activada con ID:', data['id']);
          this.id = data['id'];
          this.edicion = true;
          this.init();
        } else {
          this.idServicio = data['id'];
          this.edicion = false;
          console.log('idServicio:', this.idServicio);
          console.log("es registro");
        }
      });

      this.serS.list().subscribe((data) => {
        this.listaServicio = data;
      });
      if (this.idServicio !== 0) {
        this.form.patchValue({
          codigoservicio: this.idServicio,
        });
      }

      if (this.muebleId !== 0) {
        console.log('Edición activada con muebleId:', this.muebleId);
        this.edicion = true;
        this.id = this.muebleId;
        this.init();
      }
  }

  setupAutocomplete(): void {
    this.filteredDescripciones = this.descripcionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDescripciones(value || ''))
    );
  }

  _filterDescripciones(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filtered = this.descripcionesExistentes.filter(desc =>
      desc.toLowerCase().includes(filterValue)
    );
    // Antes: return filtered.length ? filtered : [`Agregar "${value}"`];
    return filtered.length ? filtered : [`Agregar: ${value}`];
  }

  onDescripcionSelected(event: any): void {
    const value: string = event.option.value;
    if (value.startsWith('Agregar: ')) {
      const nuevaDescripcion = value.replace('Agregar: ', '');
      this.descripcionControl.setValue(nuevaDescripcion);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia la clave o muebleId (después del primer cambio), reinicia el componente
    if ((changes['key'] && !changes['key'].firstChange) || (changes['muebleId'] && !changes['muebleId'].firstChange)) {
      console.log('Los inputs han cambiado. Reiniciando componente Registrarmueble...');
      this.id = this.muebleId; // Actualiza el id con el nuevo muebleId
      this.resetComponent();
    }
  }
  
  // Inicializa el formulario
  initializeForm(): void {
    this.form = this.formBuilder.group({
      codigo: [''],
      codigoservicio: [''],
      etapaservicio: ['', Validators.required],
      fechaenvio: ['', Validators.required],
      fotoAntes: [''],
      fotoDespues: [''],
      descripcion: ['', Validators.required] // Nuevo campo
    });
  }

  // Reinicia el componente: reinicializa el formulario y vuelve a cargar la información si corresponde.
  resetComponent(): void {
    this.initializeForm();
    if (this.muebleId !== 0) {
      this.init();
    }
  } 

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64String = reader.result as string;
        this.form.patchValue({
          fotoAntes: this.base64String
        });
        console.log('Imagen convertida a base64:', this.base64String);
      };
    }
  }

  onFileChange2(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64String2 = reader.result as string;
        this.form.patchValue({
          fotoDespues: this.base64String2
        });
        console.log('Imagen convertida a base64:', this.base64String2);
      };
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.mueble.idMueble = this.form.value.codigo;
      this.mueble.descripcion = this.form.value.descripcion;
      this.mueble.etapaLavado = this.form.value.etapaservicio;
      this.mueble.fechaSecado = this.form.value.fechaenvio;
      this.mueble.fotoAntes = this.form.value.fotoAntes;
      this.mueble.fotoDespues = this.form.value.fotoDespues;
      this.mueble.servicio.idServicio = this.form.value.codigoservicio;
      console.log('Datos del servicio a enviar:', this.mueble);
      this.muS.insertar(this.mueble).subscribe((data) => {
        this.muS.list().subscribe((data) => {
          this.muS.setList(data);
        });
      });
      this.router.navigate([this.router.url]).then(() => {
        window.location.reload();
      });
    }
  }
  
  init(): void {
    if (this.edicion && this.id) {
      this.muS.listId(this.id).subscribe((data) => {
        // En lugar de crear un nuevo FormGroup, se actualiza el formulario existente
        this.form.reset({
          codigo: data.idMueble,
          descripcion: data.descripcion,
          etapaservicio: data.etapaLavado,
          fechaenvio: data.fechaSecado,
          fotoAntes: data.fotoAntes,
          fotoDespues: data.fotoDespues,
          codigoservicio: data.servicio.idServicio,
        });
        this.base64String = data.fotoAntes;
        this.base64String2 = data.fotoDespues;
      });
    }
  }
}
