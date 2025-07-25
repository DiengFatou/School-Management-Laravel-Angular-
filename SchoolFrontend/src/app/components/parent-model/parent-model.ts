import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentService } from '../../Service/parent.service';
import { Parent } from '../../Models/parent.model';

@Component({
  selector: 'app-parent-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parent-model.html',
  styleUrls: ['./parent-model.css']
})
export class ParentModelComponent implements OnInit {
  parents: Parent[] = [];

  constructor(private parentService: ParentService) {}

  ngOnInit(): void {
    this.parentService.getAll().subscribe(data => {
      this.parents = data;
    });
  }
}
