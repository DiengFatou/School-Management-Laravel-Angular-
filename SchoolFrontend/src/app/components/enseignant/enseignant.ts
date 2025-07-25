import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnseignantService } from '../../Service/enseignant.service';
import { Enseignant } from '../../Models/enseignant.model';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enseignant.html',
  styleUrls: ['./enseignant.css']
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
    });
  }
}
