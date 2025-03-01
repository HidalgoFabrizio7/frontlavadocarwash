import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { RegistrarclienteComponent } from './components/cliente/registrarcliente/registrarcliente.component';
import { CobranzaComponent } from './components/cobranza/cobranza.component';
import { RegistrarcobranzaComponent } from './components/cobranza/registrarcobranza/registrarcobranza.component';
import { MuebleComponent } from './components/mueble/mueble.component';
import { RegistrarmuebleComponent } from './components/mueble/registrarmueble/registrarmueble.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { RegistrarservicioComponent } from './components/servicio/registrarservicio/registrarservicio.component';

export const routes: Routes = [
    {
        path: 'cliente',
        component: ClienteComponent,
        children: [
          { 
            path: 'nuevocliente', component: RegistrarclienteComponent
          },
          {
            path:'edicionescliente/:id',component:RegistrarclienteComponent
          }
        ],
      },

      {
        path: 'cobranza',
        component: CobranzaComponent,
        children: [
          { 
            path: 'nuevocobranza', component: RegistrarcobranzaComponent
          },
          {
            path:'edicionescobranza/:id',component: RegistrarcobranzaComponent 
          }
        ],
      },

      {
        path: 'mueble',
        component: MuebleComponent,
        children: [
          { 
            path: 'nuevomueble', component: RegistrarmuebleComponent
          },
          {
            path:'edicionesmueble/:id',component: RegistrarmuebleComponent 
          }
        ],
      },

      {
        path: 'servicio',
        component: ServicioComponent,
        children: [
          { 
            path: 'nuevoservicio', component: RegistrarservicioComponent 
          },
          {
            path:'edicionesservicio/:id',component: RegistrarservicioComponent 
          }
        ],
      },

      /*{
        path: 'usuarios',
        component: User,
        children: [
          { 
            path: 'nuevousuarios', component: RegistrarusersComponent
          },
          {
            path:'edicionesusuarios/:id',component: RegistrarusersComponent 
          }
        ],
      },
      */
];
