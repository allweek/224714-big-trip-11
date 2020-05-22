import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import flatpickr from "flatpickr";

const createStatTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
    
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
    
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
    
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};


// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
// moneyCtx.height = BAR_HEIGHT * 6;
//
// timeSpendCtx.height = BAR_HEIGHT * 4;

// const moneyChart = new Chart(moneyCtx, {
//   plugins: [ChartDataLabels],
//   type: `horizontalBar`,
//   data: {
//     labels: [`FLY`, `STAY`, `DRIVE`, `LOOK`, `RIDE`],
//     datasets: [{
//       data: [400, 300, 200, 160, 100],
//       backgroundColor: `#ffffff`,
//       hoverBackgroundColor: `#ffffff`,
//       anchor: `start`
//     }]
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 13
//         },
//         color: `#000000`,
//         anchor: `end`,
//         align: `start`,
//         formatter: (val) => `€ ${val}`
//       }
//     },
//     title: {
//       display: true,
//       text: `MONEY`,
//       fontColor: `#000000`,
//       fontSize: 23,
//       position: `left`
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: `#000000`,
//           padding: 5,
//           fontSize: 13,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         barThickness: 44,
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         minBarLength: 50
//       }],
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: false,
//     }
//   }
// });

const renderTransportChart = (transportCtx) => {
  transportCtx.height = BAR_HEIGHT * 4;
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`FLY`, `DRIVE`, `RIDE`],
      datasets: [{
        data: [4, 2, 1],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const getTransport = () => {

};

export default class Stat extends AbstractSmartComponent {
  constructor({events}) {
    super();

    this._events = events;

    this._transportChart = null;

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const transport = getTransport();
    console.log(this._events);
    // this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));
    //
    // const daysCtx = element.querySelector(`.statistic__days`);
    // const colorsCtx = element.querySelector(`.statistic__colors`);

    // this._resetCharts();


    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    renderTransportChart(transportCtx);
    // this._transportChart = renderTransportChart();
    // this._colorsChart = renderColorsChart(colorsCtx, this._tasks.getTasks());
  }


  getTemplate() {
    return createStatTemplate();
  }
}


