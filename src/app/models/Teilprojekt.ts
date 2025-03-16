import { Arbeitspaket } from "./Arbeitspaket";
import { Teilaufgabe } from "./Teilaufgabe";

export interface Teilprojekt {
    id: string;
    name: string;
    teilaufgaben: Teilaufgabe[];
    arbeitspakete?: Arbeitspaket[];
}