export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  stars: number;
  highScore: number;
  isPaused: boolean;
  hearts: number;
}

export interface Player {
  x: number;
  y: number;
  vy: number;
  vx: number;
  width: number;
  height: number;
  isJumping: boolean;
  jumpsUsed: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
  type: number;
  stackId: number;
}

export interface Star {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

export interface GameStateRef {
  player: Player;
  obstacles: Obstacle[];
  stars: Star[];
  gameSpeed: number;
  frame: number;
  score: number;
  starCount: number;
  bgX: number;
  hearts: number;
  invincibilityTimer: number;
  isGameOver: boolean;
  isPaused: boolean;
  nextStackId: number;
}
