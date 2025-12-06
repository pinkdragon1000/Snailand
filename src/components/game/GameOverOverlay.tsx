import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Home, RotateCcw, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function GameOverOverlay({ score, highScore, onRestart, onBackToMenu }: GameOverOverlayProps) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <Card className="p-8 flex flex-col items-center gap-6 max-w-md w-full mx-4 shadow-2xl border-4 border-destructive/30">
        <div className="text-center">
          <h2 className="text-4xl font-display text-destructive mb-2">Oof!</h2>
          <p className="text-muted-foreground">You ran out of hearts!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-muted p-4 rounded-2xl text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Score</p>
            <p className="text-3xl font-display text-primary">{score}</p>
          </div>
          <div className="bg-muted p-4 rounded-2xl text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Best</p>
            <p className="text-3xl font-display text-secondary-foreground flex items-center justify-center gap-1">
              {isNewHighScore && <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
              {highScore}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="outline" size="lg" onClick={(e) => { e.stopPropagation(); onBackToMenu(); }} className="flex-1 h-14 rounded-2xl">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button size="lg" onClick={(e) => { e.stopPropagation(); onRestart(); }} className="flex-1 h-14 rounded-2xl shadow-lg hover:scale-105 transition-all">
            <RotateCcw className="mr-2 w-6 h-6" /> Try Again
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
