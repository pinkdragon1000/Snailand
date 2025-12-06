export interface Character {
  id: string;
  name: string;
  sprite: string;
  color: string;
}

// Character Assets
import nellySprite from '../../assets/nelly.svg'
import billySprite from "../../assets/billy.svg";
import sallySprite from "../../assets/sally.svg";
import tommySprite from "../../assets/tommy.svg";

export const CHARACTERS: Character[] = [
  { id: 'nelly', name: 'Nelly', sprite: nellySprite, color: 'bg-pink-200 hover:bg-pink-300 border-pink-400' },
  { id: 'sally', name: 'Sally', sprite: sallySprite, color: 'bg-purple-200 hover:bg-purple-300 border-purple-400' },
  { id: 'billy', name: 'Billy', sprite: billySprite, color: 'bg-green-200 hover:bg-green-300 border-green-400' },
  { id: 'tommy', name: 'Tommy', sprite: tommySprite, color: 'bg-blue-200 hover:bg-blue-300 border-blue-400' },
];
