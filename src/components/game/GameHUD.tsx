import { Button } from "../ui/button";
import { Play, Pause, Heart, Star, Home } from "lucide-react";

interface GameHUDProps {
    hearts: number;
    score: number;
    stars: number;
    isPlaying: boolean;
    isPaused: boolean;
    onBack: () => void;
    onTogglePause: () => void;
}

export function GameHUD({ hearts, score, stars, isPlaying, isPaused, onBack, onTogglePause }: GameHUDProps) {
    return (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="flex gap-4 items-center">
                <div className="flex gap-1 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border-2 border-pink-200">
                    {[1, 2, 3].map((i) => {
                        const fillAmount = Math.max(0, Math.min(1, hearts - (i - 1)));
                        return (
                            <div key={i} className="relative w-6 h-6">
                                <Heart className="w-6 h-6 text-pink-200 absolute top-0 left-0" />
                                <div style={{ width: `${fillAmount * 100}%`, overflow: 'hidden' }} className="absolute top-0 left-0 h-full">
                                    <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full font-display text-xl text-primary border-2 border-primary/20 shadow-sm">
                    Score: {score}
                </div>
                <div className="bg-yellow-100/80 backdrop-blur-sm px-4 py-2 rounded-full font-display text-xl text-yellow-600 border-2 border-yellow-400/20 shadow-sm flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-500" />
                    {stars}
                </div>
            </div>
            <div className="flex gap-2 pointer-events-auto">
                {isPlaying ?
                    <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); onTogglePause(); }} className="rounded-full w-12 h-12 shadow-md hover:scale-105 transition-transform">
                        {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                    </Button> :
                    <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); onBack(); }} className="rounded-full w-12 h-12 shadow-md hover:scale-105 transition-transform">
                        <Home className="w-6 h-6 text-muted-foreground" />
                    </Button>}
            </div>
        </div>
    );
}
