import { Component, OnInit } from '@angular/core';
import { XmlParserService } from '../services/xml-parser.service';
import { Systemebene } from '../models/Systemebene';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-diagramm',
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './diagramm.component.html',
  styleUrl: './diagramm.component.scss',
  standalone: true
})
export class DiagrammComponent implements OnInit {
  systemebene: Systemebene | null = null;
  
  constructor(private xmlParserService: XmlParserService, private httpClient: HttpClient) {}
  
  ngOnInit(): void {
    this.loadXmlFile();
  }

  loadXmlFile(): void {
    this.httpClient.get('/IntegrationSharePoint-basiertesIntranet.xml', { responseType: 'text' })
      .subscribe({
        next: (xmlString) => {
          this.xmlParserService.parseXml(xmlString).subscribe({
            next: (data) => {
              this.systemebene = data;
              console.log(data);
            },
            error: (err) => {
              console.error('Fehler beim Parsen:', err);
            }
          });
        },
        error: (err) => {
          console.error('Fehler beim Laden der XML-Datei:', err);
        }
      });
  }
}
