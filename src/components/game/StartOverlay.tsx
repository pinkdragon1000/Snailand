import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface StartOverlayProps {
  character: string;
  characterImage: string;
  onStart: () => void;
}

export function StartOverlay({ character, characterImage, onStart }: StartOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
    >
      <Card className="p-8 flex flex-col items-center gap-6 max-w-md w-full mx-4 shadow-2xl border-4 border-primary/30">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-display text-primary drop-shadow-sm capitalize">{character}</h1>
          <p className="text-muted-foreground text-lg font-sans">Jump over obstacles and collect stars!</p>
        </div>

        <div className="w-32 h-32 bg-secondary/20 rounded-full flex items-center justify-center animate-bounce-slow">
          <img src={characterImage} alt="Character" className="w-24 h-24 object-contain" />
        </div>

        <Button size="lg" onClick={(e) => { e.stopPropagation(); onStart(); }} className="w-full text-xl h-16 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-slow">
          <Play className="mr-2 w-6 h-6 fill-current" /> Start Running
        </Button>

        <div className="text-sm text-muted-foreground flex flex-col items-center gap-2 bg-secondary/20 px-4 py-2 rounded-2xl mt-2">
          <div className="flex items-center gap-2">
            <span className="border border-foreground/20 rounded px-1.5 py-0.5 bg-white text-xs font-mono">SPACE</span>
            <span>to Jump</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-foreground/20 rounded px-1.5 py-0.5 bg-white text-xs font-mono">SPACE</span>
            <span className="border border-foreground/20 rounded px-1.5 py-0.5 bg-white text-xs font-mono">SPACE</span>
            <span>to Double Jump</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-foreground/20 rounded px-1.5 py-0.5 bg-white text-xs font-mono">→</span>
            <span>to Run Faster</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
