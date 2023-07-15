// snake.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {
  snake!: HTMLElement;
  food!: HTMLElement;
  gameArea!: HTMLElement;
  snakeSpeed = 2;
  timer: any;
  dx = 10;
  dy = 0;
  highScore = 0;
  score = 0;
  isGameRunning = false;
  isGameOver = false;
  username = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.gameArea = document.querySelector('.game-area')!;
    this.snake = document.querySelector('.snake')!;
    this.food = document.querySelector('.food')!;
    this.placeFood();
    document.addEventListener('keydown', this.onKeydown.bind(this));

    // Retrieve high score from the database
    const userId = this.authService.getUsername(); // Get the logged-in user's ID
    if (userId) {
      this.authService.getHighScore(userId).then((highScore: number) => {
        this.highScore = highScore || 0;
      });
    }
  }

  startGame() {
    // Reset high score and score
    this.score = 0;
    this.isGameOver = false;

    // Reset snake position
    this.snake.style.left = '0px';
    this.snake.style.top = '0px';

    // Remove existing snake segments
    const segments = this.snake.getElementsByClassName('snake-segment');
    while (segments[0]) {
      segments[0].parentNode?.removeChild(segments[0]);
    }

    // Retrieve the high score from the database
    const userId = this.authService.getUsername();
    if (userId) {
      this.authService.getHighScore(userId).then((highScore: number) => {
        this.highScore = highScore || 0;

        // Start the game logic
        clearInterval(this.timer);
        this.timer = setInterval(this.moveSnake.bind(this), 100);
        this.isGameRunning = true;
      });
    }
  }

  restartGame() {
    this.startGame();
    this.highScore = 0;
  }

  closeGame() {
    this.router.navigate(['/']); // Add code to navigate back to the previous game selection page
  }

  onKeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37: // Left
        if (this.dx !== 10) {
          this.dx = -10;
          this.dy = 0;
        }
        break;
      case 38: // Up
        if (this.dy !== 10) {
          this.dx = 0;
          this.dy = -10;
        }
        break;
      case 39: // Right
        if (this.dx !== -10) {
          this.dx = 10;
          this.dy = 0;
        }
        break;
      case 40: // Down
        if (this.dy !== -10) {
          this.dx = 0;
          this.dy = 10;
        }
        break;
    }
  }

  moveSnake() {
    // Get the snake's position
    let posX = this.snake.offsetLeft;
    let posY = this.snake.offsetTop;

    // Calculate new position
    posX += this.dx;
    posY += this.dy;

    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
      const userId = this.authService.getUsername(); // Get the logged-in user's ID
      if (userId) {
        this.authService.storeHighScore(userId, this.highScore);
      }
    }

    // Check collision with game area
    if (
      posX < 0 ||
      posX >= this.gameArea.offsetWidth ||
      posY < 0 ||
      posY >= this.gameArea.offsetHeight
    ) {
      clearInterval(this.timer);
      this.isGameOver = true;
      alert('Game over!');
      return;
    }

    // Move the snake
    this.snake.style.left = posX + 'px';
    this.snake.style.top = posY + 'px';

    // Check if snake ate the food
    if (posX === this.food.offsetLeft && posY === this.food.offsetTop) {
      // Increase snake size
      const newSegment = document.createElement('div');
      newSegment.classList.add('snake-segment');
      this.snake.appendChild(newSegment);

      // Update score
      this.score++;

      // Update high score if needed
      if (this.score > this.highScore) {
        this.highScore = this.score;
        const userId = this.authService.getUsername();
        if (userId) {
          this.authService.storeHighScore(userId, this.highScore);
        }
      }

      // Place new food
      this.placeFood();
    }

    // Check for collision with self
    const segments = this.snake.getElementsByClassName('snake-segment');
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i] as HTMLElement;
      if (posX === segment.offsetLeft && posY === segment.offsetTop) {
        clearInterval(this.timer);
        this.isGameOver = true;
        alert('Game over!');
        return;
      }
    }
  }

  placeFood() {
    // Generate random position for food
    const maxX = Math.floor(this.gameArea.offsetWidth / 10);
    const maxY = Math.floor(this.gameArea.offsetHeight / 10);
    const posX = Math.floor(Math.random() * maxX) * 10;
    const posY = Math.floor(Math.random() * maxY) * 10;
    this.food.style.left = posX + 'px';
    this.food.style.top = posY + 'px';
  }
}
