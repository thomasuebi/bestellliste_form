// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBMRmd0qVwZlNKxddN71lpHAGgOMrt-7wc",
    authDomain: "bestellliste-e3334.firebaseapp.com",
    databaseURL: "https://bestellliste-e3334.firebaseio.com",
    projectId: "bestellliste-e3334",
    storageBucket: "bestellliste-e3334.appspot.com",
    messagingSenderId: "702169543027",
    appId: "1:702169543027:web:31061d919b597d2a42d506",
    measurementId: "G-XD72ZYJ9DT"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


var url = new URL(window.location.href);
var userId = url.searchParams.get("id");
var database = firebase.firestore();


var docRef = database.collection("forms").doc("Bln8YMP5O3dy7o6HEqL0ISY4NNo1"
);


async function fire() {
    
    
    await docRef.get().then(function(doc) {
    if (doc.exists) {
        data = doc.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
    console.log("Error getting document:", error);
    });
    
    
    var counter = 0;
    var counter1 = 0;
    var objects = data['data'];
    for(obj in objects) {
        if(objects[obj]['name']) {
            counter = counter + 1;
            var h2 = document.createElement('h2');
            var w = document.getElementById('w');
            var cont = document.getElementById('cont');
            h2.classList = "undone";
            h2.setAttribute('aria-Hidden', 'true');
            h2.innerHTML= objects[obj]['name'] + '(Optional)';
            cont.insertBefore(h2, w); // before warenkorb
            var div = document.createElement('div')
            div.classList = 'items'
            div.id = 'items-'.concat(counter)
            cont.insertBefore(div, w);
            for(product in objects[obj]['products']) {
                if(objects[obj]['products'][product]['name']) {
                    counter1 = counter1 + 1;
                    var row = document.createElement('div');
                    row.classList = 'row';

                    var col1 = document.createElement('div');
                    col1.classList = 'col-lg-7 col-md-6 col-sm-5 col-12'
                    var input = document.createElement('input');
                    input.id = 'item'.concat(counter1)
                    input.type = "checkbox";
                    input.classList = "checkboxes";
                    var label = document.createElement('label');
                    label.setAttribute('for','item'.concat(counter1))
                    label.innerHTML = objects[obj]['products'][product]['name'];
                    label.classList = "name";

                    col1.appendChild(input);
                    col1.appendChild(label);
                    row.appendChild(col1);

                    var col2 = document.createElement('div');
                    col2.classList = "col-lg-3 col-md-3 col-sm-3 col-5";
                    var qty = document.createElement('div');
                    qty.classList = "qty"

                    var minusBtn = document.createElement('span');
                    minusBtn.classList = "minus";
                    minusBtn.style.pointerEvents = "none";
                    minusBtn.style.color = "#8f8f8f";

                    minusBtn.innerHTML = "-";

                    var c = document.createElement('input');
                    c.type = "text";
                    c.id = counter1;
                    c.name = "qty";
                    c.classList = "count";
                    c.value = "0";
                    c.disabled = true;

                    var plusBtn = document.createElement('span');
                    plusBtn.classList = "plus";
                    plusBtn.innerHTML = "+";

                    qty.appendChild(minusBtn);
                    qty.appendChild(c);
                    qty.appendChild(plusBtn);
                    col2.appendChild(qty);
                    row.appendChild(col2);

                    var col3 = document.createElement('div');
                    col3.classList = "col-lg-2 col-md-2 col-sm-2 col-5";
                    var tex = document.createElement('div');
                    tex.classList = "text"
                    var p1 = document.createElement('p');
                    p1.id = 'p-'.concat(counter1);
                    p1.style.marginTop = "20%";
                    p1.style.display = "inline";
                    p1.classList = "price";
                    p1.innerHTML = objects[obj]['products'][product]['price'];

                    var p2 = document.createElement('p');
                    p2.style.display = "inline";
                    p2.innerHTML = " EUR";
                    p2.classList = "eur";

                    tex.appendChild(p1);
                    tex.appendChild(p2);
                    col3.appendChild(tex);
                    row.appendChild(col3);

                    div.appendChild(row);

                }

            }
    }
        
        
        
    }
    var minus = document.getElementsByClassName('minus');
    var plus = document.getElementsByClassName('plus');
    var priceTags = document.getElementsByClassName('price');
    
    var prices = [];
    
    for(var a = 0; a < priceTags.length; a++) {
        prices.push(parseFloat(priceTags[a].innerHTML.replace(',','.').replace(' ','')));
    };
    
   

    
    
    function check(elem) {
        var elem = elem;
        var pID,pTag,inner,d,innerResult;
        if(elem.value > 0) {
            elem.previousElementSibling.style.pointerEvents = "all";
            elem.previousElementSibling.style.color = "#435757";
        }
        else {
            elem.previousElementSibling.style.pointerEvents = "none";
            elem.previousElementSibling.style.color = "#8f8f8f";
            pID = 'p-'.concat(elem.id);
            pTag = document.getElementById(pID);
            innerResult = prices[parseInt(elem.id) - 1];
            pTag.innerHTML = innerResult.toFixed(2);
            var checkbox = document.getElementById('item'.concat(elem.id))
            checkbox.checked = false;
        }
    }
    
    
    var checkboxes = document.getElementsByClassName('checkboxes');
    for(var b = 0; b < checkboxes.length; b++) {
        checkboxes[b].addEventListener('change', function() {
            if(this.checked) {
                var p = this.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling
                if(parseInt(p.value) == 0) {
                    p.value = "1";
                }
               
                check(p);
                var div = document.createElement('div');
                var button = document.createElement('button');
                button.innerHTML = "x";
                button.classList = "x-button";
                button.addEventListener('click', function() {
                    this.parentElement.parentElement.remove();
                    var id = this.parentElement.parentElement.firstElementChild.firstElementChild.id;
                    document.getElementById(id).checked = false;
                    p.value = 0;
                    check(p);
                    sumUp();
                    
                })
                
                div.classList = "col-1";
                div.appendChild(button);
                
                var parent = this.parentElement.cloneNode(true);
                var parenParent = this.parentElement.parentElement.cloneNode(true);
                
                var count = parenParent.getElementsByClassName('count')[0];
                var countID = parseInt(count.id) +1000;
                count.id = countID;
                var currentPID = parenParent.getElementsByClassName('price')[0];
                currentPID.id = 'p-'.concat(countID);
                
                
                var mBtn = parenParent.getElementsByClassName('minus')[0];
                mBtn.onclick = function() {
                    var next = this.nextElementSibling;
                    var current = next.value;
                    var pID,pTag,inner,d,innerResult;

                    if(next.value != 0) {
                        pID = 'p-'.concat(next.id);
                        pTag = document.getElementById(pID);
                        inner = pTag.innerHTML;
                        d = parseFloat(inner);
                        if(parseInt(next.id) > 1000) {
                            var last2 = parseInt(next.id) -1000;
                            var innerResult = d - prices[last2 - 1];
                            pTag.innerHTML = innerResult.toFixed(2);

                            //Ausgangselement in der Liste
                            pID = 'p-'.concat(last2);
                            pTag = document.getElementById(pID);
                            pTag.innerHTML = innerResult.toFixed(2);
                        }
                        else {
                            var last2 = parseInt(next.id) + 1000;
                            if(document.getElementById(last2)) {
                                var all = parseInt(next.id) + 1000;
                                var innerResult = d - prices[parseInt(next.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2);

                                //Anderes Element
                                pID = 'p-'.concat(all);
                                pTag = document.getElementById(pID);
                                pTag.innerHTML = innerResult.toFixed(2);
                            }
                            else {
                                var innerResult = d - prices[parseInt(next.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2);
                            }

                        }
                    }
                    current = parseInt(current);
                    current--;
                    if(document.getElementById(last2)) {
                        document.getElementById(last2).value = current;
                    }
                    next.value = current;
                    if(next.value == 0 && parseInt(next.id) > 1000) {
                        var node = next.parentElement.parentElement.parentElement.remove();
                        document.getElementById(last2).value = 0; document.getElementById(last2).parentElement.parentElement.previousElementSibling.firstElementChild.checked = false;
                        check(document.getElementById(last2));
                        sumUp();
                    }
                    else {
                        check(next);

                   sumUp();
                    }
                };
                var pBtn = parenParent.getElementsByClassName('plus')[0];
                pBtn.onclick = function() {
                    var prev = this.previousElementSibling;
                    var current = prev.value;
                    if(prev.value != 0) {
                        var pID = 'p-'.concat(prev.id);
                        var pTag = document.getElementById(pID);
                        var inner = pTag.innerHTML;
                        var d = parseFloat(inner);
                        if(parseInt(prev.id) > 1000) {
                            //Element im Warenkorb
                            var last2 = parseInt(prev.id) -1000;
                            var innerResult = d + prices[last2 - 1];
                            pTag.innerHTML = innerResult.toFixed(2);

                            //Ausgangselement in der Liste
                            pID = 'p-'.concat(last2);
                            pTag = document.getElementById(pID);
                            pTag.innerHTML = innerResult.toFixed(2);
                        }
                        else {
                            var last2 = parseInt(prev.id) + 1000;
                            if(document.getElementById(last2)) {
                                var all = parseInt(prev.id) + 1000;
                                var innerResult = d + prices[parseInt(prev.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2);

                                //Anderes Element
                                pID = 'p-'.concat(all);
                                pTag = document.getElementById(pID);
                                pTag.innerHTML = innerResult.toFixed(2);
                            }
                            else {
                                var innerResult = d + prices[parseInt(prev.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2);
                            }

                        }

                    }
                    current = parseInt(current);
                    current++;
                    prev.value = current;
                    if(document.getElementById(last2)) {
                        document.getElementById(last2).value = current;
                    }
                    check(prev);

                    sumUp();

                };
                
                
                
                parenParent.appendChild(div);
                parenParent.firstChild.nextElementSibling.classList = "col-lg-2 col-md-3 col-sm-3 col-5";
                
                document.getElementById('warenkorb').appendChild(parenParent);
                sumUp();
            }
            else {
                var p = this.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling
                p.value= "0"
            }
            
        })
    }


   function sumUp() {
       var w = document.getElementById('warenkorb');
       var warenkorb = document.getElementById('warenkorb').getElementsByClassName('price');
       
       var sum = 0;
       for(var i = 0; i < warenkorb.length; i++) {
        sum += parseFloat(warenkorb[i].innerHTML);
       }
       
       if(warenkorb.length > 0 && !document.getElementById('sum')) {
           w.classList += ' bd';
           var div = document.createElement('div');
           div.classList = 'sumText';
           
           var sumText = document.createElement('h5');
           sumText.innerHTML = "Summe";
           sumText.id = 'sum';
           sumText.style.textAlign = 'left';
           sumText.style.margin = '4%';
           sumText.style.marginRight = "4%";
           sumText.style.marginLeft = "0";
           sumText.classList = "mob";
           div.appendChild(sumText);
           
           var summe = document.createElement('h5');
           summe.innerHTML = sum.toFixed(2);
           summe.id = 'sumT';
           summe.style.marginTop = '4%';
           
           summe.style.textAlign = 'right';
           summe.classList = "mob";
           
           var eur = document.createElement('h5');
           eur.innerHTML = '&euro;/EUR';
           eur.id = 'eur';
           eur.style.marginTop = '4%';
           eur.style.textAlign = 'right';
           eur.classList = "mob";
           
           div.appendChild(summe);
           div.appendChild(eur);
           
           
           
           w.parentNode.insertBefore(div, w.nextSibling)
           
           
           
       }
       if(document.getElementById('sumT')) {
            document.getElementById('sumT').innerHTML = sum.toFixed(2);
          }
       
       if(document.getElementById('sumT') && sum.toFixed(2) == 0.00) {
           document.getElementById('sumT').remove();
           document.getElementById('sum').remove();
           document.getElementById('eur').remove();
       }
   }


function validDate() {
    var today = new Date();
    today.setDate(today.getDate() + 2);
    var tod = today.toISOString().split('T')[0];
    document.getElementsByName('date')[0].setAttribute('min', tod)
}


var radio1 = document.getElementById('radio1');
radio1.addEventListener('click', function() {
    if(radio1.checked) {
        document.getElementById('time').style.display = "none";
    }
});

var radio2 = document.getElementById('radio2');
radio2.addEventListener('click', function() {
    if(radio2.checked) {
        document.getElementById('time').style.display = "flex";
    }
    else {
        document.getElementById('time').style.display = "none";
    }
});

document.getElementById('agb').addEventListener('change', function() {
    if(this.checked) {
        this.parentElement.style.backgroundColor = "rgba(255,255,255,0.8)"
    }
    else {
        this.parentElement.style.backgroundColor = "rgba(255,255,255,0.0)"
    }
    
});

var submit = document.getElementById('submitbtn').addEventListener('click', function() {
    var form = document.getElementById('form');
    if(empty()) {
        //firebase create order
        var korb = document.getElementById('warenkorb');
        var korbEl = korb.childNodes;
        console.log(korbEl[2]);
        var dataAr = [];
        if(korbEl.length != 0) {
            for(i = 0; i < korbEl.length; i++) {
                if(korbEl[i].nodeType == Node.ELEMENT_NODE) {
                    console.log(1);
                    var name = korbEl[i].firstElementChild.lastElementChild.innerHTML;
                    console.log(name);
                    var price = korbEl[i].lastElementChild.previousElementSibling.firstElementChild.firstElementChild.innerHTML;
                    console.log(price);
                    var stücke = korbEl[i].firstElementChild.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.value;
                    dataAr.push({
                                "name": name,
                                "gesamtpreis": price,
                                "stückzahl" :  stücke
                            });
                }
            }
            console.log(dataAr);
            
            
            var vorname = document.getElementById('vorname');
            var nachname = document.getElementById('nachname');
            var email = document.getElementById('email');
            var straße = document.getElementById('straße');
            var stadt = document.getElementById('stadt');
            var postleitzahl = document.getElementById('postleitzahl');
            var gemeinde = document.getElementById('gemeinde');
            var telefon = document.getElementById('telefonnummer');
            var agb = document.getElementById('agb');
            
            
            var wunschtermin = document.getElementById('dateofbirth');
            var zustellung = document.getElementsByName('radio1');
            for(var t = 0; t < zustellung.length; t++) {
                if(zustellung[t].checked) {
                    zustellung = zustellung[t].value;
                }
            }
            
            var zahlung = document.getElementsByName('radio2');
            for(var t = 0; t < zahlung.length; t++) {
                if(zahlung[t].checked) {
                    zahlung = zahlung[t].value;
                }
            }
            
            var kontaktAr = {
                    "vorname": vorname.value,
                    "nachname": nachname.value,
                    "email": email.value,
                    "straße": straße.value,
                    "stadt": stadt.value,
                    "postleitzahl": postleitzahl.value,
                    "gemeinde": gemeinde.value,
                    "wunschtermin": wunschtermin.value,
                    "telefonnummer": telefon.value,
                    "zustellung": zustellung,
                    "zahlung": zahlung,
                    "agb": agb.checked
            };
            
            if(zustellung == "Lieferung") {
                var lieferzeit = document.getElementById('lieferzeit')
                var anmerkung = document.getElementById('anmerkung');
                if(lieferzeit.value != "" ) {
                    kontaktAr.lieferzeit = lieferzeit.value;
                }
                if(anmerkung.value != "") {
                    kontaktAr.anmerkung = anmerkung.value;   
                }
                
            }
            var wunsch = document.getElementById('wunsch');
            if(wunsch.value != "") {
                kontaktAr.wunsch = wunsch.value;
            }
            
            database.collection("orders").add({
                formId: userId,
                data: dataAr,
                kontakdaten: kontaktAr
            
            }).then(function() {
                form.submit();
            });
            
        }
        
        
    }
    else{
        var hs = form.getElementsByTagName('h5');
        for(var i = 0; i < hs.length; i++ ) {
            hs[i].style.color = "#d64b4b";
        } 
    }
})






function add(event) {
        var prev = event.previousElementSibling;
        var current = prev.value;
        if(prev.value != 0) {
            var pID = 'p-'.concat(prev.id);
            var pTag = document.getElementById(pID);
            var inner = pTag.innerHTML;
            var d = parseFloat(inner);
            if(parseInt(prev.id) > 1000) {
                //Element im Warenkorb
                var last2 = parseInt(prev.id) -1000;
                var innerResult = d + prices[last2 - 1];
                pTag.innerHTML = innerResult.toFixed(2);
                
                //Ausgangselement in der Liste
                pID = 'p-'.concat(last2);
                pTag = document.getElementById(pID);
                pTag.innerHTML = innerResult.toFixed(2);
            }
            else {
                var last2 = parseInt(prev.id) + 1000;
                if(document.getElementById(last2)) {
                    var all = parseInt(prev.id) + 1000;
                    var innerResult = d + prices[parseInt(prev.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2);
                    
                    //Anderes Element
                    pID = 'p-'.concat(all);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2);
                }
                else {
                    var innerResult = d + prices[parseInt(prev.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2);
                }
               
            }
            
        }
        current = parseInt(current);
        current++;
        prev.value = current;
        if(document.getElementById(last2)) {
            document.getElementById(last2).value = current;
        }
        check(prev);
        
        sumUp();
    };
    
    function subst(event) {
        var next = event.nextElementSibling;
        var current = next.value;
        var pID,pTag,inner,d,innerResult;
        
        if(next.value != 0) {
            pID = 'p-'.concat(next.id);
            pTag = document.getElementById(pID);
            inner = pTag.innerHTML;
            d = parseFloat(inner);
            if(parseInt(next.id) > 1000) {
                var last2 = parseInt(next.id) -1000;
                var innerResult = d - prices[last2 - 1];
                pTag.innerHTML = innerResult.toFixed(2);
                
                //Ausgangselement in der Liste
                pID = 'p-'.concat(last2);
                pTag = document.getElementById(pID);
                pTag.innerHTML = innerResult.toFixed(2);
            }
            else {
                var last2 = parseInt(next.id) + 1000;
                if(document.getElementById(last2)) {
                    var all = parseInt(next.id) + 1000;
                    var innerResult = d - prices[parseInt(next.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2);
                    
                    //Anderes Element
                    pID = 'p-'.concat(all);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2);
                }
                else {
                    var innerResult = d - prices[parseInt(next.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2);
                }
               
            }
        }
        current = parseInt(current);
        current--;
        if(document.getElementById(last2)) {
            document.getElementById(last2).value = current;
        }
        next.value = current;
        if(next.value == 0 && parseInt(next.id) > 1000) {
            var node = next.parentElement.parentElement.parentElement.remove();
            document.getElementById(last2).value = 0; document.getElementById(last2).parentElement.parentElement.previousElementSibling.firstElementChild.checked = false;
            check(document.getElementById(last2));
            sumUp();
        }
        else {
            check(next);
        
       sumUp();
        }
         
    };





function empty() {
    var vorname = document.getElementById('vorname');
    var nachname = document.getElementById('nachname');
    var email = document.getElementById('email');
    var straße = document.getElementById('straße');
    var stadt = document.getElementById('stadt');
    var postleitzahl = document.getElementById('postleitzahl');
    var gemeinde = document.getElementById('gemeinde');
    var telefon = document.getElementById('telefonnummer');
    var radio3 = document.getElementById('radio3');
    var radio4 = document.getElementById('radio4');
    var agb = document.getElementById('agb');
    if(vorname.value == "" || nachname.value == "" || email == "") {
        return false;
    }
    else if(straße.value == "" || stadt.value == "" || postleitzahl.value == "" || gemeinde.value == "" || telefon.value == "") {
        return false;
    }
    else if((radio1.checked == false) && (radio2.checked == false)){
        return false;
    }
    else if((radio3.checked == false) && (radio4.checked == false)) {
        return false;
    }
    else if(agb.checked == false) {
        return false;
    }
    else{
        return true;
    }
    
}
    
    
    var minusButtons = document.getElementsByClassName('minus');
    for(var i = 0; i < minusButtons.length; i++) {
        minusButtons[i].onclick = function() {
            var next = this.nextElementSibling;
            var current = next.value;
            var pID,pTag,inner,d,innerResult;

            if(next.value != 0) {
                pID = 'p-'.concat(next.id);
                pTag = document.getElementById(pID);
                inner = pTag.innerHTML;
                d = parseFloat(inner);
                if(parseInt(next.id) > 1000) {
                    var last2 = parseInt(next.id) -1000;
                    var innerResult = d - prices[last2 - 1];
                    pTag.innerHTML = innerResult.toFixed(2);

                    //Ausgangselement in der Liste
                    pID = 'p-'.concat(last2);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2);
                }
                else {
                    var last2 = parseInt(next.id) + 1000;
                    if(document.getElementById(last2)) {
                        var all = parseInt(next.id) + 1000;
                        var innerResult = d - prices[parseInt(next.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2);

                        //Anderes Element
                        pID = 'p-'.concat(all);
                        pTag = document.getElementById(pID);
                        pTag.innerHTML = innerResult.toFixed(2);
                    }
                    else {
                        var innerResult = d - prices[parseInt(next.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2);
                    }

                }
            }
            current = parseInt(current);
            current--;
            if(document.getElementById(last2)) {
                document.getElementById(last2).value = current;
            }
            next.value = current;
            if(next.value == 0 && parseInt(next.id) > 1000) {
                var node = next.parentElement.parentElement.parentElement.remove();
                document.getElementById(last2).value = 0; document.getElementById(last2).parentElement.parentElement.previousElementSibling.firstElementChild.checked = false;
                check(document.getElementById(last2));
                sumUp();
            }
            else {
                check(next);

           sumUp();
            }
         
        }
    }
    var plusButtons = document.getElementsByClassName('plus');
    for(var i = 0; i < minusButtons.length; i++) {
        plusButtons[i].onclick = function() {
            var prev = this.previousElementSibling;
            var current = prev.value;
            if(prev.value != 0) {
                var pID = 'p-'.concat(prev.id);
                var pTag = document.getElementById(pID);
                var inner = pTag.innerHTML;
                var d = parseFloat(inner);
                if(parseInt(prev.id) > 1000) {
                    //Element im Warenkorb
                    var last2 = parseInt(prev.id) -1000;
                    var innerResult = d + prices[last2 - 1];
                    pTag.innerHTML = innerResult.toFixed(2);

                    //Ausgangselement in der Liste
                    pID = 'p-'.concat(last2);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2);
                }
                else {
                    var last2 = parseInt(prev.id) + 1000;
                    if(document.getElementById(last2)) {
                        var all = parseInt(prev.id) + 1000;
                        var innerResult = d + prices[parseInt(prev.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2);

                        //Anderes Element
                        pID = 'p-'.concat(all);
                        pTag = document.getElementById(pID);
                        pTag.innerHTML = innerResult.toFixed(2);
                    }
                    else {
                        var innerResult = d + prices[parseInt(prev.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2);
                    }

                }

            }
            current = parseInt(current);
            current++;
            prev.value = current;
            if(document.getElementById(last2)) {
                document.getElementById(last2).value = current;
            }
            check(prev);

            sumUp();
            }
    }
    
    
    
   validDate();
    
    
}

fire();






    



