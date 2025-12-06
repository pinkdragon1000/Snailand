import { HIGH_SCORE_KEY } from "./gameConstants";

export const saveHighScore = (score: number): void => {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
};

export const loadHighScore = (): number => {
  const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
  return savedScore ? parseInt(savedScore, 10) : 0;
};
