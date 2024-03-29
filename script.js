
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "",
    authDomain: "bestellliste-e3334.firebaseapp.com",
    databaseURL: "https://bestellliste-e3334.firebaseio.com",
    projectId: "bestellliste-e3334",
    storageBucket: "bestellliste-e3334.appspot.com",
    messagingSenderId: "702169543027",
    appId: "",
    measurementId: "G-XD72ZYJ9DT"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


var url = new URL(window.location.href);
var userId = url.searchParams.get("id");
var database = firebase.firestore();


var docRef = database.collection("forms").doc(userId);

var summe; //zugriff auf das element

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
    
    
    
    
    var rechnung = data['paymentInvoice'];
    var bar = data['paymentCash'];
    if(rechnung) {
        document.getElementById('rechnung').style.display = "block";
    }
    if(bar) {
        document.getElementById('bar').style.display = "block";
    }
    
    var lieferung = data['delivery'];
    var abholung = data['collection'];
    if(lieferung) {
        document.getElementById('lieferung').style.display = "block";
    }
    if(abholung) {
        document.getElementById('abholung').style.display = "block";
    }
    
    var info = data['additionalInfo']

    if(info) {
        document.getElementById('info').style.display = "block";
        document.getElementById('info').innerHTML = "<strong>Info: </strong>".concat(info)
    }
    
    
    
    
    
    
    var counter = 0;
    var counter1 = 0;
    var objects = data['data'];
    var userEmail = data['email'];
    for(obj in objects) {
        if(objects[obj]['name']) {
            counter = counter + 1;
            var h2 = document.createElement('h2');
            var w = document.getElementById('w');
            var cont = document.getElementById('cont');
            h2.classList = "undone";
            h2.setAttribute('aria-Hidden', 'true');
            h2.innerHTML= objects[obj]['name'];
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
                    c.classList = "count browser-default";
                    c.value = "0";
                    c.readOnly = true;

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
                    if(objects[obj]['products'][product]['price'] == "" || objects[obj]['products'][product]['price'] == " ") {
                        p1.innerHTML = "0,00";
                    }
                    else {
                        var ip = parseFloat(objects[obj]['products'][product]['price'])
                        p1.innerHTML = ip.toFixed(2).replace(".", ",");
                    }
                    

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
        if(priceTags[a].innerHTML == "" || priceTags[a].innerHTML == " ") {
            prices.push(parseFloat("0.00"))
        }
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
            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
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
                var idN = this.id;
                
                
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
                    console.log("ja")
                    var next = this.nextElementSibling;
                    var current = next.value;
                    var pID,pTag,inner,d,innerResult;

                    if(next.value != 0) {
                        pID = 'p-'.concat(next.id);
                        pTag = document.getElementById(pID);
                        inner = pTag.innerHTML.replace("," , ".");
                        d = parseFloat(inner);
                        if(parseInt(next.id) > 1000) {
                            var last2 = parseInt(next.id) -1000;
                            var innerResult = d - prices[last2 - 1];
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                            //Ausgangselement in der Liste
                            pID = 'p-'.concat(last2);
                            pTag = document.getElementById(pID);
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                        }
                        else {
                            var last2 = parseInt(next.id) + 1000;
                            if(document.getElementById(last2)) {
                                var all = parseInt(next.id) + 1000;
                                var innerResult = d - prices[parseInt(next.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                                //Anderes Element
                                pID = 'p-'.concat(all);
                                pTag = document.getElementById(pID);
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                            }
                            else {
                                var innerResult = d - prices[parseInt(next.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
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
                        var inner = pTag.innerHTML.replace(",",".") ;
                        var d = parseFloat(inner);
                        if(parseInt(prev.id) > 1000) {
                            //Element im Warenkorb
                            var last2 = parseInt(prev.id) -1000;
                            var innerResult = d + prices[last2 - 1];
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                            //Ausgangselement in der Liste
                            pID = 'p-'.concat(last2);
                            pTag = document.getElementById(pID);
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                        }
                        else {
                            var last2 = parseInt(prev.id) + 1000;
                            if(document.getElementById(last2)) {
                                var all = parseInt(prev.id) + 1000;
                                var innerResult = d + prices[parseInt(prev.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                                //Anderes Element
                                pID = 'p-'.concat(all);
                                pTag = document.getElementById(pID);
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                            }
                            else {
                                var innerResult = d + prices[parseInt(prev.id) - 1];
                                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
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
                var thisId = this.id;
                var nums = document.querySelectorAll('#'.concat(thisId));
                if(nums.length > 1) {
                   nums[1].nextElementSibling.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.click()
                }
            }
            
        })
    }


   function sumUp() {
       var w = document.getElementById('warenkorb');
       var warenkorb = document.getElementById('warenkorb').getElementsByClassName('price');
       
       var sum = 0;
       for(var i = 0; i < warenkorb.length; i++) {
        sum += parseFloat(warenkorb[i].innerHTML.replace(",", "."));
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
           
           summe = document.createElement('h5');
           summe.innerHTML = sum.toFixed(2).replace(".",",");
           summe.id = 'sumT';
           summe.style.marginTop = '4%';
           
           summe.style.textAlign = 'right';
           summe.classList = "mob";
           
           var eur = document.createElement('h5');
           eur.innerHTML = 'EUR';
           eur.id = 'eur';
           eur.style.marginTop = '4%';
           eur.style.textAlign = 'right';
           eur.style.marginLeft = "5px";
           eur.classList = "mob";
           
           div.appendChild(summe);
           div.appendChild(eur);
           
           
           
           w.parentNode.insertBefore(div, w.nextSibling)
           
           
           
       }
       if(document.getElementById('sumT')) {
            document.getElementById('sumT').innerHTML = sum.toFixed(2).replace(".",",");
          }
       
       if(document.getElementById('sumT') && sum.toFixed(2) == 0.00) {
           document.getElementById('sumT').remove();
           document.getElementById('sum').remove();
           document.getElementById('eur').remove();
       }
   }





var radio1 = document.getElementById('radio1');
radio1.addEventListener('click', function() {
    if(radio1.checked) {
        document.getElementById('time').style.display = "flex";
    }
    else {
        document.getElementById('time').style.display = "flex";
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
        this.nextElementSibling.style.color = "#333";
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
                    var price = korbEl[i].lastElementChild.previousElementSibling.firstElementChild.firstElementChild.innerHTML.replace(".",",");
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
            
            var termin = wunschtermin.value.split("-") //format the date
            
            if(termin.length > 1) {
                var termin = wunschtermin.value.split("-")
                var terminwunsch = termin[2] + "." + termin[1] + "." + termin[0];
                wunschtermin = terminwunsch;
            }else {
                wunschtermin = wunschtermin.value
            }
           
            
            var kontaktAr = {
                    "vorname": vorname.value,
                    "nachname": nachname.value,
                    "email": email.value,
                    "straße": straße.value,
                    "stadt": stadt.value,
                    "postleitzahl": postleitzahl.value,
                    "wunschtermin": wunschtermin,
                    "telefonnummer": telefon.value,
                    "zustellung": zustellung,
                    "zahlung": zahlung,
                    "agb": agb.checked
            };
            
            
            
            console.log(summe.innerHTML)
            kontaktAr.gesamtpreis = summe.innerHTML.replace(".", ",");
                
            
            
            var lieferzeit = document.getElementById('lieferzeit')
            var anmerkung = document.getElementById('anmerkung');
            if(lieferzeit.value != "" ) {
                kontaktAr.lieferzeit = lieferzeit.value;
            }
            if(anmerkung.value != "") {
                kontaktAr.anmerkung = anmerkung.value;   
            }
                
            var wunsch = document.getElementById('wunsch');
            if(wunsch.value != "") {
                kontaktAr.wunsch = wunsch.value;
            }
            
            database.collection("orders").add({
                formId: userId,
                data: dataAr,
                kontakdaten: kontaktAr,
                created: Date.now()
            
            }).then(function() {            
                var email = {email:userEmail, warenkorb:dataAr, kontaktdaten:kontaktAr}
                var json = JSON.stringify(email);
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "https://www.bestellliste.com/functions/sendmail.php?data=" + json);
                xhr.onload = function (e) {
                  alert("Bestellung erfolgreich abgeschickt!")
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      console.log(xhr.responseText);
                      window.location.href="/?id=".concat(userId);
                    } else {
                      console.error(xhr.statusText);
                    }
                  }
                };
                xhr.send(null);
                
            });
            
            
            
        }
        
        
    }
    else{
        var scrolled = false;
        var zustell = false;
        var zahl = false;
        var radioc = 0;
        for(var i = 0; i < inputFields.length; i++) {
              if(inputFields[i].type == "text"){  
                if(!inputFields[i].value) {
                    inputFields[i].nextElementSibling.style.content = "Dieser Eintrag fehlt!";
                    inputFields[i].nextElementSibling.classList += " plac";  
                    if(!scrolled) {
                        document.getElementById(inputFields[i].id).scrollIntoView();
                        scrolled = true;
                    }
                }
              }else if(inputFields[i].type == "radio") {
                      var zustellung = document.getElementsByName('radio1');
                        for(var t = 0; t < zustellung.length; t++) {
                            if(zustellung[t].checked) {
                                zustell = true;
                            }
                        }
                  
                      var zahlung = document.getElementsByName('radio2');
                        for(var t = 0; t < zahlung.length; t++) {
                            if(zahlung[t].checked) {
                                zahl = true;
                            }
                        }
                  
                      radioc++;
                      if(radioc <= 2) {
                          if(!inputFields[i].checked && zustell == false) {
                              inputFields[i].nextElementSibling.style.cssText += 'color:#ed6d68 !important';
                              if(!scrolled) {
                                document.getElementById(inputFields[i].id).scrollIntoView();
                                  scrolled = "true"
                              }

                          }
                      }
                      if(radioc > 2) {
                          if(!inputFields[i].checked && zahl == false) {
                              inputFields[i].nextElementSibling.style.cssText += 'color:#ed6d68 !important';
                              if(!scrolled) {
                                document.getElementById(inputFields[i].id).scrollIntoView();
                                  scrolled = "true"
                              }

                          }
                      }
                  
              }else if(inputFields[i].type == "checkbox") {
                  if(inputFields[i].checked != true) {
                    inputFields[i].nextElementSibling.style.color = "#ed6d68"
                    if(!scrolled) {
                        document.getElementById(inputFields[i].id).scrollIntoView();
                        scrolled = true;
                    }
                  }
              }
            
        }
        
    }
})






function add(event) {
        var prev = event.previousElementSibling;
        var current = prev.value;
        if(prev.value != 0) {
            var pID = 'p-'.concat(prev.id);
            var pTag = document.getElementById(pID);
            console.log("yeah", pTag.innerHTML)
            var inner = pTag.innerHTML.replace(",", ".");
            var d = parseFloat(inner);
            if(parseInt(prev.id) > 1000) {
                //Element im Warenkorb
                var last2 = parseInt(prev.id) -1000;
                var innerResult = d + prices[last2 - 1];
                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                
                //Ausgangselement in der Liste
                pID = 'p-'.concat(last2);
                pTag = document.getElementById(pID);
                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
            }
            else {
                var last2 = parseInt(prev.id) + 1000;
                if(document.getElementById(last2)) {
                    var all = parseInt(prev.id) + 1000;
                    var innerResult = d + prices[parseInt(prev.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                    
                    //Anderes Element
                    pID = 'p-'.concat(all);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                }
                else {
                    var innerResult = d + prices[parseInt(prev.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                }
               
            }
            
        }
        current = parseInt(current);
        current++;
        prev.value = current;
        if(document.getElementById(last2)) {
            document.getElementById(last2).value = current;
            console.log(document.getElementById(last2))
        }
        check(prev);
        
        sumUp();
    };
    
    function subst(event) {
        var next = event.nextElementSibling;
        var current = next.value;
        var pID,pTag,inner,d,innerResult;
        current = parseInt(current);
        current--;
        console.log(current)
        
        if(next.value != 0) {
            pID = 'p-'.concat(next.id);
            pTag = document.getElementById(pID);
            inner = pTag.innerHTML.replace(",", ".");
            d = parseFloat(inner);
            if(parseInt(next.id) > 1000) {
                var last2 = parseInt(next.id) - 1000;
                var innerResult = d - prices[last2 - 1];
                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                
                //Ausgangselement in der Liste
                pID = 'p-'.concat(last2);
                pTag = document.getElementById(pID);
                pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
            }
            else {
                var last2 = parseInt(next.id) + 1000;
                if(document.getElementById(last2)) {
                    var all = parseInt(next.id) + 1000;
                    var innerResult = d - prices[parseInt(next.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                    
                    //Anderes Element
                    pID = 'p-'.concat(all);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                }
                else {
                    var innerResult = d - prices[parseInt(next.id) - 1];
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                }
               
            }
        }
        
        if(document.getElementById(last2)) {
            document.getElementById(last2).value = current;
        }
        next.value = current;
        if(next.value == 0 && parseInt(next.id) > 1000) {
            var node = next.parentElement.parentElement.parentElement;
            console.log(node);
            node.remove();
            document.getElementById(last2).value = 0; document.getElementById(last2).parentElement.parentElement.previousElementSibling.firstElementChild.checked = false;
            check(document.getElementById(last2));
            sumUp();
        }
        else {
            check(next);
        
       sumUp();
        }
         
    };




var inputFields = [];

    
    
    var minusButtons = document.getElementsByClassName('minus');
    for(var i = 0; i < minusButtons.length; i++) {
        minusButtons[i].onclick = function() {
            console.log("ja")
            var next = this.nextElementSibling;
            var current = next.value;
            var pID,pTag,inner,d,innerResult;
            console.log(current)
            if(next.value != 0) {
                pID = 'p-'.concat(next.id);
                pTag = document.getElementById(pID);
                inner = pTag.innerHTML.replace(",", ".");
                d = parseFloat(inner);
                if(parseInt(next.id) > 1000) {
                    var last2 = parseInt(next.id) -1000;
                    var innerResult = d - prices[last2 - 1];
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                    //Ausgangselement in der Liste
                    pID = 'p-'.concat(last2);
                    pTag = document.getElementById(pID);
                    pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                }
                else {
                    var last2 = parseInt(next.id) + 1000;
                    if(document.getElementById(last2)) {
                        console.log("Ja")
                        var all = parseInt(next.id) + 1000;
                        var innerResult = d - prices[parseInt(next.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                        console.log(pTag)

                        //Anderes Element
                        pID = 'p-'.concat(all);
                        pTag = document.getElementById(pID);
                        console.log("hier")
                        pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                        if(current == 1) {
                            pTag.parentElement.parentElement.nextElementSibling.firstElementChild.click(); //remove the warenkorb item
                        }
                    }
                    else {
                        var innerResult = d - prices[parseInt(next.id) - 1];
                        pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
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
    for(var i = 0; i < plusButtons.length; i++) {
        plusButtons[i].onclick = function() {
            console.log("ja")
            var prev = this.previousElementSibling;
            if(prev.value == 0) {
                var e = new Event("change");
                prev.parentElement.parentElement.previousElementSibling.firstElementChild.checked = true;
                prev.parentElement.parentElement.previousElementSibling.firstElementChild.dispatchEvent(e);
            }
            else {
                
                var current = prev.value;
                current = parseInt(current);
                current++;
                if(prev.value != 0) {
                    var pID = 'p-'.concat(prev.id);
                    var pTag = document.getElementById(pID);
                    var inner = pTag.innerHTML.replace(",", ".");
                    console.log("yeah", inner.replace(".", ","))
                    var d = parseFloat(inner);

                    if(parseInt(prev.id) > 1000) {
                        //Element im Warenkorb
                        var last2 = parseInt(prev.id) -1000;
                        var innerResult = d + prices[last2 - 1];
                        console.log(innerResult)
                        pTag.innerHTML = innerResult.toFixed(2).replace(".", ",");

                        //Ausgangselement in der Liste
                        pID = 'p-'.concat(last2);
                        pTag = document.getElementById(pID);
                        console.log(innerResult.toFixed(2))
                        pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                    }
                    else {
                        var last2 = parseInt(prev.id) + 1000;
                        if(document.getElementById(last2)) {
                            var all = parseInt(prev.id) + 1000;
                            var innerResult = d + prices[parseInt(prev.id) - 1];
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");

                            //Anderes Element
                            pID = 'p-'.concat(all);
                            pTag = document.getElementById(pID);
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                        }
                        else {
                            var innerResult = d + prices[parseInt(prev.id) - 1];
                            pTag.innerHTML = innerResult.toFixed(2).replace(".",",");
                            console.log(pTag)
                        }

                    }

                }
                prev.value = current;

                if(document.getElementById(last2)) {
                    document.getElementById(last2).value = current;
                }
                check(prev);

                sumUp();
                }


            }
            
            
    }
    
    
    
   validDate();
    
    
  
    
    
    
    
    
    
    var radios = document.getElementsByTagName('input');
    for(var i = 0; i< radios.length; i++) {
        if(radios[i].nodeType == Node.ELEMENT_NODE) {
            if(radios[i].type == "radio") {
                radios[i].addEventListener('click', function() {
                    if(this.checked) {
                        this.nextElementSibling.style.borderColor = "#333";
                        this.nextElementSibling.style.color = "#fff";
                    }
                    else if(this.checked == false){
                        console.log("user")
                        this.nextElementSibling.style.color = "#333";
                    }
                })
            }
        }
    
    }
    
    
    
    function empty() {
    var vorname = document.getElementById('vorname');
    var nachname = document.getElementById('nachname');
    var email = document.getElementById('email');
    var straße = document.getElementById('straße');
    var stadt = document.getElementById('stadt');
    var postleitzahl = document.getElementById('postleitzahl');
    var telefon = document.getElementById('telefonnummer');
    
    var radio3 = document.getElementById('radio3');
    var radio4 = document.getElementById('radio4');
    var agb = document.getElementById('agb');
    var wunschtermin = document.getElementById('dateofbirth');
    console.log(agb);
    console.log(wunschtermin);
    inputFields.push(vorname);
    inputFields.push(nachname);
    inputFields.push(email);
    inputFields.push(straße);
    inputFields.push(stadt);
    inputFields.push(postleitzahl);
    inputFields.push(telefon);
    inputFields.push(radio1);
    inputFields.push(radio2);
    inputFields.push(radio3);
    inputFields.push(radio4);
    inputFields.push(agb);
    inputFields.push(wunschtermin);
    
    
    if(vorname.value == "" || nachname.value == "" || email.value == "") {
        return false;
    }
    else if(straße.value == "" || stadt.value == "" || postleitzahl.value == "" || telefon.value == "") {
        return false;
    }
    else if((radio1.checked == false) && (radio2.checked == false)){
        return false;
    }
    else if((radio3.checked == false) && (radio4.checked == false)) {
        return false;
    }
    else if(agb.checked == false || wunschtermin.value == "") {
        return false;
    }
    else{
        return true;
    }
    
    }
    
    
    /*var allInputs = document.getElementsByTagName('input');
    for(var i = 0; i < allInputs.length; i++) {
        allInputs[i].classList += " browser-default";
    }*/
    
    
}

fire();






    



