const getChartData = (footprint, categoryChartText) => {
  return [
    {
      text: categoryChartText.dashboard.footprint.category['housing'],
      co2e: footprint['housing'].co2e,
      icon: 'fa-home',
      color: 'bg-green-accent',
    },
    {
      text: categoryChartText.dashboard.footprint.category['food'],
      co2e: footprint['food'].co2e,
      icon: 'fa-utensils',
      color: 'bg-yellow-accent',
    },
    {
      text: categoryChartText.dashboard.footprint.category['shopping'],
      co2e: footprint['consumption'].co2e,
      icon: 'fa-shopping-bag',
      color: 'bg-pink-accent',
    },
    {
      text: categoryChartText.dashboard.footprint.category['car'],
      co2e: footprint['car'].co2e,
      icon: 'fa-car',
      color: 'bg-orange-accent',
    },
    {
      text: categoryChartText.dashboard.footprint.category['flights'],
      co2e: footprint['flights'].co2e,
      icon: 'fa-plane',
      color: 'bg-blue-accent',
    },
    {
      text: categoryChartText.dashboard.footprint.category['public'],
      co2e: footprint['public'].co2e,
      icon: 'fa-university',
      color: 'bg-gray-accent',
    },
  ];
};

const calculatePrice = (
  basePrice,
  currency,
  simplifiedCalculation,
  selectedMembership = '',
  multipleOffsets = 1
) => {
  var price = basePrice.subunit_amount / 100;
  if (Math.trunc(price) != price) {
    price = price.toFixed(2);
  }
  if (!simplifiedCalculation && selectedMembership === 'multi') {
    price = price * multipleOffsets;
  }
  if (currency === 'DEFAULT') {
    price = basePrice.currency.iso_code.toUpperCase() + ' ' + price;
  } else {
    const findCustomPlacement = /%{.*?}/i;
    price = currency.replace(findCustomPlacement, price);
  }
  return price;
};

export { getChartData, calculatePrice };
