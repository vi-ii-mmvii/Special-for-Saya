<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Drinks Grid</title>
  <style>
    #list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 20px;
    }

    .item {
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .item:hover {
      transform: scale(1.03);
    }

    #categories, #pagination {
      padding: 10px 20px;
    }

    .category-btn, .page-btn, #random {
      margin: 5px;
      padding: 8px 12px;
      border: none;
      background-color: #007BFF;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .category-btn:hover, .page-btn:hover, #random:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

  <input type="text" id="search" placeholder="Search for a drink..." />
  <button id="random">Random Drink</button>

  <div id="categories"></div>
  <div id="list"></div>
  <div id="pagination"></div>

  <script>
    let allDrinks = [];
    let currentDrinks = [];
    let currentPage = 1;
    const drinksPerPage = 6;

    // Загрузка напитков (без рецептов)
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
      .then(response => response.json())
      .then(data => {
        allDrinks = data.drinks || [];
        currentDrinks = allDrinks;
        drinks();
        categoriestype();
        pagination();
      })
      .catch(error => console.error(error));

    function drinks() {
      const drinksList = document.getElementById('list');
      const start = (currentPage - 1) * drinksPerPage;
      const end = start + drinksPerPage;
      const drinksToShow = currentDrinks.slice(start, end);

      drinksList.innerHTML = drinksToShow.map(drink => `
        <article class="item" data-id="${drink.idDrink}">
          <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="height: 150px;">
          <h4>${drink.strDrink}</h4>
        </article>
      `).join('');

      document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
          const drinkId = item.getAttribute('data-id');
          fetchDrinkDetails(drinkId);
        });
      });
    }

    function fetchDrinkDetails(id) {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
          const drink = data.drinks[0];
          displayDrinkDetails(drink);
        })
        .catch(error => console.error(error));
    }

    function displayDrinkDetails(drink) {
      const drinkList = document.getElementById('list');
      drinkList.innerHTML = `
        <article class="item">
          <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="height: 200px;">
          <h2>${drink.strDrink}</h2>
          <p>${drink.strInstructions || "No instructions available."}</p>
          <button id="backBtn">Back</button>
        </article>
      `;

      document.getElementById('backBtn').addEventListener('click', () => {
        drinks();
        pagination();
      });
    }

    function categoriestype() {
      const categoriesDiv = document.getElementById('categories');

      fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`)
        .then(response => response.json())
        .then(data => {
          const categories = data.drinks.map(obj => obj.strCategory);
          categories.unshift('All');

          categoriesDiv.innerHTML = categories.map(obj =>
            `<button class="category-btn" data-category="${obj}">${obj}</button>`
          ).join('');

          categoriesDiv.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', e => {
              filterByCategory(e.target.dataset.category);
            });
          });
        })
        .catch(error => console.error(error));
    }

    function filterByCategory(category) {
      if (category === 'All') {
        currentDrinks = allDrinks;
        currentPage = 1;
        drinks();
        pagination();
      } else {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
          .then(response => response.json())
          .then(data => {
            currentDrinks = data.drinks || [];
            currentPage = 1;
            drinks();
            pagination();
          })
          .catch(error => console.error(error));
      }
    }

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', e => {
      const value = e.target.value.toLowerCase();
      currentDrinks = allDrinks.filter(drink =>
        drink.strDrink.toLowerCase().includes(value)
      );
      currentPage = 1;
      drinks();
      pagination();
    });

    const randomBtn = document.getElementById('random');
    randomBtn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * allDrinks.length);
      const randomDrink = allDrinks[randomIndex];
      fetchDrinkDetails(randomDrink.idDrink);
    });

    function pagination() {
      const pagination = document.getElementById('pagination');
      const pages = Math.ceil(currentDrinks.length / drinksPerPage);

      pagination.innerHTML = '';
      for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = i;
        btn.dataset.page = i;
        btn.addEventListener('click', e => {
          currentPage = Number(e.target.dataset.page);
          drinks(); // fixed function call
        });
        pagination.appendChild(btn);
      }
    }
  </script>
</body>
</html>
