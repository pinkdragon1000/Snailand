import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { GameHUD } from "./GameHUD";
import { StartOverlay } from "./StartOverlay";
import { GameOverOverlay } from "./GameOverOverlay";
import { GAME_CONSTANTS } from "../../lib/gameConstants";
import { saveHighScore, loadHighScore } from "../../lib/gameStorage";
import { useGameAssets } from "../../hooks/useGameAssets";
import { useGameControls } from "../../hooks/useGameControls";
import { drawStar } from "../../lib/drawUtils";
import type { GameState, GameStateRef } from "../../types/gameTypes";

// Assets
import nellySprite from "../../../assets/nelly.svg";
import billySprite from "../../../assets/billy.svg";
import sallySprite from "../../../assets/sally.svg";
import tommySprite from '../../../assets/tommy.svg';

import bgSprite from "../../../assets/background.png";
import obstacle1 from "../../../assets/obstacle_1.svg";
import obstacle2 from "../../../assets/obstacle_2.svg";
import obstacle3 from "../../../assets/obstacle_3.svg";

interface GameCanvasProps {
  character: string;
  onBack: () => void;
}

export default function GameCanvas({ character, onBack }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    stars: 0,
    highScore: loadHighScore(),
    isPaused: false,
    hearts: 3,
  });

  // Map character prop to sprite image
  const getCharacterSprite = (char: string) => {
    switch (char) {
      case 'billy':
        return billySprite;
      case 'sally':
        return sallySprite;
      case 'tommy':
        return tommySprite;
      default:
        return nellySprite;
    }
  };

  // Refs for game loop to avoid stale closures
  const requestRef = useRef<number>(0);
  const stateRef = useRef<GameStateRef>({
    player: { 
      x: 50, 
      y: 0, 
      vy: 0, 
      vx: 0, 
      width: GAME_CONSTANTS.PLAYER_SIZE.width, 
      height: GAME_CONSTANTS.PLAYER_SIZE.height, 
      isJumping: false, 
      jumpsUsed: 0 
    },
    obstacles: [],
    stars: [],
    gameSpeed: GAME_CONSTANTS.INITIAL_SPEED,
    frame: 0,
    score: 0,
    starCount: 0,
    bgX: 0,
    hearts: 3,
    invincibilityTimer: 0,
    isGameOver: false,
    isPaused: false,
    nextStackId: 0,
  });

  // Load game assets
  const assetsRef = useGameAssets({
    character,
    nellySprite,
    billySprite,
    sallySprite,
    tommySprite,
    bgSprite,
    obstacle1,
    obstacle2,
    obstacle3,
    onLoad: () => {
      if (canvasRef.current && !gameState.isPlaying) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) drawGame(ctx);
      }
    },
  });

  const jump = useCallback(() => {
    const { player } = stateRef.current;
    if (player.jumpsUsed < GAME_CONSTANTS.MAX_JUMPS && !gameState.isPaused && gameState.isPlaying) {
      player.vy = GAME_CONSTANTS.JUMP_STRENGTH;
      player.isJumping = true;
      player.jumpsUsed++;
    } else if (gameState.isGameOver) {
      restartGame();
    } else if (!gameState.isPlaying) {
      startGame();
    }
  }, [gameState.isPaused, gameState.isPlaying, gameState.isGameOver]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isGameOver: false, score: 0, stars: 0, isPaused: false, hearts: 3 }));
    stateRef.current = {
      player: { 
        x: 50, 
        y: 0, 
        vy: 0, 
        vx: 0, 
        width: GAME_CONSTANTS.PLAYER_SIZE.width, 
        height: GAME_CONSTANTS.PLAYER_SIZE.height, 
        isJumping: false, 
        jumpsUsed: 0 
      },
      obstacles: [],
      stars: [],
      gameSpeed: GAME_CONSTANTS.INITIAL_SPEED,
      frame: 0,
      score: 0,
      starCount: 0,
      bgX: 0,
      hearts: 3,
      invincibilityTimer: 0,
      isGameOver: false,
      isPaused: false,
      nextStackId: 0,
    };
    if (canvasRef.current) {
      // Reset player Y
      stateRef.current.player.y = canvasRef.current.height - GAME_CONSTANTS.GROUND_HEIGHT - stateRef.current.player.height;
      // Reset player X to center
      stateRef.current.player.x = (canvasRef.current.width / 2) - (stateRef.current.player.width / 2);
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const restartGame = () => {
    startGame();
  };

  const togglePause = () => {
    if (gameState.isGameOver) return;

    if (stateRef.current.isPaused) {
      stateRef.current.isPaused = false;
      setGameState(prev => ({ ...prev, isPaused: false }));
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      stateRef.current.isPaused = true;
      setGameState(prev => ({ ...prev, isPaused: true }));
      cancelAnimationFrame(requestRef.current);
    }
  };

  const gameLoop = () => {
    if (!canvasRef.current || !assetsRef.current.loaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateGame(canvas);
    drawGame(ctx);

    if (!stateRef.current.gameSpeed) return; // Stop loop if game over logic set speed to 0 (handled in update)

    if (!stateRef.current.isPaused && !stateRef.current.isGameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updateGame = (canvas: HTMLCanvasElement) => {
    const state = stateRef.current;

    // Calculate effective movement speed (Game Speed + Player Horizontal Input)
    // If player moves RIGHT (vx > 0), objects move LEFT faster
    // If player moves LEFT (vx < 0), objects move LEFT slower
    const effectiveSpeed = state.gameSpeed + state.player.vx;

    // Update Background
    state.bgX -= effectiveSpeed * 0.5; // Parallax effect
    if (state.bgX <= -canvas.width) state.bgX = 0;

    // Update Invincibility
    if (state.invincibilityTimer > 0) {
      state.invincibilityTimer--;
    }

    // Update Player Vertical only (Horizontal is handled by moving the world)
    // Apply hover/float when spacebar is held down in the air
    const isHoldingJump = keysPressed.current.space || keysPressed.current.arrowUp;
    
    state.player.vy += GAME_CONSTANTS.GRAVITY;
    
    // If holding jump and moving downward (falling), counteract gravity to float
    if (isHoldingJump && state.player.isJumping && state.player.vy > 0) {
      // Counteract most of the downward velocity to create a floating effect
      state.player.vy *= 0.1; // Reduces fall speed dramatically
    }
    
    state.player.y += state.player.vy;
    
    // Ensure player stays in center horizontally
    state.player.x = (canvas.width / 2) - (state.player.width / 2);    // Ground Collision
    const groundY = canvas.height - GAME_CONSTANTS.GROUND_HEIGHT - state.player.height;
    if (state.player.y >= groundY) {
      state.player.y = groundY;
      state.player.vy = 0;
      state.player.isJumping = false;
      state.player.jumpsUsed = 0; // Reset jumps when landing
    }

    // Spawn Obstacles
    const spawnVariance = Math.floor(Math.random() * GAME_CONSTANTS.OBSTACLE_SPAWN_VARIANCE * 2 - GAME_CONSTANTS.OBSTACLE_SPAWN_VARIANCE);
    const spawnInterval = Math.floor(1000 / state.gameSpeed) + spawnVariance;
    if (state.frame % spawnInterval === 0) {
      if (Math.random() < GAME_CONSTANTS.OBSTACLE_SPAWN_CHANCE) {
        const obstacleType = Math.floor(Math.random() * 3); // 0, 1, 2
        const stackHeight = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 obstacles stacked
        const stackId = state.nextStackId++;
        
        // Create stacked obstacles - they all share the same stackId and X position
        for (let stack = 0; stack < stackHeight; stack++) {
          state.obstacles.push({
            x: canvas.width,
            y: groundY + 10 - (stack * GAME_CONSTANTS.OBSTACLE_SIZE.height),
            width: GAME_CONSTANTS.OBSTACLE_SIZE.width,
            height: GAME_CONSTANTS.OBSTACLE_SIZE.height,
            passed: false,
            type: obstacleType,
            stackId: stackId
          });
        }
      }
    }

    // Spawn Stars
    if (state.frame % GAME_CONSTANTS.STAR_SPAWN_INTERVAL === 0) {
      const starX = canvas.width;
      const starY = groundY - GAME_CONSTANTS.STAR_SPAWN_HEIGHT_MIN - Math.random() * GAME_CONSTANTS.STAR_SPAWN_HEIGHT_RANGE;
      const starWidth = GAME_CONSTANTS.STAR_SIZE.width;
      const starHeight = GAME_CONSTANTS.STAR_SIZE.height;
      
      // Check if star would overlap with any obstacles
      const isSafeSpot = !state.obstacles.some(obs => {
        const minDistance = GAME_CONSTANTS.STAR_MIN_DISTANCE_FROM_OBSTACLES;
        const horizontalOverlap = Math.abs(starX - obs.x) < minDistance;
        const verticalOverlap = 
          starY < obs.y + obs.height + minDistance &&
          starY + starHeight > obs.y - minDistance;
        return horizontalOverlap && verticalOverlap;
      });
      
      // Only spawn if position is safe
      if (isSafeSpot) {
        state.stars.push({
          x: starX,
          y: starY,
          width: starWidth,
          height: starHeight,
          collected: false
        });
      }
    }

    // Update Obstacles
    const passedStacks = new Set<number>();
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const obs = state.obstacles[i];
      obs.x -= effectiveSpeed;

      // Collision Detection (Simple AABB)
      // Shrink hitboxes slightly for forgiving gameplay
      if (
        state.invincibilityTimer === 0 &&
        state.player.x < obs.x + obs.width - GAME_CONSTANTS.COLLISION_BUFFER &&
        state.player.x + state.player.width > obs.x + GAME_CONSTANTS.COLLISION_BUFFER &&
        state.player.y < obs.y + obs.height - GAME_CONSTANTS.COLLISION_BUFFER &&
        state.player.y + state.player.height > obs.y + GAME_CONSTANTS.COLLISION_BUFFER
      ) {
        // Hit!
        state.hearts -= GAME_CONSTANTS.HEART_DAMAGE;
        state.invincibilityTimer = GAME_CONSTANTS.INVINCIBILITY_FRAMES;

        if (state.hearts <= 0) {
          gameOver();
          return;
        }
      }

      // Remove off-screen and score only once per stack
      if (obs.x + obs.width < -100) {
        if (!obs.passed && !passedStacks.has(obs.stackId)) {
          state.score += 1;
          passedStacks.add(obs.stackId);
        }
        state.obstacles.splice(i, 1);
      }
    }

    // Update Stars
    for (let i = state.stars.length - 1; i >= 0; i--) {
      const star = state.stars[i];
      star.x -= effectiveSpeed;

      // Collection Detection
      if (
        !star.collected &&
        state.player.x < star.x + star.width &&
        state.player.x + state.player.width > star.x &&
        state.player.y < star.y + star.height &&
        state.player.y + state.player.height > star.y
      ) {
        star.collected = true;
        state.stars.splice(i, 1);
        state.starCount += 1; // Correctly update counter
        state.score += GAME_CONSTANTS.STAR_SCORE_BONUS; // Bonus score for stars
      }

      // Remove off-screen
      if (star.x + star.width < -100) {
        state.stars.splice(i, 1);
      }
    }

    // Speed Up
    if (state.frame % GAME_CONSTANTS.SPEED_INCREASE_INTERVAL === 0) {
      state.gameSpeed += GAME_CONSTANTS.SPEED_INCREASE_AMOUNT;
    }

    state.frame++;

    // Sync React State for UI (throttle this if performance suffers, but fine for simple game)
    if (state.frame % 10 === 0) {
      setGameState(prev => ({
        ...prev,
        score: state.score,
        stars: state.starCount,
        hearts: state.hearts
      }));
    }
  };

  const gameOver = () => {
    cancelAnimationFrame(requestRef.current);
    const state = stateRef.current;
    state.isGameOver = true; // Ensure loop stops synchronously

    const newHighScore = Math.max(state.score, gameState.highScore);
    saveHighScore(newHighScore);

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
      highScore: newHighScore,
      score: state.score,
      stars: state.starCount,
      hearts: 0
    }));
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    const state = stateRef.current;
    const assets = assetsRef.current;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background
    if (assets.bg.complete) {
      ctx.drawImage(assets.bg, state.bgX, 0, canvas.width, canvas.height);
      ctx.drawImage(assets.bg, state.bgX + canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#fce4ec"; // Fallback pink
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw Ground (Visual only, logic is in update)
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, canvas.height - GAME_CONSTANTS.GROUND_HEIGHT, canvas.width, GAME_CONSTANTS.GROUND_HEIGHT);

    // Draw Player
    // Flash effect if invincible
    if (state.invincibilityTimer === 0 || Math.floor(state.frame / 5) % 2 === 0) {
      if (assets.player.complete) {
        ctx.drawImage(assets.player, state.player.x, state.player.y, state.player.width, state.player.height);
      } else {
        ctx.fillStyle = "#90a4ae";
        ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
      }
    }

    // Draw Obstacles
    state.obstacles.forEach(obs => {
      const obstacleImg = assets.obstacles[obs.type];
      if (obstacleImg && obstacleImg.complete) {
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
      } else {
        ctx.fillStyle = "#ef5350";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      }
    });

    // Draw Stars
    state.stars.forEach(star => {
      // Draw a star instead of image
      const centerX = star.x + star.width / 2;
      const centerY = star.y + star.height / 2;
      const radius = star.width / 1.5;

      drawStar(ctx, centerX, centerY, radius, 0.5, "#facc15"); // Yellow-400
    });
  };

  // Handle Keyboard Input
  const keysPressed = useGameControls({
    onJump: jump,
    onTogglePause: togglePause,
    stateRef,
  });

  // Resize Canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = 500; // Fixed height for consistent gameplay

          // Re-position player if resize happens during idle
          if (!gameState.isPlaying && !gameState.isGameOver) {
            const ctx = canvasRef.current.getContext('2d');
            stateRef.current.player.y = canvasRef.current.height - GAME_CONSTANTS.GROUND_HEIGHT - stateRef.current.player.height;
            if (ctx) drawGame(ctx);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="w-full max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-xl border-4 border-white/50">
      <canvas
        ref={canvasRef}
        className="block w-full h-[500px] bg-pink-50 cursor-pointer touch-none"
        onClick={jump}
        data-testid="game-canvas"
      />

      <GameHUD
        hearts={gameState.hearts}
        score={gameState.score}
        stars={gameState.stars}
        isPlaying={gameState.isPlaying}
        isPaused={gameState.isPaused}
        onBack={onBack}
        onTogglePause={togglePause}
      />

      <AnimatePresence>
        {!gameState.isPlaying && !gameState.isGameOver && (
          <StartOverlay
            character={character}
            characterImage={getCharacterSprite(character)}
            onStart={startGame}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState.isGameOver && (
          <GameOverOverlay
            score={gameState.score}
            highScore={gameState.highScore}
            onRestart={restartGame}
            onBackToMenu={onBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
