let allDrinks = [];
let currentDrinks = [];
let currentPage = 1;
const drinksPerPage = 5;

// Загрузка напитков (без рецептов)
fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
  .then(response => response.json())
  .then(data => {
    allDrinks = data.drinks || [];
    currentDrinks = allDrinks;
    drinks(); //1
    categoriestype();
    pagination();
  })
  .catch(error => console.error(error));

//1
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

// Загрузка и отображение рецепта
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

// Загрузка и отображение категорий
//2

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

// Фильтрация по категории (загрузка заново)
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

// Поиск по названию
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

// Случайный напиток
const randomBtn = document.getElementById('random');
randomBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * allDrinks.length);
  const randomDrink = allDrinks[randomIndex];
  fetchDrinkDetails(randomDrink.idDrink);
});

// Пагинация
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
      displayDrinks();
    });
    pagination.appendChild(btn);
  }
}
