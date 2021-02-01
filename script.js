

getData();


function buildAxis(data) {
  const newData = data.reduce((collection, item, i) => {
    const findCat = collection.find((findItem) => findItem.label === item['Payee Name']);
    if (!findCat) {
      collection.push({
        label: item['Payee Name'],
        y: parseFloat(item.Amount)
      });
    } else {
      findCat.y += parseFloat(item.Amount);
    }
    return collection;
  }, []);
return newData;
}

function makeYourOptionsObject(budgetData) {
  
  CanvasJS.addColorSet('customColorSet1', ['#4661EE', '#EC5657', '#1BCDD1', '#8FAABB', '#B08BEB', '#3EA0DD', '#F5A52A', '#23BFAA', '#FAA586', '#EB8CC6'
  ]);
  return {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    height: 700,

    title: {
      text: 'Spending Per Agency',
      fontSize: 40,
    },

    axisX: {
      interval: 1,
      labelFontSize: 10,
      
    },

    axisY2: {
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Amount in Dollars',
      titleFontSize: 30,
      labelFontSize: 10,
    },

    data: [{
      type: 'column',
      name: 'Agencies',
      axisYType: 'secondary',
      dataPoints: budgetData
    }]
  };
}

async function getData(){
  var checkboxElems = document.querySelectorAll("input[type='checkbox']");
  var texts = "Payee Name,Agency,Zip Code,Amount,Payment Description\n";

  async function displayCheck(e){
      
      const year = e.target.id;
      
      const rawData = await fetch('FY_'+year+'.csv');
      var text = await rawData.text();
      var lines = text.split('\n');
      lines.splice(0,1)[0];
      text = lines.join('\n');

      if (e.target.checked) {
        texts = texts.concat(text);
      } 
      else {
        texts = texts.replace(text, '');
      }
      
      //Use D3 to Parse CSV's
      const dataParse = d3.csvParse(texts);
      dataParse.forEach(row => {
        const vendor = row["Payee Name"];
        const amount = row.Amount;
      })

        const hope = buildAxis(dataParse);
        hope.sort(function(a, b){return b.y-a.y});
        
        //Render Inital Chart with default interval 0-10
        new CanvasJS.Chart('chartContainer', makeYourOptionsObject(hope.slice(0, 10))).render();
        
        //User definable interval
        document.getElementById("interval_form").addEventListener('submit', function(update){
          update.preventDefault();
          const int_form = document.querySelector("#interval_form");
          const upper_bound = int_form.upper_bound.value;
          const lower_bound = int_form.lower_bound.value;

          // Re-render chart
          const options = makeYourOptionsObject(hope.slice(lower_bound, upper_bound));
          new CanvasJS.Chart('chartContainer', options).render();
          
        })

        
        
    }

  for (var i = 0; i < checkboxElems.length; i++) {
    checkboxElems[i].addEventListener("click", displayCheck);
  }


}


