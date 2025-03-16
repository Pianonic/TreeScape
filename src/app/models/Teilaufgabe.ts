import { Arbeitspaket } from "./Arbeitspaket";

export interface Teilaufgabe {
    id: string;
    name: string;
    arbeitspakete: Arbeitspaket[];
}