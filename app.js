const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const Tabulator = require('tabulator-tables');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


let areaFilter = "World";
let rawdata = '';
let antelopes = {};
let filteredAntelopes = {};
let antelopeA = {};
let antelopeB = {};
let pieLabels = [];
let pieData = [];
let bubbleDataSet = [];
let pieTitle = "Horns type";

populatePieChart = () => {
  pieLabels = [];
  pieData = [];
  filteredAntelopes.forEach((antelope) => {
    if (!pieLabels.includes(antelope.horns)) {
      pieLabels.push(antelope.horns);
      pieData[pieLabels.indexOf(antelope.horns)] = 1;
    } else {
      pieData[pieLabels.indexOf(antelope.horns)]++;
    }
  });
};
populateBubbleChart = () => {
  let bubbleColors = ['#804C1C','#FFC085','#FF9838','#806042','#CC7A2D','#E68932','#F09036']
  bubbleDataSet = []
  filteredAntelopes.forEach((antelope) => {
    bubbleDataSet.push({
      backgroundColor: bubbleColors[Math.floor(Math.random() * 6)],
      data :[{
        x: antelope.weight,
        y: antelope.height,
        r: 5,
        label: antelope.name,
      }],
      label: antelope.name
    });
  });
};

filterAntelopes = (antelopes) => {
  return antelopes.filter((antelope) => {
    return (areaFilter === "World" || antelope.continent === areaFilter);
  });
};

populateCompare = () => {
  if (typeof antelopeA == 'string') {
    antelopeA = antelopes.filter((antelope) => {
      return (antelope.name === antelopeA);
    })[0];
  } else {
    antelopeA = antelopes[0];
  }
  if (typeof antelopeB == 'string') {
    antelopeB = antelopes.filter((antelope) => {
      return (antelope.name === antelopeB);
    })[0];
  } else {
    antelopeB = antelopes[1];
  }
}

init = () => {
  let rawdata = fs.readFileSync('public/antelopes.json');
  antelopes = JSON.parse(rawdata);
  filteredAntelopes = filterAntelopes(antelopes);

  populateCompare();
  populatePieChart();
  populateBubbleChart();
}

render = (res) => {
  res.render('index', { 
    antelopes: antelopes,
    filteredAntelopes: filteredAntelopes,
    areaFilter: areaFilter,
    pieLabels: pieLabels,
    pieData: pieData,
    pieTitle: pieTitle,
    bubbleDataSet: bubbleDataSet,
    antelopeA: antelopeA,
    antelopeB: antelopeB,
  });
}

app.get('/', function(req, res){
  init();
  render(res)
});

app.post('/areachanged', function (req, res) {
  areaFilter = req.body.areaFilter;
  res.redirect('/')
});

app.post('/antelopeAchanged', function (req, res) {
  antelopeA = req.body.antelopeA;
  res.redirect('/')
})

app.post('/antelopeBchanged', function (req, res) {
  antelopeB = req.body.antelopeB;
  res.redirect('/')
})

app.listen(port, () => console.log(`Antilope App listening on port ${port}!`))

