GRAMS_IN_OUNCES = 28.3495;
OUTPUT_MESSAGE = ' of the substitute is needed to provide the same amount of calories';
OZ = 'oz';
G = 'g';
data = [];

CALORIES_PER_GRAM = {
  food_to_be_substituted_input: 0,
  substitute_food_input: 0,
};

function calculate() {
  var amountToBeSubstituted = parseInt(document.getElementById('amount_to_be_substituted_input').value);
  var unitsToBeSubstituted = document.getElementById('units_to_be_substituted_input').value;
  var calsPerGram1 = CALORIES_PER_GRAM['food_to_be_substituted_input'];
  var calsPerGram2 = CALORIES_PER_GRAM['substitute_food_input'];

  if (unitsToBeSubstituted === 'Ounces') {
    var foodInGrams1 = amountToBeSubstituted * GRAMS_IN_OUNCES;
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
  if (amountToBeSubstituted <= 0 || amountToBeSubstituted == NaN ) {
    result = "Please input a food amount";
  }
  if (calsPerGram1 <= 0 || calsPerGram2 <= 0) {
    result = "Please select foods from the dropdown menu";
  }
  console.log(typeof amountToBeSubstituted, amountToBeSubstituted);
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

function setFoodToBeSubstituted() {
  var value = document.getElementById('food_to_be_substituted_input').value;
  for (var i = 0; i < data.length; i++) {
    if(data[i].Name === value){
      CALORIES_PER_GRAM['food_to_be_substituted_input'] = data[i]['Calories per gram'];
      var ppg = data[i]['Protein per gram'];
      var cpg = data[i]['Carbs per gram'];
      var fpg = data[i]['Fat per gram'];
      var cat = data[i]['Category'];
      var tempData = [];
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
          tempData.push({score: score, Name: data[j]['Name']});
        }
      }
      dataToDataList(tempData.sort(function(a, b) {
        return a.score - b.score;
      }).slice(0, 50), 'substitute_food_input_autocomplete_list');
    }
  }
}

function setSubstituteFood(){
  var value = document.getElementById('substitute_food_input').value;
  for (var i = 0; i < data.length; i++) {
    if (data[i]['Name'] == value) {
      CALORIES_PER_GRAM['substitute_food_input'] = data[i]['Calories per gram'];
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
