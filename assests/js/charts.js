// to get theme of chart according to theme of web, dark or light
const getThemeConfig = function () {
  const root = getComputedStyle(document.documentElement);
  const isDarkTheme =
    localStorage.getItem("theme") === "light-theme" ? false : true;

  //deciding background color for chart
  const backgroundColor = root
    .getPropertyValue(isDarkTheme ? "--chart-dark-bg" : "--chart-light-bg")
    .trim();

  //deciding grid color for chart
  const gridColor = root.getPropertyValue(
    isDarkTheme ? "--chart-dark-border" : "--chart-light-border"
  );

  return {
    autosize: true,
    symbol: "NASDAQ:AAPL",
    interval: "D",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    backgroundColor: backgroundColor,
    gridColor: gridColor,
    allow_symbol_change: true,
    calendar: false,
    support_host: "https://www.tradingview.com",
  };
};

const createWidget = function (cont, config, WidgetSrc) {
  const container = document.querySelector(`#${cont}`);
  container.innerHTML = "";

  const widgetDiv = document.createElement("div");
  widgetDiv.classList.add("tradingview-widget-container__widget");
  container.appendChild(widgetDiv);

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = WidgetSrc;
  script.async = true;
  script.innerHTML = JSON.stringify(config);
  container.appendChild(script);
};

const initalize = function () {
  const widgetConfig = getThemeConfig();
  createWidget(
    "chart-widget",
    widgetConfig,
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
  );
};

initalize();
