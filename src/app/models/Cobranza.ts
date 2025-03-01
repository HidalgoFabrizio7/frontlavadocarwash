import { Servicio } from "./Servicio";

export class Cobranza {
    idCobranza: number = 0;
    fechaCobro: Date = new Date();
    medioPago: string = "";
    servicio: Servicio = new Servicio();
}