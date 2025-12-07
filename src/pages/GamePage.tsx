import { useState, useEffect } from "react";
import GameCanvas from "../components/game/GameCanvas";
import CharacterSelect from "../components/game/CharacterSelect";
import { Button } from "../components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { playMenuMusic, stopMenuMusic } from "../lib/soundUtils";

export default function GamePage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const handleLetsPlay = () => {
    setShowWelcome(false);
    if (musicEnabled) {
      playMenuMusic();
      setMusicStarted(true);
    }
  };

  const toggleMusic = () => {
    const newMusicEnabled = !musicEnabled;
    setMusicEnabled(newMusicEnabled);
    
    if (newMusicEnabled) {
      // Turning music on
      if (!selectedCharacter) {
        playMenuMusic();
        setMusicStarted(true);
      }
    } else {
      // Turning music off
      stopMenuMusic();
      setMusicStarted(false);
    }
  };

  // Stop menu music when entering game, restart when going back to character select
  useEffect(() => {
    if (selectedCharacter) {
      // Entering game - stop music
      stopMenuMusic();
      setMusicStarted(false);
    } else if (musicEnabled && musicStarted) {
      // Back on character select with music enabled - play music
      playMenuMusic();
    }
    
    return () => {
      // Cleanup when component unmounts
      stopMenuMusic();
    };
  }, [selectedCharacter, musicEnabled, musicStarted]);

  const handleBack = () => setSelectedCharacter(null);

  // Show welcome screen first
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-primary tracking-tight drop-shadow-sm">
            Snailand
          </h1>
          <img 
            src="/assets/allSnails.png" 
            alt="All Snail Characters" 
            className="w-full max-w-2xl mx-auto"
          />
          <Button 
            size="lg"
            onClick={handleLetsPlay}
            className="text-2xl py-8 px-12 rounded-2xl"
          >
            Let's Play!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <header className="mb-8 text-center space-y-2 relative w-full max-w-4xl">
        {selectedCharacter && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-0 flex items-center justify-center hover:bg-primary/10 hover:text-primary z-10 h-16 w-16"
            onClick={handleBack}
            aria-label="Back to character selection"
          >
            <ArrowLeft className="!w-8 !h-8" />
          </Button>
        )}
        
        {/* Music toggle button - only show on character select */}
        {!selectedCharacter && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 flex items-center justify-center hover:bg-primary/10 hover:text-primary z-10 h-16 w-16"
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            aria-label={musicEnabled ? "Turn music off" : "Turn music on"}
          >
            {musicEnabled ? <Volume2 className="!w-8 !h-8" /> : <VolumeX className="!w-8 !h-8" />}
          </Button>
        )}
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary tracking-tight drop-shadow-sm">
          Snailand
        </h1>
      </header>

      <main className="w-full flex flex-col items-center">
        {!selectedCharacter ? (
          <CharacterSelect onSelect={setSelectedCharacter} />
        ) : (
          <GameCanvas character={selectedCharacter} onBack={handleBack} />
        )}
        
        {selectedCharacter && (
          <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
            <p>Pro Tip: Collect stars for bonus points! Speed increases over time.</p>
          </div>
        )}
      </main>
    </div>
  );
}
