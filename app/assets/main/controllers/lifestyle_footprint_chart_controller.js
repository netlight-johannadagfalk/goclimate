import { Controller } from 'stimulus';
import { Chart } from 'chart.js';
import ChartAnnotation from 'chartjs-plugin-annotation';
import ChartDatalabels from 'chartjs-plugin-datalabels';

const SOLID_BARS_STYLING = {
  backgroundColor: [
    '#BBD3BD',
    'transparent',
    '#CEDFCF'
  ],
  borderColor: [
    '#BBD3BD',
    '#BBD3BD',
    '#CEDFCF'
  ],
  borderWidth: 2
};

const OFFSET_BAR_STYLING = {
  backgroundColor: [
    'transparent',
    'transparent',
    'transparent'
  ],
  borderColor: [
    'transparent',
    '#BBD3BD',
    'transparent'
  ],
  borderWidth: 1,
  datalabels: {
    display: false
  }
};

function targetAnnotation(target, label) {
  return {
    annotation: { // should be under plugins key, but doesn't work
      annotations: [
        {
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: target,
          borderColor: 'rgb(100, 100, 100)',
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            backgroundColor: 'transparent',
            fontColor: '#000000',
            fontStyle: 'normal',
            content: label,
            enabled: true,
            position: 'right',
            xAdjust: -0,
            yAdjust: 10
          }
        },
        {
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: target,
          borderColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            backgroundColor: 'transparent',
            fontColor: '#000000',
            content: [target],
            enabled: true,
            position: 'right',
            xAdjust: -0,
            yAdjust: -10
          }
        }
      ]
    }
  };
}

function scales(max) {
  return {
    scales: {
      yAxes: [{
        display: false,
        gridLines: {
          display: false
        },
        ticks: {
          display: false,
          beginAtZero: true,
          max
        }
      }],
      xAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          drawTicks: false,
          drawOnChartArea: false,
          color: '#222222'
        },
        ticks: {
          beginAtZero: true,
          padding: 5
        }
      }]
    }
  };
}

export default class LifestyleFootprintChartController extends Controller {
  initialize() {
    this.chart = new Chart(this.element, this.chartConfig());
  }

  chartConfig() {
    return {
      type: 'bar',
      data: {
        labels: [
          this.data.get('userLabel'),
          this.data.get('offsetLabel'),
          this.data.get('countryLabel'),
          ''
        ],
        datasets: [
          {
            data: [
              this.data.get('userFootprint'),
              0,
              this.data.get('countryAverage'),
              null
            ],
            ...SOLID_BARS_STYLING
          },
          {
            data: [null, this.data.get('userFootprint'), null],
            ...OFFSET_BAR_STYLING
          }
        ]
      },
      plugins: [ChartAnnotation, ChartDatalabels],
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 2,
            font: {
              weight: 'bold'
            }
          }
        },
        ...scales(
          Math.max(
            this.data.get('userFootprint'),
            this.data.get('countryAverage')
          ) + 1
        ),
        ...targetAnnotation('2.5', this.data.get('targetLabel'))
      }
    };
  }
}
