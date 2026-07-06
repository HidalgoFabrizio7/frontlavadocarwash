import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { RegistrarclienteComponent } from './components/cliente/registrarcliente/registrarcliente.component';
import { CobranzaComponent } from './components/cobranza/cobranza.component';
import { RegistrarcobranzaComponent } from './components/cobranza/registrarcobranza/registrarcobranza.component';
import { MuebleComponent } from './components/mueble/mueble.component';
import { RegistrarmuebleComponent } from './components/mueble/registrarmueble/registrarmueble.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { RegistrarservicioComponent } from './components/servicio/registrarservicio/registrarservicio.component';
import { ListarmuebleComponent } from './components/mueble/listarmueble/listarmueble.component';
import { RouterModule } from '@angular/router';
import { EstadosmuebleComponent } from './components/mueble/estadosmueble/estadosmueble.component';
import { CameraComponent } from './components/camera/camera.component';
import { LoginComponent } from './components/login/login.component';
import { RecojosycierreComponent } from './components/servicio/recojosycierre/recojosycierre.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },

    {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard],
    children: [
      {
      path: 'nuevocliente', component: RegistrarclienteComponent,
      },
      {
      path:'edicionescliente/:id',component:RegistrarclienteComponent
      },
    ],

    },

    {
      path: 'camera',
      component: CameraComponent,
      canActivate: [authGuard]
    },

    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [authGuard, roleGuard(['ADMIN','SUPERVISOR'])]
    },

    {
    path: 'cobranza',
    component: CobranzaComponent,
    canActivate: [authGuard],
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
    canActivate: [authGuard],
    children: [
      {
      path: 'nuevomueble', component: RegistrarmuebleComponent
      },
      {
      path:'edicion/:id', component: RegistrarmuebleComponent
      },
      {
        path:'estadomueble', component: EstadosmuebleComponent
      }
    ],
    },

    {
    path: 'servicio',
    component: ServicioComponent,
    canActivate: [authGuard],
    children: [
      {
      path: 'nuevoservicio', component: RegistrarservicioComponent
      },
      {
      path:'ediciones/:id',component: RegistrarservicioComponent,
      children: [
        {
        path: 'registro', component: RegistrarmuebleComponent,
        },
        {
        path: 'listamueblesbserv', component: ListarmuebleComponent,
        }
      ]
      },
      {
      path: 'recojos', component: RecojosycierreComponent, canActivate: [authGuard, roleGuard(['ADMIN','EMPLEADO'])]
      },

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
