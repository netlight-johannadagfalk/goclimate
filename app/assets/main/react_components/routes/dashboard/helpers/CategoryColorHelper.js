export const categoryName = (categories, itemID, isAchievement) => {
  for (let i = 0; i <= Object.keys(categories).length; i++) {
    if (categories[i].id === itemID) {
      return categories[i].name.toString();
    }
    if (isAchievement) return '';
  }
  return 'unknown';
};
