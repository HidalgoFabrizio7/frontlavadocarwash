import { Cliente } from "./Cliente";

export class Servicio { 
    idServicio: number = 0;
    tipoDeServicio: string = "";
    fotoNoObligatoriaServicio: string = "";
    fechaEnvioServicio: string = "";
    fechaRecojoServicio: string = "";
    fotoAntesServicio: string = "";
    fotoDespuesServicio: string = "";
    cliente: Cliente = new Cliente();
}