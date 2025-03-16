import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Systemebene } from '../models/Systemebene';
import { Projekt } from '../models/Projekt';
import { Teilprojekt } from '../models/Teilprojekt';
import { Teilaufgabe } from '../models/Teilaufgabe';
import { Arbeitspaket } from '../models/Arbeitspaket';

@Injectable({
  providedIn: 'root',
})
export class XmlParserService {

  private parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

  constructor() { }

  parseXml(xml: string): Observable<Systemebene | null> {
    return new Observable<Systemebene>((observer) => {
      this.parser.parseString(xml, (err, result) => {
        if (err) {
          observer.error('Fehler beim Parsen des XML');
        } else {
          const systemebene: Systemebene = this.convertToSystemebene(result);
          observer.next(systemebene);
          observer.complete();
        }
      });
    }).pipe(
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private convertToSystemebene(result: any): Systemebene {
    const projekt: Projekt = this.convertToProjekt(result.Systemebene.Projekt);
    return { projekt };
  }

  private convertToProjekt(projektData: any): Projekt {
    const teilprojekte: Teilprojekt[] = projektData.Teilprojekte.Teilprojekt.map((teilprojekt: any) => this.convertToTeilprojekt(teilprojekt));
    return { id: projektData.id, name: projektData.Name, teilprojekte };
  }

  private convertToTeilprojekt(teilprojektData: any): Teilprojekt {
    let teilaufgaben: Teilaufgabe[] = [];
    let arbeitspakete: Arbeitspaket[] = [];

    // Check if there are Teilaufgaben or Arbeitspakete
    if (teilprojektData.Teilaufgaben) {
      teilaufgaben = teilprojektData.Teilaufgaben.Teilaufgabe.map((teilaufgabe: any) => this.convertToTeilaufgabe(teilaufgabe));
    } else if (teilprojektData.Arbeitspakete) {
      // If there are no Teilaufgaben, but there are Arbeitspakete, handle it as a single element case
      arbeitspakete = this.convertArbeitspakete(teilprojektData.Arbeitspakete.Arbeitspaket);
    }

    return { id: teilprojektData.id, name: teilprojektData.Name, teilaufgaben, arbeitspakete };
  }

  private convertToTeilaufgabe(teilaufgabeData: any): Teilaufgabe {
    const arbeitspakete: Arbeitspaket[] = this.convertArbeitspakete(teilaufgabeData.Arbeitspakete.Arbeitspaket);
    return { id: teilaufgabeData.id, name: teilaufgabeData.Name, arbeitspakete };
  }

  private convertArbeitspakete(arbeitspaketeData: any): Arbeitspaket[] {
    // If there's only one Arbeitspaket, wrap it in an array
    if (!Array.isArray(arbeitspaketeData)) {
      arbeitspaketeData = [arbeitspaketeData];
    }

    return arbeitspaketeData.map((arbeitspaket: any) => this.convertToArbeitspaket(arbeitspaket));
  }

  private convertToArbeitspaket(arbeitspaketData: any): Arbeitspaket {
    return { id: arbeitspaketData.id, name: arbeitspaketData.Name };
  }
}
