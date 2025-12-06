import { useEffect, useRef } from "react";
import { GAME_CONSTANTS } from "../lib/gameConstants";
import type { GameStateRef } from "../types/gameTypes";

interface UseGameControlsProps {
  onJump: () => void;
  onTogglePause: () => void;
  stateRef: React.MutableRefObject<GameStateRef>;
}

export function useGameControls({ onJump, onTogglePause, stateRef }: UseGameControlsProps) {
  const keysPressed = useRef({ space: false, arrowUp: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault(); // Prevent scrolling
        
        // Track key state for holding
        if (e.code === "Space") keysPressed.current.space = true;
        if (e.code === "ArrowUp") keysPressed.current.arrowUp = true;
        
        // Only jump on initial press (not on repeat)
        if (!e.repeat) {
          onJump();
        }
      }
      
      if (e.code === "ArrowRight") {
        stateRef.current.player.vx = GAME_CONSTANTS.MOVE_SPEED;
      }
      
      if (e.code === "Escape") {
        onTogglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        keysPressed.current.space = false;
      }
      if (e.code === "ArrowUp") {
        keysPressed.current.arrowUp = false;
      }
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        stateRef.current.player.vx = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onJump, onTogglePause, stateRef]);

  return keysPressed;
}
