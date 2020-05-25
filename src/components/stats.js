import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDurationFormatted} from "../utils/common";
import {PointTypesEmojiMapping} from "../const";


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


const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, money) => {
  const pointType = [...Object.keys(money)].map((kind) => kind.toUpperCase());
  const pointTypeMoney = [...Object.values(money)];

  const barsCount = pointType.length;
  moneyCtx.height = BAR_HEIGHT * barsCount;
  moneyCtx.style.backgroundColor = `rgba(236,235,235,1)`;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointType,
      datasets: [{
        data: pointTypeMoney,
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
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
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
      },
      layout: {
        padding: {
          left: 30,
          right: 30,
          top: 30,
          bottom: 30
        }
      }
    }
  });
};

const renderTransportChart = (transportCtx, transportKinds) => {

  const transportKindName = [...Object.keys(transportKinds)].map((kind) => kind.toUpperCase());
  const transportKindNumber = [...Object.values(transportKinds)];

  const barsCount = transportKindName.length;
  transportCtx.height = BAR_HEIGHT * barsCount;
  transportCtx.style.backgroundColor = `rgba(236,235,235,1)`;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: transportKindName,
      datasets: [{
        data: transportKindNumber,
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
      },
      layout: {
        padding: {
          left: 30,
          right: 30,
          top: 30,
          bottom: 30
        }
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, timeSpend) => {

  const pointType = [...Object.keys(timeSpend)].map((kind) => kind.toUpperCase());
  const pointTypeTimeSpend = [...Object.values(timeSpend)];

  const barsCount = pointType.length;
  timeSpendCtx.height = BAR_HEIGHT * barsCount;
  timeSpendCtx.style.backgroundColor = `rgba(236,235,235,1)`;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointType,
      datasets: [{
        data: pointTypeTimeSpend,
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
          formatter: (val) => `${getDurationFormatted(0, val)}`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
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
      },
      layout: {
        padding: {
          left: 30,
          right: 30,
          top: 30,
          bottom: 30
        }
      }
    }
  });
};

const getTransport = (points) => {
  return points.reduce((transport, point) => {
    const transportKind = PointTypesEmojiMapping[point.pointType.name];
    if (point.pointType.group === `Transfer`) {
      if (transport[transportKind]) {
        transport[transportKind] += 1;
      } else {
        transport[transportKind] = 1;
      }
    }
    return transport;
  }, {});
};

const getMoneyByPointTypes = (points) => {
  return points.reduce((money, point) => {
    const pointType = PointTypesEmojiMapping[point.pointType.name];
    if (money[pointType]) {
      money[pointType] += point.price;
    } else {
      money[pointType] = point.price;
    }
    return money;
  }, {});
};

const getTimeSpendByTypes = (points) => {
  return points.reduce((time, point) => {
    const pointType = PointTypesEmojiMapping[point.pointType.name];
    const timeSpend = point.dateEnd - point.dateStart;
    if (time[pointType]) {
      time[pointType] += timeSpend;
    } else {
      time[pointType] = timeSpend;
    }
    return time;
  }, {});
};

export default class Stats extends AbstractSmartComponent {
  constructor({points}) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const allPoints = this._points.getPoints();

    const money = getMoneyByPointTypes(allPoints);
    const transport = getTransport(allPoints);
    const timeSpend = getTimeSpendByTypes(allPoints);

    this._resetCharts();


    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._moneyChart = renderMoneyChart(moneyCtx, money);
    this._transportChart = renderTransportChart(transportCtx, transport);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, timeSpend);
  }

  destroyChart(chart) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }

  _resetCharts() {
    this.destroyChart(this._moneyChart);
    this.destroyChart(this._transportChart);
    this.destroyChart(this._timeSpendChart);
  }
}


