import { Component, OnInit } from '@angular/core';
import { XmlParserService } from '../services/xml-parser.service';
import { Systemebene } from '../models/Systemebene';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-diagramm',
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './diagramm.component.html',
  styleUrl: './diagramm.component.scss',
  standalone: true
})
export class DiagrammComponent implements OnInit {
  systemebene: Systemebene | null = null;

  constructor(
    private xmlParserService: XmlParserService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router // Router hinzufügen
  ) {}

  ngOnInit(): void {
    const fileName = this.route.snapshot.paramMap.get('file');
    if (!fileName) {
      this.router.navigate(['/404']); // Nutzung von Angular Router für die Weiterleitung
      return;
    }
    this.loadXmlFile(fileName + ".xml");
  }

  loadXmlFile(filename: string): void {
    this.httpClient.get(filename, { responseType: 'text' })
      .subscribe({
        next: (xmlString) => {
          this.xmlParserService.parseXml(xmlString).subscribe({
            next: (data) => {
              this.systemebene = data;
              //console.log(data);
            },
            error: (err) => {
              console.error('Fehler beim Parsen:', err);
              this.router.navigate(['/404']); // Weiterleitung bei Fehler
            }
          });
        },
        error: (err) => {
          console.error('Fehler beim Laden der XML-Datei:', err);
          this.router.navigate(['/404']); // Weiterleitung bei Fehler
        }
      });
  }
}