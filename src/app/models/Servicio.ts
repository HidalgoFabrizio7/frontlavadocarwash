import { Cliente } from "./Cliente";

export class Servicio { 
    idServicio: number = 0;
    tipoDeServicio: string = "";
    fotoNoObligatoriaServicio: string = "";
    fechaEnvioServicio: Date = new Date(); // Cambiado de string a Date
    fechaRecojoServicio: Date = new Date(); // Cambiado de string a Date
    fotoAntesServicio: string = "";
    fotoDespuesServicio: string = "";
    cliente: Cliente = new Cliente();
}