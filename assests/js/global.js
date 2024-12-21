// html elements
const coinCount = document.getElementById("count-coins");
const exchangeCount = document.getElementById("count-exchange");
const marketCap = document.getElementById("marketCap");
const marketCapChangeElement = document.getElementById("marketCapChange");
const volume = document.getElementById("volume");
const dominance = document.getElementById("dominance");
//getting data from local storage, if ? data is older then 5 minute then return null
const getLocalData = function (key) {
  const data = localStorage.getItem(key);
  if (!data) return null;

  const dataParsed = JSON.parse(data);
  const currentDate = Date.now();

  //if data is older then 5 min
  if (currentDate - dataParsed.timestamp > 300000) {
    localStorage.removeItem(key);
    return null;
  }
  return dataParsed.data;
};

// setting fetch data in  local storage
const setLocalData = function (key, data) {
  const mainData = {
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(key, JSON.stringify(mainData));
};

//displaying global data
const displayGlobalData = function (data) {
  // console.log("data : ", data);
  coinCount.textContent = data.active_cryptocurrencies || "N/A";
  exchangeCount.textContent = data.markets;
  marketCap.textContent = data.total_market_cap?.usd
    ? `$${(data.total_market_cap.usd / 1e12).toFixed(3)}T`
    : "N/A";

  const marketCapChange = data.market_cap_change_percentage_24h_usd;

  if (marketCapChange !== undefined) {
    const changeText = `${marketCapChange.toFixed(1)}%`;
    marketCapChangeElement.innerHTML = `${changeText} <i class="${
      marketCapChange < 0 ? "red" : "green"
    } ri-arrow-${marketCapChange < 0 ? "down" : "up"}-s-fill"></i>`;
    marketCapChangeElement.style.color = marketCapChange < 0 ? "red" : "green";
  } else {
    marketCapChangeElement.textContent = "N/A";
  }

  volume.textContent = data.total_volume?.usd
    ? `$${(data.total_volume.usd / 1e9).toFixed(3)}B`
    : "N/A";

  const btcDominance = data.market_cap_percentage?.btc
    ? `${data.market_cap_percentage.btc.toFixed(1)}%`
    : "N/A";
  const ethDominance = data.market_cap_percentage?.eth
    ? `${data.market_cap_percentage.eth.toFixed(1)}%`
    : "N/A";
  dominance.textContent = `BTC ${btcDominance} - ETH ${ethDominance}`;
};

// fetching data for global div
const fetchGlobalData = function () {
  const localStorageKey = "GLOBAL_KEY";
  const localData = getLocalData(localStorageKey);

  if (localData) {
    displayGlobalData(localData);
  } else {
    const options = { method: "GET", headers: { accept: "application/json" } };
    fetch("https://api.coingecko.com/api/v3/global", options)
      .then((res) => res.json())
      .then((res) => {
        setLocalData(localStorageKey, res.data);
        displayGlobalData(res.data);
      })
      .catch((err) => {
        coinCount.textContent = "N/A";
        exchangeCount.textContent = "N/A";
        marketCap.textContent = "N/A";
        marketCapChange.textContent = "N/A";
        volume.textContent = "N/A";
        dominance.textContent = "N/A";
        console.error(err);
      });
  }
};

fetchGlobalData();
