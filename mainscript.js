GRAMS_IN_OUNCES = 28.3495;
OUTPUT_MESSAGE = ' of the substitute is needed to provide the same amount of calories';
ERROR_CALORIES_MESSAGE = 'sorry, that substitute is not possible';
OZ = 'oz';
G = 'g';
data = [];

CALORIES_PER_GRAM = {
  food_to_be_substituted_input: 0,
  substitute_food_input: 0,
};

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

function dataToDataList(data, dataListID) {
  var dataList = document.getElementById(dataListID);
  while (dataList.firstChild) {
    dataList.removeChild(dataList.firstChild);
  }
  for (var i in data) {
    var o = document.createElement("option");
    o.value = data[i]['Name'];
    dataList.append(o);
  }
}

function sortByScore(data) {

}

function stage2(value) {
  for (var i in data) {
    if (data[i]['Name'] == value) {
      CALORIES_PER_GRAM['food_to_be_substituted_input'] = data[i]['Calories per gram'];
      var ppg = data[i]['Protein per gram'];
      var cpg = data[i]['Carbs per gram'];
      var fpg = data[i]['Fat per gram'];
      var cat = data[i]['Category'];
      var stage2data = [];
      for (var j in data) {
        if (data[j]['Name'] != value) {
          var ppg2 = data[j]['Protein per gram'];
          var cpg2 = data[j]['Carbs per gram'];
          var fpg2 = data[j]['Fat per gram'];
          var cat2 = data[j]['Category'];
          var score = Math.abs(ppg - ppg2) + Math.abs(cpg - cpg2) + Math.abs(fpg - fpg2);
          if (cat == cat2) {
            score = score * 0.50;
          }
          stage2data.push({ppg: ppg2, cpg: cpg2, fpg: fpg2, score: score, Name: data[j]['Name']});
        }
      }
      console.log(stage2data.sort(function(a, b) {
        return a.score - b.score;
      }));

      dataToDataList(stage2data.sort(function(a, b) {
        return a.score - b.score;
      }), 'substitute_food_input_autocomplete_list');
    }
  }
}

function setFoodToBeSubstituted() {
  //get values in DOM
  var value = document.getElementById('food_to_be_substituted_input').value;
  var list = document.getElementById('food_to_be_substituted_input_autocomplete_list');
  //Did the user choose a list item or are they still typing?
  for (var i = 0; i < list.children.length; i++) {
    if(list.children[i].value === value){
      stage2(value);
    }
  }
}

function setSubstituteFood(){
  var value = document.getElementById('substitute_food_input').value;
  var list = document.getElementById('substitute_food_input_autocomplete_list');
  //Did the user choose a list item or are they still typing?
  for (var i = 0; i < list.children.length; i++) {
    if(list.children[i].value === value){
      for (var i in data) {
        if (data[i]['Name'] == value) {
          CALORIES_PER_GRAM['substitute_food_input'] = data[i]['Calories per gram'];
        }
      }
    }
  }
}


Papa.parse("https://raw.githubusercontent.com/DragosRotaru/Absolute-Coaching-Food-Substitution-Calculator/master/data.csv", {
	download: true,
  header: true,
  dynamicTyping: true,
	complete: function(results) {
		data = results.data;
    dataToDataList(data, 'food_to_be_substituted_input_autocomplete_list');
	}
});


document.getElementById('food_to_be_substituted_input').oninput = function () {
  setFoodToBeSubstituted();
};

document.getElementById('substitute_food_input').oninput = function () {
  setSubstituteFood();
};

document.getElementById('calculator_submit_button').onclick = calculate;
