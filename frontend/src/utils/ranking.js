export const buildRanking = (allUsersData) => {
  return allUsersData
    .filter(u => u.avgConsumption > 0)
    .sort((a, b) => a.avgConsumption - b.avgConsumption)
    .map((user, index) => ({
      ...user,
      position: index + 1
    }));
};

export const getUserPosition = (ranking, userId) => {
  return ranking.find(r => r.id === userId);
};

export const getCampusAverage = (ranking) => {
  if (!ranking.length) return 0;
  const sum = ranking.reduce((acc, u) => acc + u.avgConsumption, 0);
  return Math.round(sum / ranking.length);
};
