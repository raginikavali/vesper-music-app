import { useMemo } from 'react';

export function useMoodMatch(songs, position = { x: 0.3, y: 0.3 }) {
  return useMemo(() => {
    const { x, y } = position;

    // Calculate Euclidean distance for each song: sqrt((energy - x)^2 + (valence - y)^2)
    const scoredSongs = songs.map(song => {
      const energy = song.energy !== undefined ? song.energy : 0.5;
      const valence = song.valence !== undefined ? song.valence : 0.5;
      const dist = Math.sqrt(Math.pow(energy - x, 2) + Math.pow(valence - y, 2));
      return { ...song, dist };
    });

    // Sort by distance ascending & pick top 10
    scoredSongs.sort((a, b) => a.dist - b.dist);
    const top10 = scoredSongs.slice(0, 10);

    // Quadrant Playfair label mapping
    let moodLabel = "Deep & Quiet";
    if (x >= 0.5 && y >= 0.5) {
      moodLabel = "Radiant & Alive";
    } else if (x < 0.5 && y >= 0.5) {
      moodLabel = "Bright & Easy";
    } else if (x < 0.5 && y < 0.5) {
      moodLabel = "Deep & Quiet";
    } else if (x >= 0.5 && y < 0.5) {
      moodLabel = "Late & Restless";
    }

    // Dynamic HSL tint shift based on X & Y
    const hue = Math.round(35 + x * 20 - y * 15); // Subtle gold-amber warm hue shift
    const opacity = 0.03 + (x + y) * 0.02;

    return {
      nearestSongs: top10,
      moodLabel,
      hue,
      opacity,
    };
  }, [songs, position.x, position.y]);
}
