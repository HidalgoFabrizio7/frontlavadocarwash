import { Servicio } from "./Servicio";

export class Mueble {
    idMueble: number = 0;
    descripcion: string = "";
    etapaLavado: string = "";
    fechaSecado: Date = new Date();
    servicio: Servicio = new Servicio();
}