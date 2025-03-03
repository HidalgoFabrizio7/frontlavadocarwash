import { Servicio } from "./Servicio";

export class Mueble {
    idMueble: number = 0;
    descripcion: string = "";
    etapaLavado: string = "";
    fechaSecado: Date = new Date();
    fotoAntes: string = "";
    fotoDespues: string = "";
    servicio: Servicio = new Servicio();
}