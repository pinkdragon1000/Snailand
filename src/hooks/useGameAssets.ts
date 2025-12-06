import { useEffect, useRef } from "react";

interface GameAssets {
  player: HTMLImageElement;
  obstacles: HTMLImageElement[];
  coin: HTMLImageElement;
  bg: HTMLImageElement;
  loaded: boolean;
}

interface UseGameAssetsProps {
  character: string;
  nellySprite: string;
  billySprite: string;
  sallySprite: string;
  tommySprite: string;
  bgSprite: string;
  obstacle1: string;
  obstacle2: string;
  obstacle3: string;
  onLoad?: () => void;
}

export function useGameAssets({
  character,
  nellySprite,
  billySprite,
  sallySprite,
  tommySprite,
  bgSprite,
  obstacle1,
  obstacle2,
  obstacle3,
  onLoad,
}: UseGameAssetsProps) {
  const assetsRef = useRef<GameAssets>({
    player: new Image(),
    obstacles: [new Image(), new Image(), new Image()],
    coin: new Image(),
    bg: new Image(),
    loaded: false,
  });

  useEffect(() => {
    const assets = assetsRef.current;
    let loadedCount = 0;
    const totalAssets = 5; // 1 player, 3 obstacles, 1 bg

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === totalAssets) {
        assets.loaded = true;
        onLoad?.();
      }
    };

    // Select sprite based on character prop
    switch (character) {
      case 'billy':
        assets.player.src = billySprite;
        break;
      case 'sally':
        assets.player.src = sallySprite;
        break;
      case 'tommy':
        assets.player.src = tommySprite;
        break;
      default:
        assets.player.src = nellySprite;
        break;
    }
    assets.player.onload = handleLoad;

    assets.obstacles[0].src = obstacle1;
    assets.obstacles[0].onload = handleLoad;
    assets.obstacles[1].src = obstacle2;
    assets.obstacles[1].onload = handleLoad;
    assets.obstacles[2].src = obstacle3;
    assets.obstacles[2].onload = handleLoad;

    assets.bg.src = bgSprite;
    assets.bg.onload = handleLoad;
  }, [character, nellySprite, billySprite, sallySprite, tommySprite, bgSprite, obstacle1, obstacle2, obstacle3, onLoad]);

  return assetsRef;
}
