import { useState } from "react";
import GameCanvas from "../components/game/GameCanvas";
import CharacterSelect from "../components/game/CharacterSelect";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GamePage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleBack = () => setSelectedCharacter(null);

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
