import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EleveService } from '../../Service/eleve.service';
import { Eleve } from '../../Models/eleve.model';

@Component({
  selector: 'app-eleve',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eleve.html',
  styleUrls: ['./eleve.css']
})
export class EleveComponent implements OnInit {
  eleves: Eleve[] = [];

  constructor(private eleveService: EleveService) {}

  ngOnInit(): void {
    this.eleveService.getAll().subscribe(data => {
      this.eleves = data;
    });
  }
}
