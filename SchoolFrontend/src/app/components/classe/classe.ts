import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasseService } from '../../Service/classe.service';
import { Classe } from '../../Models/classe.model';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classe.html',
  styleUrls: ['./classe.css']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = [];

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.classeService.getAll().subscribe(data => {
      this.classes = data;
    });
  }
}
