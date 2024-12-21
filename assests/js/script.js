// trending coins
const coinContainerMain = document.querySelector(".coin-container");
const btnCoinRight = document.querySelector("#coin-right");
const btnCoinLeft = document.querySelector("#coin-left");
const coinItem = document.querySelector(".coin-item");
const coinContLen = Number.parseInt(
  window.getComputedStyle(coinContainerMain).width
); //visible length of container
const coinContActualLen = [...coinContainerMain.children].reduce(
  (total, ele, indx, arr) => total + ele.getBoundingClientRect().width,
  0
); //visble lenght + hidden length
const coinLen = Number.parseInt(window.getComputedStyle(coinItem).width); //each item length;
const scrollWidth = function () {
  const visbleCoinCount = Number.parseInt(coinContLen / coinLen); // numbers of coins are visible on screen out of all;
  const nonVisibleCoinSize = coinContLen - visbleCoinCount * 265; //coin is present but not represented fully, how much is present its size
  const scrollWidth = visbleCoinCount * coinLen + 20;
  return scrollWidth;
};

//right btn
btnCoinRight.addEventListener("click", () => {
  btnCoinLeft.style.display = "flex";
  if (coinContainerMain.scrollLeft <= coinContLen) {
    coinContainerMain.scrollBy({
      left: scrollWidth(), // Scroll by the width of a full set of visible cards
      behavior: "smooth",
    });
  } else {
    btnCoinRight.style.display = "none";
  }
});

//left btn
btnCoinLeft.addEventListener("click", () => {
  btnCoinRight.style.display = "flex";
  if (coinContainerMain.scrollLeft > 0) {
    coinContainerMain.scrollBy({
      left: -scrollWidth(), // Scroll by the width of a full set of visible cards
      behavior: "smooth",
    });
  } else {
    btnCoinLeft.style.display = "none";
  }
});

// Trending NTF's
const ntfsContainerMain = document.querySelector(".ntfs-container");
const btnntfsRight = document.querySelector("#ntfs-right");
const btnntfsLeft = document.querySelector("#ntfs-left");
const ntfsItem = document.querySelector(".coin-item");
const ntfsContLen = Number.parseInt(
  window.getComputedStyle(ntfsContainerMain).width
); //visible length of container
const ntfsContActualLen = [...ntfsContainerMain.children].reduce(
  (total, ele, indx, arr) => total + ele.getBoundingClientRect().width,
  0
); //visble lenght + hidden length
const ntfsLen = Number.parseInt(window.getComputedStyle(ntfsItem).width); //each item length;
const scrollWidthNtfs = function () {
  const visbleNtfsCount = Number.parseInt(ntfsContLen / ntfsLen); // numbers of coins are visible on screen out of all;
  const nonVisibleCoinSize = ntfsContLen - visbleNtfsCount * 265; //coin is present but not represented fully, how much is present its size
  const scrollWidth = visbleNtfsCount * coinLen + 20;
  return scrollWidth;
};

//right btn
btnntfsRight.addEventListener("click", () => {
  btnntfsLeft.style.display = "flex";
  if (ntfsContainerMain.scrollLeft <= ntfsContLen) {
    ntfsContainerMain.scrollBy({
      left: scrollWidthNtfs(), // Scroll by the width of a full set of visible cards
      behavior: "smooth",
    });
  } else {
    btnntfsRight.style.display = "none";
  }
});
//left btn
btnntfsLeft.addEventListener("click", () => {
  btnntfsRight.style.display = "flex";
  if (ntfsContainerMain.scrollLeft > 0) {
    ntfsContainerMain.scrollBy({
      left: -scrollWidth(), // Scroll by the width of a full set of visible cards
      behavior: "smooth",
    });
  } else {
    btnntfsLeft.style.display = "none";
  }
});

//tabs
const tabsDataLoaded = {
  assests: false,
  exchanges: false,
  categories: false,
  holders: false,
};

const tabsBtncont = document.querySelector(".tabs"); // container of tab buttons
const tabsBtn = [...document.querySelectorAll(".tab-button")]; // tabs button array
const tabsContent = [...document.querySelectorAll(".tabs-content")]; //content of all tabs

tabsBtncont.addEventListener("click", function (e) {
  const ele = e.target.closest(".tab-button");
  if (!ele) return;

  //removing active tab
  tabsBtn.forEach((ele, index, arr) => ele.classList.remove("active"));
  tabsContent.forEach((ele, index, arr) => ele.classList.add("hide"));
  //activating tab
  ele.classList.add("active");
  const activeTabName = ele.dataset.tab;
  const activeTab = tabsContent.find(
    (ele, index, arr) => ele.id === activeTabName
  );
  activeTab.classList.remove("hide");
  if (!tabsDataLoaded[activeTabName]) {
    switch (activeTabName) {
      case "assests":
        fetchAndDisplayTabs(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true",
          ["assests-loader"],
          displayAssests,
          "assests",
          "crypto_data"
        );
        break;
      case "exchanges":
        fetchAndDisplayTabs(
          "https://api.coingecko.com/api/v3/exchanges",
          ["exchanges-loader"],
          displayExchanges,
          "exchanges",
          "exchanges_data"
        );
        break;
      case "categories":
        fetchAndDisplayTabs(
          "https://api.coingecko.com/api/v3/coins/categories",
          ["categories-loader"],
          displayCategories,
          "categories",
          "categories_data"
        );
        break;
      case "holders":
        fetchAndDisplayTabs(
          "https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin",
          ["holders-loader"],
          displayHolder,
          "holders",
          "holders_data"
        );
        break;

      default:
        break;
    }
  }
});
// function to create table layout
const createTable = function (headers) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const item of headers) {
    const th = `<th>${item}</th>`;
    headerRow.insertAdjacentHTML("beforeend", th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);
  return table;
};

// to fetch data from url and store it to local storage and display the data using respective display function
const fetchAndDisplayTrend = async function (
  url,
  idsToToggle,
  displayFunc,
  localKey
) {
  //turnning on loader
  idsToToggle.forEach((ele) => {
    const loader = document.querySelector(`#${ele}`);
    if (loader.classList.contains("hide")) loader.classList.remove("hide");
  });

  //checking data availabel in local storage or not
  const key = localKey;
  const data = JSON.parse(localStorage.getItem(key));

  if (data) {
    //turnning of loader
    idsToToggle.forEach((ele) => {
      const loader = document.querySelector(`#${ele}`);
      loader.classList.add("hide");
    });
    displayFunc(data);
  } else {
    try {
      const response = await fetch(url);
      const data = await response.json();

      //turnning of loader
      idsToToggle.forEach((ele) => {
        const loader = document.querySelector(`#${ele}`);
        loader.classList.add("hide");
      });

      displayFunc(data);
      //setting this data to local storage
      localStorage.setItem(localKey, JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  }
};
const fetchAndDisplayTabs = async function (
  url,
  idsToToggle,
  displayFunc,
  tabName,
  localKey
) {
  //turnning on loader
  idsToToggle.forEach((ele) => {
    const loader = document.querySelector(`#${ele}`);
    loader.classList.remove("hide");
  });

  //checking data availabel in local storage or not
  const key = localKey;
  const data = JSON.parse(localStorage.getItem(key));

  if (data) {
    //turnning off loader
    idsToToggle.forEach((ele) => {
      const loader = document.querySelector(`#${ele}`);
      loader.classList.add("hide");
    });

    displayFunc(data);

    if (tabName) {
      tabsDataLoaded[tabName] = true;
    }
  } else {
    try {
      const response = await fetch(url);
      const data = await response.json();
      //turnning off loader
      idsToToggle.forEach((ele) => {
        const loader = document.querySelector(`#${ele}`);
        loader.classList.add("hide");
      });
      displayFunc(data);
      tabsDataLoaded[tabName] = true;
      localStorage.setItem(localKey, JSON.stringify(data));
    } catch (e) {}
  }
};

//to display all trends
const displayTrends = function (data) {
  displayTrendCoin(data.coins);
  displayTrendNfts(data.nfts);
};
// to display trending coin
const displayTrendCoin = function (coins) {
  const container = document.querySelector(".coin-container");
  container.innerHTML = "";
  coins.forEach(function (ele, indx, arr) {
    const { item: mainItem } = ele;
    const item = `
              <div class="coin-item" data.coinId="${mainItem.id}">
                <div class="coin-image">
                  <img src="${mainItem.thumb}" alt="" />
                </div>
                <div class="title">
                  <span class="title-name">${mainItem.name}</span>
                  <span class="title-chain">${mainItem.symbol} Chain</span>
                </div>
                <div class="valueAndChange">
                  <span class="price-count">${Number.parseFloat(
                    mainItem.price_btc
                  ).toFixed(6)} <span>usd</span></span>
                  <span class="volume ${
                    mainItem.data.price_change_percentage_24h.usd >= 0
                      ? "green"
                      : "red"
                  }">${mainItem.data.price_change_percentage_24h.usd.toFixed(
      2
    )}%</span>
                </div>
              </div>
              `;
    container.insertAdjacentHTML("beforeend", item);
  });
};

document
  .querySelector(".coin-container")
  .addEventListener("click", function (e) {
    const ele = e.target;
    if (!ele.classList.contains("coin-item")) return;
    window.location.href = `../../pages/coin.html?coin=${ele.dataset.coinId}`;
  });

// to displaay trending nfts
const displayTrendNfts = function (nfts) {
  const container = document.querySelector(".ntfs-container");
  container.innerHTML = "";

  nfts.forEach((ele, ind, arr) => {
    const item = `<div class="ntfs-item" data.nftsId="${ele.id}">
                <div class="ntfs-image">
                  <img src="${ele.thumb}" alt="" />
                </div>
                <div class="title">
                  <span class="title-name">${ele.name}</span>
                  <span class="title-chain">${ele.symbol} Chain</span>
                </div>
                <div class="valueAndChange">
                  <span class="price-count">${
                    ele.data.floor_price
                  } <span>usd</span></span>
                  <span class="volume ${
                    Number.parseFloat(
                      ele.data.floor_price_in_usd_24h_percentage_change
                    ) >= 0
                      ? "green"
                      : "red"
                  }">${Number.parseFloat(
      ele.data.floor_price_in_usd_24h_percentage_change
    )}%</span>
                </div>
              </div>`;

    container.insertAdjacentHTML("beforeend", item);
  });
};

//tabs component - assests
const displayAssests = function (data) {
  const tableContainer = document.querySelector(".assets-list");
  tableContainer.innerHTML = "";
  const table = createTable(
    [
      "Rank",
      "Coin",
      "Price",
      "24h Price",
      "24h Price %",
      "Total Vol",
      "Market Cap",
      "Last 7 Days",
    ],
    1
  );

  //array storing data of sparkline of each assets
  let sparklineData = [];
  //creating a row for each assests
  data.forEach((ele, indx, arr) => {
    const row = document.createElement("tr");
    row.classList.add("assests-row");
    row.id = row.innerHTML = `
                <td class="rank">${ele.market_cap_rank}</td>
                <td class="name-column table-fixed-column">
                  <img
                    src="${ele.image}"
                    alt="${ele.name}"
                  />${ele.name} <span>(${ele.symbol.toUpperCase()})</span>
                </td>
                <td>$${ele.current_price}</td>
                <td class="${
                  ele.price_change_24h >= 0 ? "green" : "red"
                }">$-${ele.price_change_24h.toFixed(2)}</td>
                <td class="${
                  ele.price_change_percentage_24h >= 0 ? "green" : "red"
                }">$${ele.price_change_percentage_24h.toFixed(2)}</td>
                <td>$${ele.total_volume}</td>
                <td>$${ele.market_cap}</td>
                <td><canvas id="chart-${
                  ele.id
                }" width="100" height="50" "></canvas></td>
              `;
    table.appendChild(row);
    sparklineData.push({
      id: ele.id,
      sparkline: ele.sparkline_in_7d.price,
      color:
        ele.sparkline_in_7d.price[0] <=
        ele.sparkline_in_7d.price[ele.sparkline_in_7d.price.length - 1]
          ? "green"
          : "red",
    });
  });
  //inserting final table in its container
  tableContainer.appendChild(table);
  /*
  //making graph of each sparkline and inserting it
  sparklineData.forEach(function ({ id, sparkline, color }, indx, arr) {
    const ctx = document.querySelector(`#chart-${id}`).getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: sparkline.map((_, ind) => ind),
        datasets: [
          {
            data: sparkline,
            borderColor: color,
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
          plugins: {
            legend: false,
          },
          toolTip: {
            enabled: false,
          },
        },
      },
    });
  });*/
};

//tabs component - exchanges
const displayExchanges = function (data) {
  const tableContainer = document.querySelector(".exchanges-list");
  tableContainer.innerHTML = "";
  const table = createTable([
    "Rank",
    "Exchanges",
    "Trust Score",
    "24h Trade",
    "24h Trade(normal)",
    "Country",
    "Website",
    "Year",
  ]);
  const mainData = Array.from(data);
  mainData.forEach(function (ele, ind, arr) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                <td class="rank">${ele.trust_score_rank}</td>
                <td class="name-column table-fixed-column">
                  <img
                    src="${ele.image}"
                    alt=""
                  />${ele.name}
                </td>
                <td>${ele.trust_score}</td>
                <td>$${ele.trade_volume_24h_btc.toFixed(2)} BTC</td>
                <td>$${ele.trade_volume_24h_btc_normalized.toFixed(2)} BTC</td>
                <td class="name-column">${ele.country}</td>
                <td class="name-column">${ele.url}</td>
                <td>${ele.year_established}</td>
              `;
    //NoModificationAllowedError: Failed to execute 'insertAdjacentHTML' on 'Element': The element has no parent
    //why I got this type of error, reason beacsuse i was trying to insert html in table which is not yet append on dom this method works on pure node or elements created in javascript
    //if we create element in javascript and then try to insert html in it, it will give an error
    table.appendChild(tr);
  });
  tableContainer.appendChild(table);
};
//tabs component - categories
const displayCategories = function (data) {
  const tableContainer = document.querySelector(".categories-list");
  tableContainer.innerHTML = "";
  const table = createTable([
    "Top Coins",
    "Category",
    "Market Cap",
    "24h Market Cap",
    "24h Volume",
  ]);
  const mainData = data.slice(0, 99);
  mainData.forEach(function (category, ind, arr) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${category.top_3_coins
              .map((coin) => `<img src="${coin}" alt="coin">`)
              .join("")}</td>
            <td class="name-column table-fixed-column">${category.name}</td>
            <td>$${
              category.market_cap
                ? category.market_cap.toLocaleString(undefined, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })
                : "N/A"
            }</td>
            <td class="${
              category.market_cap_change_24h >= 0 ? "green" : "red"
            }">${
      category.market_cap_change_24h
        ? category.market_cap_change_24h.toFixed(3)
        : "0"
    }%</td>
            <td>$${
              category.volume_24h
                ? category.volume_24h.toLocaleString(undefined, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })
                : "N/A"
            }</td>
        `;
    table.appendChild(tr);
  });
  tableContainer.appendChild(table);
};
//tabs component - holders
const displayHolder = function (data) {
  const tableContainer = document.querySelector(".holders-list");
  tableContainer.innerHTML = "";
  const table = createTable([
    "Company",
    "Total Btc",
    "Entry Value",
    "Total Current Value",
    "Total %",
  ]);
  const mainData = data.companies;
  mainData.forEach(function (ele, ind, arr) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="name-column tabel-fixed-column">
                  ${ele.name}
                </td>
                <td>${ele.total_holdings}</td>
                <td>${ele.total_entry_value_usd}</td>
                <td>${ele.total_current_value_usd}</td>
                <td class="${
                  ele.percentage_of_total_supply >= 0 ? "green" : "red"
                }">${ele.percentage_of_total_supply}%</td>`;
    table.appendChild(tr);
  });
  tableContainer.appendChild(table);
};

// intializing display data
const init = function () {
  Promise.all([
    fetchAndDisplayTrend(
      "https://api.coingecko.com/api/v3/search/trending",
      ["coin-loader", "ntfs-loader"],
      displayTrends,
      "trending_data"
    ),
    fetchAndDisplayTabs(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true",
      ["assests-loader"],
      displayAssests,
      "assests",
      "crypto_data"
    ),
  ]);
};

init();
