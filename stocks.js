function addYear() {
	 // Cards
	 var carddetails = document.getElementById("carddetails");
	 carddetails.innerHTML = "";
	 var randomnum = Math.floor(Math.random() * cards.length);
	 var carddrawn = cards[randomnum];
	 cards.splice(randomnum, 1);
	 var market = document.createElement("div");
	 market.style.fontWeight = "bold";
	 market.innerHTML = carddrawn.market + " Market";
	 carddetails.appendChild(market);
	 var list = document.createElement("ul");
	 list.style.marginTop = "0px";
	 var deltas = carddrawn.deltas;
	 for (var i = 0; i < deltas.length; i++) {
		 var delta = deltas[i];
		 var listitem = document.createElement("li");
		 listitem.id = "delta_" + delta.id;
		 listitem.value = delta.delta;
		 listitem.className = "stockdelta";
		 listitem.innerHTML = document.getElementById("stockname_" + delta.id).innerHTML + ": " + delta.delta;
		 list.appendChild(listitem);
	 }
	 var flavortext = document.createElement("div");
	 flavortext.innerHTML = carddrawn.flavor;
	 flavortext.style.fontSize = "80%";
	 carddetails.appendChild(flavortext);
	 carddetails.appendChild(list);

	 //Roll 2 d6
	 var dieroll = (1 + Math.floor(Math.random() * 6)) + (1 + Math.floor(Math.random() * 6));
	 dieroll = dieroll - 2; 

	var stockboard = document.getElementById("stockboard");
    for (i = 0; i < stockboard.rows.length; i ++) {
        var yearElement = document.getElementById("year");
        var year = parseInt(yearElement.value);
        switch (i) {
            case 0:
				var yearelement = document.getElementById("year");
				var previousyear = parseInt(yearelement.value);
                yearelement.value = (previousyear + 1);
                var header = "Year " + yearelement.value;
                if (yearelement.value == "11") {
                    header = "Closing";
                }
                stockboard.rows[i].insertCell(stockboard.rows[i].cells.length).outerHTML = "<th>" + header + "</th>";
                break;
            case 1:
                var cell = stockboard.rows[i].insertCell(stockboard.rows[i].cells.length);
                cell.style.fontWeight = "bold";
                cell.style.textAlign = "center";
                cell.appendChild(document.createTextNode("100"));
                break;
            default:
                var cell = stockboard.rows[i].insertCell(stockboard.rows[i].cells.length);
                cell.className = "stockvalue";
				cell.id = "stock_" + yearelement.value + "_" + i;
				var previousvalue = parseInt(document.getElementById("value_" + previousyear + "_" + i).value);
				var slidervalue = parseInt(getSliderValue(carddrawn.market, dieroll, (i - 2)));
				var cardchange = parseInt(getCardChange(carddrawn, i));
				var newvalueinfo = calculateNewValue(previousvalue, slidervalue, cardchange, year);
				var newvalue = newvalueinfo.newvalue;
				var visibleval = newvalue;
				if (newvalueinfo.reset){
					visibleval = 0;
				}
				var visiblevalue = document.createElement("span");
				visiblevalue.id = "vv_" + yearelement.value + "_" + i;
				visiblevalue.appendChild(document.createTextNode(visibleval));
				cell.appendChild(visiblevalue);
				var stockvalue = document.createElement("input");
				stockvalue.type = "hidden";
				stockvalue.id = "value_" + yearelement.value + "_" + i;
				stockvalue.value = newvalue;
				if ((slidervalue + cardchange) > 0){
					cell.style.color = "green";
				}
				else if ((slidervalue + cardchange) < 0){
					cell.style.color = "red";
				}
				if ((i % 2) == 0) {
                    cell.style.backgroundColor = "lightgray";
				}
				if (newvalueinfo.split){
					cell.style.backgroundColor = "lightblue";
				}
				if (newvalue < 50){
					cell.style.backgroundColor = "#c5c543";
				}
				if (newvalueinfo.reset){
					cell.style.backgroundColor = "black";
					cell.style.color = "yellow";
				}
				cell.appendChild(stockvalue);
                break;
        }
    }
    var buttonarea = document.getElementById("buttonarea");
	buttonarea.innerHTML = "";
	showNextYearButton(yearelement.value);
}

function getCardChange(card, company){
	var change = 0;
	var deltas = card.deltas;
	for (i = 0; i < deltas.length; i++) {
		if (deltas[i].id == company) {
			change = deltas[i].delta;
		}
	}
	return change;
}

function getSliderValue(market, roll, company) {
	var slider;
	if (market == "Bear"){
		slider = bearslider;
	}
	else{
		slider = bullslider;
	}

	var slidervalue;
	slidervalue = slider[roll][company];

	return slidervalue;
}

function calculateNewValue(previousvalue, slidervalue, cardchange, year){
	var newvalue = previousvalue + slidervalue + cardchange;
	var split = false;
	var reset = false;
	if (newvalue >= 150 && year !="11"){
		newvalue = Math.round(newvalue/2);
		split = true;
	}
	if (newvalue <= 0) {
		newvalue = 100;
		reset = true;
	}
	let newvalueinfo = {
		newvalue: newvalue,
		split: split,
		reset: reset
	};
	return newvalueinfo;
}

function showNextYearButton(currentYear) {
	var buttonarea = document.getElementById("buttonarea");
    buttonarea.innerHTML = "";
    if (currentYear < 11) {
        var newyear = document.createElement("button");
        newyear.className = "button";
        newyear.onclick = addYear;
        var buttonwords = "Year " + (
            parseInt(currentYear) + 1
        );
        if (currentYear == 10) {
            buttonwords = "Closing";
        }
        newyear.innerHTML = buttonwords;
        buttonarea.appendChild(newyear);
        newyear.focus();
	}
	else{
		var newgame = document.createElement("button");
		newgame.className = "button";
		newgame.onclick = function() { newGamePrompt (); };
		newgame.innerHTML = "New Game";
		buttonarea.appendChild(newgame);
		newgame.focus();
	}
}

function newGamePrompt () {
	let newgame = confirm("Are you sure you want to start a new game?");
	if (newgame){
		location.reload(true);
	}
}