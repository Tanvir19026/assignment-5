const search = document.getElementById("search");
const submit = document.getElementById("submit");
const mealsElement = document.getElementById("meals");
const resultHeading = document.getElementsByClassName(
  "result-heading"
);

//single_mealEl is method of showing meal-information in website bottom part by click,,
const single_mealElement = document.getElementById(
  "single-meal"
);

//SearchMeal from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single Meal
  single_mealElement.innerHTML = "";

  //get search Term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`

      //access all meal by searching word

    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result For ${term} : </h2>`;
       // meal name display in hover when search key word matched...
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are No Search results for ${term}</h2>`;
        } else {
          mealsElement.innerHTML = data.meals
            .map(
              (meal) => `
                 <div class="meal">
                 
                 <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                  <div class="meal-info" data-mealID="${meal.idMeal}">  
                    <h3>${meal.strMeal}</h3>
                 </div>
                 </div>
                `
                
                // meal name display in hover way
            )
            .join("");
        }
      });
      

    //Clear Search Term
    search.value = "";
  } else {
    
  }
}

//Fetch Meal By Id

function getMealById(mealID) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  )
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}




// for meal-information in given bottom of the page in website...


//meal-info part
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${
          meal[`strMeasure${i}`]
        }`
      );
    }else{
        break;
    }
  }

  single_mealElement.innerHTML = `
  
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>
  `
}

//Event Listerner
submit.addEventListener("click", searchMeal);

mealsElement.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute(
      "data-mealid"
    );
    getMealById(mealID);
  }
});

