import { Component } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent {
  playGame(gameName: string) {
    if (gameName === 'snake') {
      window.open('snake-game-url', '_blank');
    }
    // Add logic for other games if needed
  }
}
