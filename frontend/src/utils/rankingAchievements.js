// Evalúa logros según la posición en el ranking
export const checkRankingAchievements = (position, totalUsers) => {
  const achievements = [];

  if (!position || !totalUsers) return achievements;

  const percentile = position / totalUsers;

  // Top 50%
  if (percentile <= 0.5) {
    achievements.push("top_50");
  }

  // Top 10
  if (position <= 10) {
    achievements.push("top_10");
  }

  // Número 1
  if (position === 1) {
    achievements.push("top_1");
  }

  return achievements;
};
