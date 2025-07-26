import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Pas de forRoot ici !
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'SchoolFrontend';
}
