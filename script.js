GRAMS_IN_OUNCES = 28.3495;
API_KEY = 'KW1UeFwq1MdY2gFWN3NzXXaL7aB6UFIjIzqo6roF'
SEARCH_API_URL_1 = 'https://api.nal.usda.gov/ndb/search/?format=json&ds=Standard Reference&q=';
SEARCH_API_URL_2 = '&sort=r&max=10&offset=0&api_key=';
NUTRITION_API_URL_1 = 'https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=';
NUTRITION_API_URL_2 = '&nutrients=208&ndbno=';
OUTPUT_MESSAGE = ' of the substitute is needed to provide the same amount of calories';
ERROR_CALORIES_MESSAGE = 'sorry, that substitute is not possible';
OZ = 'oz';
G = 'g';

CALORIES_PER_GRAM = {
  food_to_be_substituted_input: 0,
  substitute_food_input: 0,
};

function nutritionApiUrlBuilder(ndbno) {
  return NUTRITION_API_URL_1 + API_KEY + NUTRITION_API_URL_2 + ndbno;
}

function searchApiUrlBuilder(searchInput) {
  return SEARCH_API_URL_1 + searchInput + SEARCH_API_URL_2 + API_KEY;
}

function nutritionApiRequestListener(e, inputId) {
  var responseJSON = JSON.parse(e.target.response);
  var calories = parseInt(responseJSON.report.foods[0].nutrients[0].value);
  var weight = parseInt(responseJSON.report.foods[0].weight);
  console.log('weight: ', weight, 'calories: ', calories);
  CALORIES_PER_GRAM[inputId] = calories / weight;
}

function searchApiRequestListener(e, inputId, listId) {
  var responseJSON = JSON.parse(e.target.response);
  var value = document.getElementById(inputId).value;
  var list = document.getElementById(listId);
  for (var i = 0; i < list.children.length; i++) {
    if(list.children[i].value === value){
      JSONGetRequest(nutritionApiUrlBuilder(String(list.children[i].id)),
        function(e) {
          nutritionApiRequestListener(e, inputId);
        }
      );
    }
  }
  if (typeof responseJSON.errors === 'undefined') {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    if (typeof responseJSON.list.item !== 'undefined'){
      for (var i in responseJSON.list.item) {
        var o = document.createElement("option");
        o.value = responseJSON.list.item[i].name;
        o.id = responseJSON.list.item[i].ndbno;
        list.append(o);
      }
    }
  }
}

function JSONGetRequest(url, requestListener) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.addEventListener("load", requestListener);
    request.open("GET", url);
    request.send();
}

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


document.getElementById('food_to_be_substituted_input').oninput = function () {
  JSONGetRequest(searchApiUrlBuilder(document.getElementById('food_to_be_substituted_input').value),
    function(e) {
      searchApiRequestListener(e, 'food_to_be_substituted_input', 'food_to_be_substituted_input_autocomplete_list');
    }
  );
};

document.getElementById('substitute_food_input').oninput = function () {
  JSONGetRequest(searchApiUrlBuilder(document.getElementById('substitute_food_input').value),
    function(e) {
      searchApiRequestListener(e, 'substitute_food_input', 'substitute_food_input_autocomplete_list');
    }
  );
};

document.getElementById('calculator_submit_button').onclick = calculate;
