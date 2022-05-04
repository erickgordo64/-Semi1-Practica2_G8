import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertarUsuarioComponent } from './components/insertar-usuario/insertar-usuario.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LoginReconocimientoComponent } from './components/login-reconocimiento/login-reconocimiento.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { AuthGuard } from "./guards/auth.guard";
import { CarruselComponent } from './components/carrusel/carrusel.component';
const routes: Routes = [
  {
    path: 'insertarUsuario',
    component: InsertarUsuarioComponent,
    
  },
  {
    path: 'login',
    component:LoginComponent,
  },
  {
    path: 'login/reconocimiento',
    component:LoginReconocimientoComponent,
  },
  {
    path: '',
    component:HomeComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'editarUsuario',
    component:EditarUsuarioComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'crearPublicacion',
    component:CrearPublicacionComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'carrusel',
    component:CarruselComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
