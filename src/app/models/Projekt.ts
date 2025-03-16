import { Teilprojekt } from "./Teilprojekt";

export interface Projekt {
    id: string;
    name: string;
    teilprojekte: Teilprojekt[];
}