
type Recipes = {
  [x: string]: any
  id: number
  title: string
  publisher: string
  image_url: string
}

interface SearchRecipesResponse {
  status: string
  results: number
  data: {
    map: (arg0: (recipe: Recipes) => void) => void
    recipes: Recipes
  }
}
type Recipe = {
  [x: string]: any
  id: number
  title: string
  publisher: string
  image_url: string
  source_url: string
  cooking_time: number
  servings: number
  ingredients: string[]
}



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const domElements = {
  searchForm: document.querySelector('.search') as HTMLFormElement,
  searchInput: document.querySelector('.search__field') as HTMLInputElement,
  searchResultList: document.querySelector('.results__list') as HTMLUListElement,
  searchResult: document.querySelector('.results') as HTMLDivElement,
  searchResultPages: document.querySelector('.results__pages') as HTMLDivElement,
  recipe: document.querySelector('.recipe') as HTMLDivElement,
  shopping: document.querySelector('.shopping__list') as HTMLUListElement,
  likesMenu: document.querySelector('.likes__field') as HTMLDivElement,
  likesList: document.querySelector('.likes__list') as HTMLUListElement,
}

const spinner = ` 
 <div class="spinner">
<svg>
  <use href="src/img/icons.svg#icon-loader"></use>
</svg>
</div>`

const errorHtml =
  `
<div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>No recipes found for your query. Please try again!</p>
          </div>
          `

const recipeMarkup = (recipe: Recipe) => {
  return `

            <figure class="recipe__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img" />
              <h1 class="recipe__title">
                <span>${recipe.title}</span>
              </h1>
            </figure>


  
        <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
          <use href="src/img/icons.svg#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
          <use href="src/img/icons.svg#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="src/img/icons.svg#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="src/img/icons.svg#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
        <svg>
          <use href="src/img/icons.svg#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="src/img/icons.svg#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>
                
            <div class="recipe__ingredients">
              <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((ing) => {
    return `
                    <li class="recipe__item">
                      <svg class="recipe__icon">
                      <use href="src/img/icons.svg#icon-check"></use>
                      </svg>
                      <div class="recipe__count">${ing.quantity}</div>
                      <div class="recipe__ingredient">
                        <span class="recipe__unit">${ing.unit}</span>
                        ${ing.description}
                      </div>
                    </li>
                    `
  }).join('')}
              </ul>

              <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                  <use href="src/img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
              </button>
            </div>

            <div class="recipe__directions">
                  
              <h2 class="heading-2">How to cook it</h2>
              <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.publisher
    }</span>. Please check out directions at their website.
              </p>

              <a
                class="btn-small recipe__btn"
                href="${recipe.source_url}"
                target="_blank"
              >
                <span>Directions</span>
                <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
              </a>
            </div>
     
            `
}

const renderRecipe = (recipe: Recipe) => {
  const markup = recipeMarkup(recipe)

  domElements.recipe.innerHTML = ''
  domElements.recipe.insertAdjacentHTML("afterbegin", markup)
}

const renderSpinner = (parent: HTMLElement) => {
  parent.innerHTML = ''
  parent.insertAdjacentHTML('afterbegin', spinner)
}

const renderError = (parent: HTMLElement) => {
  parent.innerHTML = ''
  parent.insertAdjacentHTML('afterbegin', errorHtml)
}

const clearSpinner = (parent: HTMLElement) => {
  parent.innerHTML = ''
}

const clearError = (parent: HTMLElement) => {
  parent.innerHTML = ''
}

const clearRecipe = () => {
  domElements.recipe.innerHTML = ''
}

const clearSearchResults = () => {
  domElements.searchResult.innerHTML = ''
  domElements.searchResultPages.innerHTML = ''
}







const recipeApi = 'https://forkify-api.herokuapp.com/api/v2/recipes'
// const exampleRecipe = '5ed6604591c37cdc054bc886'

const searchRecipesApi =
  'https://forkify-api.herokuapp.com/api/v2/recipes?search='

const searchRecipes = async function (query: string) {
  const req = await fetch(`${searchRecipesApi}${query}`)



  const data = await req.json()
  console.log('searchRecipes', data)
  return data
}

export const getSingleRecipe = async (id: string | number) => {
  const req = await fetch(`${recipeApi}/${id}`)
  const data = await req.json()

  if (!req.ok) throw new Error(`${data.message} (${req.status})`)

  const { recipe } = data.data

  return recipe
}

const searchFormBtn = document.querySelector(
  '.search__btn'
) as HTMLButtonElement
const searchInput = document.querySelector(
  '.search__field'
) as HTMLInputElement
const result = document.querySelector('.results') as HTMLDivElement

const recipeContainer = document.querySelector('.recipe') as HTMLDivElement

searchFormBtn.addEventListener('click', async e => {
  e.preventDefault()
  // console.log('clicled');
  const query = searchInput.value

  if (!query) return

  searchInput.value = ''

  try {

    renderSpinner(result)
    const data = await searchRecipes(query)

    if (!data) {
      renderError(result)
      return
    }



    console.log(data)

    if (data && data.status === 'success') {
      clearSpinner(result)
      const results = data
      const addResultsToDom = (data: SearchRecipesResponse) => {
        const { recipes } = data.data
        const html = recipes
          .map(
            (recipe: Recipe) => `
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
          .join('')
        result.insertAdjacentHTML('afterbegin', html)
      }

      if (results) addResultsToDom(results)
    }
  } catch (err) {


    console.error(err)
  }
})


const showRecipeOnClick = async (e: Event) => {
  e.preventDefault()
  const target = e.target as HTMLElement
  // type RecipeId = 
  const recipeId = target.closest('.preview__link')?.getAttribute('href')

  const removeHashChar = recipeId?.slice(1) as string | number
  // console.log(typeof removeHashChar)
  if (removeHashChar) {
    const recipe = await getSingleRecipe(removeHashChar)
    console.log("recipe", recipe)
    renderRecipe(recipe)


















  }



}



result.addEventListener('click', showRecipeOnClick)


