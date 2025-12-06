import { motion } from "framer-motion";
import { CHARACTERS } from "../../lib/characters";

interface CharacterSelectProps {
  onSelect: (character: string) => void;
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
       <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
       >
          <h2 className="text-5xl font-display text-primary drop-shadow-sm mb-4">Select a Character</h2>
          <p className="text-muted-foreground text-lg">Choose your snail to start the adventure!</p>
       </motion.div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {CHARACTERS.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onSelect(char.id)}
                className={`w-full aspect-square rounded-3xl border-4 ${char.color} transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl flex flex-col items-center justify-center p-4 group cursor-pointer`}
              >
                 <div className="flex-1 flex items-center justify-center w-full relative">
                    <div className="absolute inset-0 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-all" />
                    <img 
                      src={char.sprite} 
                      alt={char.name} 
                      className="w-24 h-24 object-contain relative z-10 drop-shadow-md"
                    />
                 </div>
                 <span className="font-display text-xl text-foreground/80 mt-4 group-hover:text-foreground">{char.name}</span>
              </button>
            </motion.div>
          ))}
       </div>
    </div>
  );
}
