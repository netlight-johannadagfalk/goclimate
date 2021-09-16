/**
 * Helper file containing the information needed to render the result bars for each category without bloating categorychart
 */
export default function getChartData(footprint, categoryChartText){
  return [
    {
      text: categoryChartText.dashboard.footprint.category["housing"],
      co2e: footprint["housing"].co2e,
      icon: "fa-home",
      color: "bg-green-accent"
    },
    {
      text: categoryChartText.dashboard.footprint.category["food"],
      co2e: footprint["food"].co2e,
      icon: "fa-utensils",
      color: "bg-yellow-accent"
    },
    {
      text: categoryChartText.dashboard.footprint.category["shopping"],
      co2e: footprint["consumption"].co2e,
      icon: "fa-shopping-bag",
      color: "bg-pink-accent"
    },
    {
      text: categoryChartText.dashboard.footprint.category["car"],
      co2e: footprint["car"].co2e,
      icon: "fa-car",
      color: "bg-orange-accent"
    },
    {
      text: categoryChartText.dashboard.footprint.category["flights"],
      co2e: footprint["flights"].co2e,
      icon: "fa-plane",
      color: "bg-blue-accent"
    },
    {
      text: categoryChartText.dashboard.footprint.category["public"],
      co2e: footprint["public"].co2e,
      icon: "fa-university",
      color: "bg-gray-accent"
    },
  ]
}
