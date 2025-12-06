export const GAME_CONSTANTS = {
  // Physics
  GRAVITY: 0.6,
  JUMP_STRENGTH: -12,
  MOVE_SPEED: 5,
  GROUND_HEIGHT: 100,
  INITIAL_SPEED: 6,
  
  // Combat
  INVINCIBILITY_FRAMES: 60,
  HEART_DAMAGE: 0.5,
  COLLISION_BUFFER: 10,
  
  // Gameplay
  MAX_JUMPS: 2,
  STAR_SCORE_BONUS: 10,
  CANVAS_HEIGHT: 500,
  
  // Spawning
  OBSTACLE_SPAWN_CHANCE: 0.7,
  OBSTACLE_SPAWN_VARIANCE: 30, // +/- frames
  STAR_SPAWN_INTERVAL: 150,
  STAR_SPAWN_HEIGHT_MIN: 50,
  STAR_SPAWN_HEIGHT_RANGE: 100,
  STAR_MIN_DISTANCE_FROM_OBSTACLES: 80, // Pixels
  
  // Progression
  SPEED_INCREASE_INTERVAL: 500,
  SPEED_INCREASE_AMOUNT: 0.5,
  
  // Sizes
  PLAYER_SIZE: { width: 60, height: 60 },
  OBSTACLE_SIZE: { width: 50, height: 50 },
  STAR_SIZE: { width: 30, height: 30 },
} as const;

export const HIGH_SCORE_KEY = "snailandRunHighScore";
