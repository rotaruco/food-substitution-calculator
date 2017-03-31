GRAMS_IN_OUNCES = 28.3495;
OUTPUT_MESSAGE = ' of the substitute is needed to provide the same amount of calories';
ERROR_CALORIES_MESSAGE = 'sorry, that substitute is not possible';
OZ = 'oz';
G = 'g';

CALORIES_PER_GRAM = {
  food_to_be_substituted_input: 0,
  substitute_food_input: 0,
};

Papa.parse("file:///Users/dado/Projects/absolute_coaching_food_substitution_calculator/data.csv", {
	download: true,
	complete: function(results) {
		console.log(results);
	}
});

function calculate() {
  var amountToBeSubstituted = document.getElementById('amount_to_be_substituted_input').value;
  var unitsToBeSubstituted = document.getElementById('units_to_be_substituted_input').value;
  var calsPerGram1 = CALORIES_PER_GRAM['food_to_be_substituted_input'];
  var calsPerGram2 = CALORIES_PER_GRAM['substitute_food_input'];

  if (unitsToBeSubstituted === 'Ounces') {
    var foodInGrams1 = parseInt(amountToBeSubstituted) * GRAMS_IN_OUNCES;
    var calsToReplace = foodInGrams1 * calsPerGram1;
    var foodInGrams2 = calsToReplace / calsPerGram2;
    var foodInOunces2 = foodInGrams2 / GRAMS_IN_OUNCES;
    result = String(Math.round(foodInOunces2)) + OZ + OUTPUT_MESSAGE;
  } else {
    var foodInGrams1 = amountToBeSubstituted;
    var calsToReplace = foodInGrams1 * calsPerGram1;
    var foodInGrams2 = calsToReplace / calsPerGram2;
    result = String(Math.round(foodInGrams2)) + G + OUTPUT_MESSAGE;
  }
  if (!isFinite(foodInGrams2) || foodInGrams2 < 0 ) {
    result = ERROR_CALORIES_MESSAGE;
  }
  if (calsPerGram1 <= 0 || calsPerGram2 <= 0) {
    result = "one of the selected foods has zero calories.";
  }
  console.log('grams of first food: ', foodInGrams1);
  console.log('calories To Replace: ', calsToReplace)
  console.log('cal/g of first food: ', calsPerGram1)
  console.log('cal/g of second food: ', calsPerGram2)
  console.log('result: ', result);
  document.getElementById('substitute_food_weight_output').value = result;
}

document.getElementById('food_to_be_substituted_input_autocomplete_list')

document.getElementById('food_to_be_substituted_input').onkeydown = function () {
  console.log("YAY");
};

document.getElementById('substitute_food_input').onkeydown = function () {
  console.log("YAY");
};

document.getElementById('food_to_be_substituted_input').onselect = function () {
  console.log("NAY");
};

document.getElementById('calculator_submit_button').onclick = calculate;
