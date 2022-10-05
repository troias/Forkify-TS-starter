const recipeContainer = document.querySelector('.recipe');

type Recipes = {
  [x: string]: any;
  id: number;
  title: string;
  publisher: string;
  image_url: string;
};

interface SearchRecipesResponse {
  status: string;
  results: number;
  data: {
    map: (arg0: (recipe: Recipes) => void) => void;
    recipes: Recipes;
  };
}

const timeout = function (s: number) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const recipeApi = 'https://forkify-api.herokuapp.com/api/v2/recipes';
const exampleRecipe = '5ed6604591c37cdc054bc886';

const searchRecipesApi =
  'https://forkify-api.herokuapp.com/api/v2/recipes?search=';

const searchRecipes = async function (query: string) {
  const req = await fetch(`${searchRecipesApi}${query}`);
  const data = await req.json();
  console.log('searchRecipes', data);
  return data;
};

export const getSingleRecipe = async (id: string | number) => {
  const req = await fetch(`${recipeApi}/${id || exampleRecipe}`);
  const data = await req.json();

  if (!req.ok) throw new Error(`${data.message} (${req.status})`);

  const { recipe } = data.data;

  return recipe;
};

const searchFormBtn = document.querySelector(
  '.search__btn'
) as HTMLButtonElement;
const searchInput = document.querySelector(
  '.search__field'
) as HTMLInputElement;
const result = document.querySelector('.results') as HTMLDivElement;

searchFormBtn.addEventListener('click', async e => {
  e.preventDefault();
  // console.log('clicled');
  const query = searchInput.value;

  if (!query) return;

  searchInput.value = '';

  try {
    const data = await searchRecipes(query);

    if (!data) throw new Error('No recipes found for your query!');

    console.log(data);

    if (data && data.status === 'success') {
      const results = data;
      const addResultsToDom = (data: SearchRecipesResponse) => {
        const { recipes } = data.data;
        const html = recipes
          .map(
            (recipe: Recipes) => `
        <li class="preview">
          <a class="preview__link" href="#${recipe.id}">
            <figure class="preview__fig"">
              <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="preview__data">
              <h4 class="preview__name">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
            </div>
          </a>
        </li>
      `
          )
          .join('');
        result.insertAdjacentHTML('afterbegin', html);
      };

      if (results) addResultsToDom(results) && console.log('results', results);
    }
  } catch (err) {
    console.error(err);
  }
});

// Language: typescript

///////////////////////////////////////

// const recipeDetails = document.querySelector('.recipe__details');

// const recipeDetailsMarkup = `
// <div class="recipe__details">
// <div class="recipe__info">
//   <svg class="recipe__info-icon">
//     <use href="src/img/icons.svg#icon-clock"></use>
//   </svg>
//   <span class="recipe__info-data recipe__info-data--minutes">45</span>
//   <span class="recipe__info-text">minutes</span>
// </div>
// <div class="recipe__info">
//   <svg class="recipe__info-icon">
//     <use href="src/img/icons.svg#icon-users"></use>
//   </svg>
//   <span class="recipe__info-data recipe__info-data--people">4</span>
//   <span class="recipe__info-text">servings</span>

//   <div class="recipe__info-buttons">
//     <button class="btn--tiny btn--increase-servings">
//       <svg>
//         <use href="src/img/icons.svg#icon-minus-circle"></use>
//       </svg>
//     </button>
//     <button class="btn--tiny btn--increase-servings">
//       <svg>
//         <use href="src/img/icons.svg#icon-plus-circle"></use>
//       </svg>
//     </button>
//   </div>
// </div>

// <div class="recipe__user-generated">
//   <svg>
//     <use href="src/img/icons.svg#icon-user"></use>
//   </svg>
// </div>
// <button class="btn--round">
//   <svg class="">
//     <use href="src/img/icons.svg#icon-bookmark-fill"></use>
//   </svg>
// </button>
// </div>

// <div class="recipe__ingredients">
// <h2 class="heading--2">Recipe ingredients</h2>
// <ul class="recipe__ingredient-list">
//   <li class="recipe__ingredient">
//     <svg class="recipe__icon">
//       <use href="src/img/icons.svg#icon-check"></use>
//     </svg>
//     <div class="recipe__quantity">1000</div>
//     <div class="recipe__description">
//       <span class="recipe__unit">g</span>
//       pasta
//     </div>
//   </li>

//   <li class="recipe__ingredient">
//     <svg class="recipe__icon">
//       <use href="src/img/icons.svg#icon-check"></use>
//     </svg>
//     <div class="recipe__quantity">0.5</div>
//     <div class="recipe__description">
//       <span class="recipe__unit">cup</span>
//       ricotta cheese
//     </div>
//   </li>
// </ul>
// </div>

// <div class="recipe__directions">
// <h2 class="heading--2">How to cook it</h2>
// <p class="recipe__directions-text">
//   This recipe was carefully designed and tested by
//   <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
//   directions at their website.
// </p>
// <a
//   class="btn--small recipe__btn"
//   href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
//   target="_blank"
// >
//   <span>Directions</span>
//   <svg class="search__icon">
//     <use href="src/img/icons.svg#icon-arrow-right"></use>
//   </svg>
// </a>
// </div>
// `;

// recipeDetails.innerHTML = recipeDetailsMarkup;

// Language: typescript
