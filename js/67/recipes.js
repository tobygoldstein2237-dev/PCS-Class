"use strict";

const recipeSelect = document.querySelector("#recipeSelect");
const recipeDetails = document.querySelector("#recipeDetails");

let recipes = [];

async function loadRecipes() {
    try {
        const response = await fetch("data/recipes.json");
        recipes = await response.json();

        recipes.forEach(function (recipe) {
            const option = document.createElement("option");
            option.value = recipe.id;
            option.textContent = recipe.name;
            recipeSelect.append(option);
        });
    } catch (error) {
        recipeDetails.textContent = "Could not load recipes.";
        console.error(error);
    }
}

async function loadRecipe() {
    recipeDetails.replaceChildren();

    const selectedId = recipeSelect.value;

    if (selectedId === "") {
        return;
    }

    const recipe = recipes.find(function (recipe) {
        return recipe.id === Number(selectedId);
    });

    if (!recipe) {
        recipeDetails.textContent = "Recipe not found.";
        return;
    }

    try {
        const response = await fetch(recipe.url);
        const details = await response.json();

        const heading = document.createElement("h2");
        heading.textContent = details.name;

        const image = document.createElement("img");
        image.src = details.pictureUrl;
        image.alt = details.name;
        image.width = 300;

        const ingredientsHeading = document.createElement("h3");
        ingredientsHeading.textContent = "Ingredients";

        const ingredientsList = document.createElement("ul");

        details.ingredients.forEach(function (ingredient) {
            const item = document.createElement("li");
            item.textContent = ingredient;
            ingredientsList.append(item);
        });

        recipeDetails.append(
            heading,
            image,
            ingredientsHeading,
            ingredientsList
        );
    } catch (error) {
        recipeDetails.textContent = "Could not load this recipe.";
        console.error(error);
    }
}

recipeSelect.addEventListener("change", loadRecipe);

loadRecipes();