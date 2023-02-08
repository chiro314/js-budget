var banque = [      ["dépense","fixe","Loyer et charges",           0, "/mois"],
                    ["dépense","fixe","remboursement de crédits",   0, "/mois"],
                    ["dépense","fixe","eau/électricité/gaz",        0, "/mois"],
                    ["dépense","courante","courses",                0, "/sem."],
                    ["dépense","courante","sport et culture",       0, "/an"],   
                    ["recette","divers","salaire",                  0, "/mois"],
                    ["recette","divers","aides",                    0, "/mois"]      
            
            ];

var banqueBis = [   ["dépense","fixe","Loyer et charges",           0, "/mois"],
                    ["dépense","fixe","remboursement de crédits",   0, "/mois"],
                    ["dépense","fixe","eau/électricité/gaz",        0, "/mois"],
                    ["dépense","courante","courses",                0, "/sem."],
                    ["dépense","courante","sport et culture",       0, "/an"],   
                    ["recette","divers","salaire",                  0, "/mois"],
                    ["recette","divers","aides",                    0, "/mois"]      
        
                ];

//banqueCopie = JSON.parse(JSON.stringify(banque));
const POSTE = 0, TYPE = 1, LIBELLE = 2, MONTANT = 3, PERIODE = 4;
const DEPENSES = 0, DEPFIXES = 1, DEPCOURANTES = 2, DEPOCCASIONNELLES = 3, DEPAUTRES = 4, RECETTES = 5, EPARGNE = 6; 

//Init affichage :
const divDepensesFixes = document.getElementById("div-depenses-fixes");
const divDepensesCourantes = document.getElementById("div-depenses-courantes"); 
const divRecettes = document.getElementById("div-recettes");

const inTotalDepenses = document.getElementById("in-total-depenses");
const inTotalDepensesFixes = document.getElementById("in-total-depenses-fixes");
const inTotalDepensesCourantes = document.getElementById("in-total-depenses-courantes");
const inTotalRecettes = document.getElementById("in-total-recettes");

const inMontants = document.getElementsByClassName("in-montant");

var budgetDemande = false;


afficher(banque);
for(i=0;i<inMontants.length;i++) inMontants[i].value="0";

function afficher(tableau){
    for(i=0;i<tableau.length;i++){
        switch (tableau[i][POSTE]){
            case "dépense" :
                switch (tableau[i][TYPE]){
                    case "fixe" : 
                        divDepensesFixes.innerHTML+=
                        '<div class="row"><div class="col-7"><p>'
                        + tableau[i][LIBELLE]
                        + '</p></div><div class="col-3"><input type="text" class="in-montant"></div><div class="col-2"><p>'
                        + tableau[i][PERIODE]
                        + '</p></div></div>';
                    break;
                    case "courante" :
                        divDepensesCourantes.innerHTML+=
                        '<div class="row"><div class="col-7"><p>'
                        + tableau[i][LIBELLE]
                        + '</p></div><div class="col-3"><input type="text" class="in-montant"></div><div class="col-2"><p>'
                        + tableau[i][PERIODE]
                        + '</p></div></div>';
                    break;
                }
            break;
            case "recette" :
                        divRecettes.innerHTML+=
                        '<div class="row"><div class="col-7"><p>'
                        + tableau[i][LIBELLE]
                        + '</p></div><div class="col-3"><input type="text" class="in-montant"></div><div class="col-2"><p>'
                        + tableau[i][PERIODE]
                        + '</p></div></div>';
            break;
        }
    }
}

//Bouton RAZ :
const btRaz = document.getElementById("bt-raz");

const inEpargneMontant = document.getElementById("in-epargne-montant");
const inDebitDepenses = document.getElementById("in-debit-depenses");
const inDebitEpargne = document.getElementById("in-debit-epargne");
const inCreditRecettes = document.getElementById("in-credit-recettes");

btRaz.addEventListener("click", function(){
    for(i=0;i<inMontants.length;i++){
        inMontants[i].value="0";
    }
    for(i=0;i<banqueBis.length;i++){
        banqueBis[i][MONTANT]=0;
    }
}, false);

var tabTotaux = [0, 0, 0, 0, 0, 0, 0];
function totaux(){
    
    //Calcul de la somme des différents inputs :
    var totalDepensesFixes = 0;
    var elements = divDepensesFixes.getElementsByTagName('input');
    var libelle="";
    for(i=0;i<elements.length;i++) {
        //Calcul de la somme :
        totalDepensesFixes+= Number(elements[i].value);

        //Maj de banqueBis avec le montant de l'input. Il faut :
        //1) Récupérer le libellé :
        libelle="";
        libelle = elements[i].parentElement.parentElement.children[0].children[0].innerHTML;
        //2) Récupérer le i de banqueBis en recherchant ce libellé dans banqueBis :
        for(j=0;j<banqueBis.length;j++) {
            //3) Maj le montant dans banqueBis :
            if (banqueBis[j][LIBELLE] == libelle) banqueBis[j][MONTANT] = Number(elements[i].value);
        }
    }
    //Affichage de la somme :
    inTotalDepensesFixes.value = totalDepensesFixes;
    //Maj du tableau des sommes :
    tabTotaux[DEPFIXES] = Number(totalDepensesFixes);

    var totalDepensesCourantes = 0;
    var elements = divDepensesCourantes.getElementsByTagName('input');
    var k = -1;
    for(i=0;i<elements.length;i++) {
        //Maj de banqueBis avec le montant de l'input. Il faut :
        //1) Récupérer le libellé :
        libelle="";
        libelle = elements[i].parentElement.parentElement.children[0].children[0].innerHTML;
        //2) Récupérer le i de banqueBis en recherchant ce libellé dans banqueBis :
        k=-1;
        for(j=0;j<banqueBis.length;j++) {
            //3) Maj le montant dans banqueBis :
            if (banqueBis[j][LIBELLE] == libelle) {
                banqueBis[j][MONTANT] = Number(elements[i].value);
                k=j;
            }
        }
        //Calcul de la somme :
        switch (banqueBis[k][PERIODE]){
            case "/mois" : 
                totalDepensesCourantes+= Number(elements[i].value);
            break;
            case "/an" :
                totalDepensesCourantes+= Number(elements[i].value)/12;
            break;
            case "/sem." :
                totalDepensesCourantes+= Number(elements[i].value)*365/(7*12);
            break;
            
            default : alert("Cette PERIODE n'est pas connue");
        }
//???? à généraliser
        
        
        
    }
    //Affichage de la somme :
    inTotalDepensesCourantes.value = totalDepensesCourantes;
    //Maj du tableau des sommes :
    tabTotaux[DEPCOURANTES] = totalDepensesCourantes;

    inTotalDepenses.value = totalDepensesCourantes + totalDepensesFixes;
    tabTotaux[DEPENSES] = Number(totalDepensesCourantes) + Number(totalDepensesFixes) ;

    var totalRecettes = 0;
    var elements = divRecettes.getElementsByTagName('input');
    for(i=0;i<elements.length;i++) {
        //Calcul de la somme :
        totalRecettes+= Number(elements[i].value);

        //Maj de banqueBis avec le montant de l'input. Il faut :
        //1) Récupérer le libellé :
        libelle="";
        libelle = elements[i].parentElement.parentElement.children[0].children[0].innerHTML;
        //2) Récupérer le i de banqueBis en recherchant ce libellé dans banqueBis :
        for(j=0;j<banqueBis.length;j++) {
            //3) Maj le montant dans banqueBis :
            if (banqueBis[j][LIBELLE] == libelle) banqueBis[j][MONTANT] = Number(elements[i].value);
        }
    }
    //Affichage de la somme :
    inTotalRecettes.value = totalRecettes;
    //Maj du tableau des sommes :
    tabTotaux[RECETTES] = Number(totalRecettes);

    if(budgetDemande) calculerBudget();
}
const btCalculerBudget = document.getElementById("bt-calculer-budget");
const divCalculerBudget = document.getElementById("div-calculer-budget");
divCalculerBudget.style.display="none";
btCalculerBudget.addEventListener("click", function(){
    if(!budgetDemande){
        budgetDemande = true;
        divCalculerBudget.style.display="block";
        calculerBudget();
    }
    else {
        budgetDemande = false;
        divCalculerBudget.style.display="none";
    }
}, false);

const divRouge = document.getElementById("div-rouge");
const divVerte = document.getElementById("div-verte");
const divEquilibre = document.getElementById("div-equilibre");
const inRouge = document.getElementById("in-rouge");
const inVert = document.getElementById("in-vert");

divVerte.style.display="none";
divRouge.style.display="none";
divEquilibre.style.display="none";

function calculerBudget(){
    var debit = 0, credit = 0;
    
    inDebitDepenses.value = tabTotaux[DEPENSES];
    inDebitEpargne.value = tabTotaux[EPARGNE];
    debit = tabTotaux[DEPENSES] + tabTotaux[EPARGNE];
    inCreditRecettes.value = tabTotaux[RECETTES];
    credit = tabTotaux[RECETTES];
    if(debit - credit > 0){
        inRouge.value = debit;
        divRouge.style.display="block";
        divVerte.style.display="none";
        divEquilibre.style.display="none";
    }
    else if (debit - credit < 0){
        inVert.value = credit;
        divVerte.style.display="block";
        divRouge.style.display="none";
        divEquilibre.style.display="none";
    }
    else{
        divVerte.style.display="none";
        divRouge.style.display="none";
        divEquilibre.style.display="block";
    }
}

const inDepensesFixes = divDepensesFixes.querySelectorAll("input");
for(i=0;i<inDepensesFixes.length;i++){
    inDepensesFixes[i].addEventListener("change",totaux);
}
const inDepensesCourante = divDepensesCourantes.querySelectorAll("input");
for(i=0;i<inDepensesCourante.length;i++){
    inDepensesCourante[i].addEventListener("change",totaux);
}
const inRecettes = divRecettes.querySelectorAll("input");
for(i=0;i<inRecettes.length;i++){
    inRecettes[i].addEventListener("change",totaux);
}
inEpargneMontant.addEventListener("change", function(){
    tabTotaux[EPARGNE] = Number(inEpargneMontant.value);
    if(budgetDemande) calculerBudget();
}, false);









/*
const iTexte = document.getElementById("i-texte"); 
const btEnregistrer = document.getElementById("bt-enregistrer");
var banque = [];
const divMessage = document.getElementById("div-message");
divMessage.innerHTML="Faites au moins 10 saisies";
iTexte.focus();

const SEUIL = 10;
var seuilOk = false;

const p5evaleur = document.getElementById("p-5evaleur");
const pValaleaPc = document.getElementById("p-valalea-pc");

const btVotrevalalea = document.getElementById("bt-votrevalalea"); 
const pVotrevalalea = document.getElementById("p-votrevalalea");

const btTableau = document.getElementById("bt-tableau");
const divTableau = document.getElementById("div-tableau");
var tableauDemande = false; 
const btSuptableau = document.getElementById("bt-suptableau"); 

const btSupsaisie = document.getElementById("bt-supsaisie"); 


btEnregistrer.addEventListener("click", function(){
    banque.push(iTexte.value);
    if(banque.length === SEUIL) {
        seuilOk = true;
        p5evaleur.innerHTML=banque[4];
        divMessage.innerHTML="";
    }
    if(banque.length >= SEUIL){
       //val aléa PC :
       pValaleaPc.innerHTML=banque[Math.floor(Math.random() * (banque.length - 1))];

       if(tableauDemande) afficher(banque);
    }
    iTexte.value="";
    iTexte.focus();
}, false);

function traiterSeuilKo(){
    p5evaleur.innerHTML="";
    pValaleaPc.innerHTML="";
    divTableau.innerHTML="";
    divMessage.innerHTML="Faites au moins 10 saisies";
    tableauDemande = false; 
}

btVotrevalalea.addEventListener("click", function(){
    if(seuilOk) {
        pVotrevalalea.innerHTML=banque[Math.floor(Math.random() * (banque.length - 1))];
        iTexte.focus();
    }
    else iTexte.focus();
}, false);

btTableau.addEventListener("click", function(){
    if(seuilOk) {
        afficher (banque);
        iTexte.focus();
    }
    else iTexte.focus();
}, false);
function afficher(tableau){
    divTableau.innerHTML="";
    for(i=0;i<tableau.length;i++) divTableau.innerHTML+="<p>"+i+" - "+tableau[i]+"</p>";
}

btTableau.addEventListener("click", function(){
    if(seuilOk) {
        divTableau.innerHTML="";
        for(i=0;i<banque.length;i++) divTableau.innerHTML+="<p>"+i+" - "+banque[i]+"</p>";
        iTexte.focus();
        tableauDemande = true; 
    }
    else iTexte.focus();
}, false);

btSuptableau.addEventListener("click", function(){
    if(seuilOk) {
        banque=[];
        divTableau.innerHTML="";
        iTexte.focus();
    }
    else iTexte.focus();
}, false);

btSupsaisie.addEventListener("click", function(){
    banque.pop();
    if(banque.length < SEUIL) traiterSeuilKo();
    else{
        if(tableauDemande) afficher(banque);
        pValaleaPc.innerHTML=banque[Math.floor(Math.random() * (banque.length - 1))];
        pVotrevalalea.innerHTML="";
    }
    iTexte.focus();
}, false);
*/
