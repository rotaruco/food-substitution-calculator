GRAMS_IN_OUNCES = 28.3495;
OUTPUT_MESSAGE = ' of the substitute is needed to provide the same amount of calories';
OZ = 'oz';
G = 'g';
data = [];
data2 = [];

AMOUNT_TO_BE_SUBSTITUTED = 0;
UNITS_TO_BE_SUBSTITUTED = 'Grams';
FTBSI = 0;
SFI = 0;

function calculate() {
  if (UNITS_TO_BE_SUBSTITUTED === 'Ounces') {
    var resultInGrams = (AMOUNT_TO_BE_SUBSTITUTED * GRAMS_IN_OUNCES * FTBSI)  / SFI;
    var result = resultInGrams / GRAMS_IN_OUNCES;
    var output = "<span id=\"weight\">" + String(result.toFixed(2)) + OZ + "</span>" + OUTPUT_MESSAGE;
  } else {
    var result = (AMOUNT_TO_BE_SUBSTITUTED * FTBSI) / SFI;
    var output = "<span id=\"weight\">" + String(result.toFixed(2)) + G + "</span>" + OUTPUT_MESSAGE;
  }
  if (AMOUNT_TO_BE_SUBSTITUTED <= 0 || isNaN(AMOUNT_TO_BE_SUBSTITUTED)) {
    var output = "Please input a food amount";
  }
  if (FTBSI <= 0 || SFI <= 0) {
    var output = "Please select foods from the dropdown menu";
  }
  document.getElementById('output').innerHTML = output;
  document.getElementById('output_div').className += ' show';
  document.getElementById('reset_button').className =+ ' resetshow';
}

function search(string, data) {
  if (string == '') {
    return data;
  }
  tempData = [];
  for (var i in data){
    if (data[i].Name.toLowerCase().indexOf(string.toLowerCase()) >= 0){
      tempData.push({Name: data[i].Name});
    }
  }
  return tempData;
}

function dataToDataList(data, dataListID) {
  var dataList = document.getElementById(dataListID);
  while (dataList.firstChild) {
    dataList.removeChild(dataList.firstChild);
  }
  for (var i = 0; i < data.length; i++) {
    var l = document.createElement("li");
    l.innerText = data[i]['Name'];
    l.id = data[i]['Name'];
    dataList.appendChild(l);
  }
}

function setFoodToBeSubstituted() {
  var value = document.getElementById('initial_input').value;
  for (var i = 0; i < data.length; i++) {
    if(data[i].Name == value){
      FTBSI = data[i]['Calories per gram'];
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
          if (!isNaN(score)){
            tempData.push({score: score, Name: data[j]['Name']});
          }
        }
      }
      data2 = tempData.sort(function(a, b) {
        return a.score - b.score;
      }).slice(0, tempData.length / 3);
      dataToDataList(data2, 'substitute_list');
    }
  }
}

function setSubstituteFood(){
  var value = document.getElementById('substitute_input').value;
  for (var i = 0; i < data.length; i++) {
    if (data[i]['Name'] == value) {
      SFI = data[i]['Calories per gram'];
    }
  }
}

Papa.parse("https://absolutecoachingcalculator.rotaru.co/data.csv", {
	download: true,
  header: true,
  dynamicTyping: true,
	complete: function(results) {
		data = results.data;
    dataToDataList(data, 'initial_list');
	}
});

firstul = document.getElementById('initial_list');

firstul.addEventListener('click', function(e) {
  var target = e.target; // Clicked element
  while (target && target.parentNode !== firstul) {
    target = target.parentNode; // If the clicked element isn't a direct child
    if(!target) { return; } // If element doesn't exist
  }
  if (target.tagName === 'LI'){
    document.getElementById('initial_list').style.display='none';
    document.getElementById('initial_input').value = target.id;
    setFoodToBeSubstituted();
    if (SFI > 0 && AMOUNT_TO_BE_SUBSTITUTED > 0 ) {
      calculate();
    }
  }
});

secondul = document.getElementById('substitute_list');

secondul.addEventListener('click', function(e) {
  var target = e.target; // Clicked element
  while (target && target.parentNode !== secondul) {
    target = target.parentNode; // If the clicked element isn't a direct child
    if(!target) { return; } // If element doesn't exist
  }
  if (target.tagName === 'LI'){
    document.getElementById('substitute_list').style.display='none';
    document.getElementById('substitute_input').value = target.id;
    setSubstituteFood();
    if (FTBSI > 0 && AMOUNT_TO_BE_SUBSTITUTED > 0 ) {
      calculate();
    }
  }
});

document.getElementById('amount_input').onkeyup = function() {
  AMOUNT_TO_BE_SUBSTITUTED = parseInt(document.getElementById('amount_input').value);
  if (FTBSI > 0 && SFI > 0 ) {
    calculate();
  }
}

document.getElementById('units_input').onchange = function() {
  UNITS_TO_BE_SUBSTITUTED = document.getElementById('units_input').value;
  if (FTBSI > 0 && SFI > 0 && AMOUNT_TO_BE_SUBSTITUTED > 0) {
    calculate();
  }
}


document.getElementById('initial_input').onkeyup = function () {
  dataToDataList(search(document.getElementById('initial_input').value, data), 'initial_list');
};

document.getElementById('substitute_input').onkeyup = function() {
  dataToDataList(search(document.getElementById('substitute_input').value, data2), 'substitute_list');
};

document.getElementById('initial_input').onfocus = function() {
  document.getElementById('initial_list').style.display='block';
  document.getElementById('substitute_list').style.display='none';
};

document.getElementById('substitute_input').onfocus = function() {
  document.getElementById('substitute_list').style.display='block';
  document.getElementById('initial_list').style.display='none';
};

document.getElementById('amount_input').onfocus = function() {
  document.getElementById('substitute_list').style.display='none';
  document.getElementById('initial_list').style.display='none';
};

document.getElementById('units_input').onfocus = function() {
  document.getElementById('substitute_list').style.display='none';
  document.getElementById('initial_list').style.display='none';
};

document.getElementById('reset_button').onclick = function() {
  document.getElementById('amount_input').value = '';
  document.getElementById('initial_input').value = '';
  document.getElementById('substitute_input').value = '';
  document.getElementById('output').innerText = '';
  document.getElementById('output_div').className = 'dontshow';
  document.getElementById('reset_button').className = 'resetdontshow';
  FTBSI = 0;
  SFI = 0;
  AMOUNT_TO_BE_SUBSTITUTED = 0;
  data2 = [];
  var dataList = document.getElementById('substitute_list');
  while (dataList.firstChild) {
    dataList.removeChild(dataList.firstChild);
  }
}
