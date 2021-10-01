export const categoryName = (categories, itemID, isAchievement) => {
  for (let i = 0; i <= Object.keys(categories).length; i++) {
    if (categories[i].id === itemID) {
      return categories[i].name.toString();
    }
    if (isAchievement) return '';
  }
  return 'unknown';
};

export const getCategoryColor = (category_tag) => {
  if (category_tag == 'category_flights_active') {
    return 'bg-blue-accent';
  } else if (category_tag == 'category_unknown_active') {
    return 'bg-primary';
  } else if (category_tag == 'category_unknown') {
    return 'bg-transparent';
  } else if (category_tag == 'category_food_active') {
    return 'bg-yellow-accent';
  } else if (category_tag == 'category_public_emissions_active') {
    return 'bg-gray-accent';
  } else if (category_tag == 'category_car_active') {
    return 'bg-orange-accent';
  } else if (category_tag == 'category_shopping_active') {
    return 'bg-pink-accent';
  } else if (category_tag == 'category_housing_active') {
    return 'bg-green-accent';
  }
};
