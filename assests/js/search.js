const assetsContanier = document.getElementById("assets-container");
const exchangesContanier = document.getElementById("exchanges-container");
const ntfsContanier = document.getElementById("ntfs-container");
const searchHeading = document.querySelector(".searchHeading");
const searchContainer = document.querySelector(".search-container");
const form = document.querySelector("#searchForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const query = document.querySelector("#formInput").value.trim();
  if (!query) return;

  window.location.href = `/Full-stack-crypto-indianMarket/pages/search.html?query=${query}`;
});
//adding event listner to specific page
document.addEventListener("DOMContentLoaded", function (e) {
  if (
    window.location.pathname !==
    "/Full-stack-crypto-indianMarket/pages/search.html"
  )
    return;
  initSearch();
});

const initSearch = function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  if (query) {
    fetchSearchResult(query);
  } else {
    searchContainer.innerHTML = `<p style="color:red; text-align:center; margin-bottom:8px;">Nothing to show</p>`;
    searchHeading.innerText = "Please search something...";
  }
};

const fetchSearchResult = function (params) {
  //add spinner in page and make it on
  assetsContanier.innerHTML = "";
  exchangesContanier.innerHTML = "";
  ntfsContanier.innerHTML = "";
  searchHeading.innerHTML = `Search result for ${params}`;

  //making fetch request
  const url = `https://api.coingecko.com/api/v3/search?query=${params}`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      //filttering arrays with from missing logo
      let coin = (data.coins || []).filter(
        (coin) => coin.thumb !== "missing_thumb.png"
      );
      let exchanges = (data.exchanges || []).filter(
        (ex) => ex.thumb !== "missing_thumb.png"
      );
      let ntfs = (data.nfts || []).filter(
        (nfts) => nfts.thumb !== "missing_thumb.png"
      );

      const coinCount = coin.length;
      const exchangeCount = exchanges.length;
      const ntfsCount = ntfs.length;

      const minCount = Math.min(coinCount, exchangeCount, ntfsCount);

      if (coinCount > 0 && exchangeCount > 0 && ntfsCount > 0) {
        coin = coin.slice(0, minCount - 1);
        exchanges = exchanges.slice(0, minCount - 1);
        ntfs = ntfs.slice(0, minCount - 1);
      }

      if (coinCount === 0) {
        assetsContanier.innerHTML = `<p style="color:red; text-align:center; margin-bottom:8px;">No Result Found For Coin</p>`;
      } else {
        coinsDisplayResult(coin);
      }
      if (exchangeCount === 0) {
        exchangesContanier.innerHTML = `<p style="color:red; text-align:center; margin-bottom:8px;">No Result Found For exchanges</p>`;
      } else {
        exchangesDisplayResult(exchanges);
      }
      if (ntfsCount === 0) {
        ntfsContanier.innerHTML = `<p style="color:red; text-align:center; margin-bottom:8px;">No Result Found For Ntfs</p>`;
      } else {
        ntfsDisplayResult(ntfs);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

// function to create table layout

const createTableForSearch = function (headers) {
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

// to display results assets
const coinsDisplayResult = function (coin) {
  console.log(coin.length);
  assetsContanier.innerHTML = "";
  const table = createTableForSearch(["Rank", "Coin"]);
  coin.forEach((ele, ind, arr) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${ele.market_cap_rank}</td>
            <td class="name-column"><img src="${ele.thumb}" alt="${
      ele.name
    }"> ${ele.name} <span>(${ele.symbol.toUpperCase()})</span></td>
        `;
    table.appendChild(row);
  });
  assetsContanier.appendChild(table);
};

// to display result exchanges
const exchangesDisplayResult = function (ex) {
  exchangesContanier.innerHTML = "";
  const table = createTableForSearch(["Exchanges", "Market"]);
  ex.forEach((ele, ind, arr) => {
    const row = document.createElement("tr");
    row.innerHTML = ` <td class="name-column"><img src="${ele.thumb}" alt="${ele.name}"> ${ele.name}</td>
            <td>${ele.market_type}</td>`;
    table.appendChild(row);
  });
  exchangesContanier.appendChild(table);
};

// to display results ntfs
const ntfsDisplayResult = function (ntfs) {
  ntfsContanier.innerHTML = "";
  const table = createTableForSearch(["NFT", "Symbol"]);
  ntfs.forEach((ele, ind, arr) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="name-column"><img src="${ele.thumb}" alt="${ele.name}"> ${ele.name}</td>
            <td class="name-column">${ele.symbol}</td>
        `;
    table.appendChild(row);
  });
  ntfsContanier.appendChild(table);
};
