// Kummankin kortit
var oma = [[], [], [], []];
var vas = [[], [], [], []];

// Visuaaliset koodit
var omakoodit = [];
var vaskoodit = [];

// Vuoro ja puolustus/hyökkäys tiedot
var vuoro;
// Oman ja tietokoneen tiedot siihen, että pitääkö puolustaa vai hyökätä
var puohuo = 0;
var vaspuohuo = 0;

// Viimeisimmät kortit kummaltakin
var vasviime = [0, 0];
var omaviime = [0, 0];

var korttimaarat = [0, 0];

// Kierrosjärjestelmään
var kierros = 0;
var voitot = [0, 0];
var nimet = ["", "Tikki", "Korvat", "Voittaja"];

var vaikeus;

// Korttien arpominen ja jako pakasta
function jaa(){
    // Käytetyt kortit lista
    var used = [];

    // Lisää kymmenen korttia, viisi itselle, loput viisi koneelle
    for(var i = 0; i < 10; i++){
        // While rakenne siltä varalta, että arvotaan kortti joka jo on tullut
        while(true){
            // Arvotaan kortti ja otetaan sille koodi
            // Koodi helpottaa käytetyjen korttien katsomista ja kuvan hakemista peliä varten
            var arvottu = [getRandomInt(0, 3), getRandomInt(2, 14)];
            var koodi = arvottu[0].toString() + arvottu[1].toString();

            // Katsotaan että onko korttia käytetty, jos on, niin arvotaan uudestaan
            if(!used.includes(koodi)){ 
                // Jos kortti pistetään itselle
                if(i < 5){
                    omakoodit.push(koodi);
                    oma[arvottu[0]].push(arvottu[1]);
                // Jos kortti laitetaan koneelle
                }else{
                    vas[arvottu[0]].push(arvottu[1]);
                    vaskoodit.push(koodi);
                }
                
                // Kummassakin tapauksessa kortti lisätään käytettyjen korttien joukkoon
                used.push(koodi);
                break;
            }
        }
    }

    console.log(oma, omakoodit, vas);

    // Visuaalinen puoli
    for(var i = 0; i < 5; i++){
        // Antaa jokaiselle kuvalle lähteeksi tyhjän sijasta oikean korttikuvan cards kansiosta
        document.getElementById("oma" + (i + 1).toString()).src = "cards/" + omakoodit[i] + ".svg";
    }

    // Pistetään satunnainen aloitusvuoro
    vuoro = getRandomInt(1, 2);
    console.log(vuoro);

    vuorotiedotus(vuoro);
}

var edel = [];

// Suoritutuu kun pelaaja klikkaa kortista
function pelaakortti(num){
    // Katsotaan mikä kortti on kyseessä ja pistetään muotoon, jota on helppo lukea
    var kortti = [];
    // Oletus on, että oman vuoron jälkeen on vastustajan vuoro
    var vuoronyt = 2;
    kortti.push(eval(omakoodit[num][0]));

    // Katsotaan, että onko koodin pituus 2 vai kolme merkkiä
    if(omakoodit[num].length > 2){
        kortti.push(eval((omakoodit[num][1] + omakoodit[num][2])));
    }else{
        kortti.push(eval(omakoodit[num][1]));
    }

    // Tarkastus, että voidaanko korttia pelata
    var sallittu = 0;

    if(vuoro == 1){
        // Onko kyseessä hyökkäys vai puolustus
        if(puohuo == 0){
            sallittu = 1;
            vaspuohuo = 1;
            console.log("ITSE HYÖKKÄÄ");
        }else if(puohuo == 1){
            // Katsotaan, että onko pelaajalla maata, mitä kysytään
            if(sumArray(oma[vasviime[0]]) > 0){
                // Jos maata on, niin  katsotaan, että onko pelattu kortti sitä (jos on niin se sallitaan)
                if(kortti[0] == vasviime[0]){
                    sallittu = 1;
                    // Jos oma kortti on samaa maata ja isompi, niin saa itse jatkaa eli vuoro säilyy itsellä
                    if(kortti[1] > vasviime[1]){
                        vuoronyt = 1;
                        puohuo = 0;
                        console.log("ITSE VOITTI JA SAA JATKAA");
                    }else{
                        vaspuohuo = 0;
                        vuoronyt = 2;
                        console.log("ITSE HÄVISI SAMALLA MAALLA")
                    }
                }
            // Jos maata ei ole, mikä tahansa kortti sallitaan    
            }else{
                sallittu = 1;
                vaspuohuo = 0;
                console.log("ITSE PELAA MILLÄ TAHANSA MAALLA KOSKA EI OMISTA KYSYTTYÄ")
            }
        }
    }

    console.log("Sallittu: ", sallittu);

    // Varsinainen kortin pelaus
    if(sallittu == 1){
        // Päivitetään omaviime tietokoneen pelausta varten
        omaviime = kortti;
        // Muutetaan käytetty kortti nollaksi, eli ei enää ole käytössä
        oma[kortti[0]][oma[kortti[0]].indexOf(kortti[1])] = 0;

        console.log("Oma kortti: ", kortti);

        // Visuaalinen näyttö pelissä
        document.getElementById("oma" + (num + 1).toString()).style.position = "absolute";
        document.getElementById("oma" + (num + 1).toString()).style.top = "-110%";
        document.getElementById("oma" + (num + 1).toString()).style.left = "70%";

        // Pistää edelliset pelatut kortit pois tieltä
        for(var i = 0; i < edel.length; i++){
            document.getElementById(edel[i]).style.display = "none";
        }
        edel.push("oma" + (num + 1).toString());

        vuorotiedotus(vuoronyt);

        // Voiton ja häivön katsominen puolustus/hyökkäys tietojen perusteella
        korttimaarat[0] += 1;
        if(korttimaarat[0] == 5 && korttimaarat[1] == 5){
            if(puohuo == 0){
                console.log("OMA VOITTI");
                document.getElementById("vuoro").innerHTML = "Voitit";
                kierrostapahtuma(0);
            }else{
                console.log("TIETOKONE VOITTI");
                document.getElementById("vuoro").innerHTML = "Hävisit";
                kierrostapahtuma(1);
            }
        }
    }

    
}


// Vuoro ja tiedotushallinta
function vuorotiedotus(vuorotieto){
    vuoro = vuorotieto;

    // Laitetaan vuoron teksti näkyviin
    if(vuorotieto == 1){
        document.getElementById("vuoro").innerHTML = "Sinun vuoro";
    }else if(vuorotieto == 2){
        document.getElementById("vuoro").innerHTML = "Vastustajan vuoro";
        // Katsotaan, että pelataanko vaikealla vai helpolla tasolla ja pistetään funktio liikkeelle
        if(vaikeus == 0){
            setTimeout(function(){alkeellinen_tietokone();}, 1000);
        }else{
            setTimeout(function(){haastava_tietokone();}, 1000);
        }
    }
}

function kaikkiarvonta(){
    // Lista kaikista korteista helpottaa arvontaa kaikista
    var tempar = [];

    // Lisätään listaan kaikki vas listassa olevat kortit, joita ei ole käytetty
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < vas[i].length; j++){
            if(vas[i][j] != 0){
                tempar.push([i, vas[i][j]]);
            }
        }
    }

    // Arvotaan kortti ja valitaan se
    var valnum = getRandomInt(0, tempar.length - 1);
    return tempar[valnum];
}


var lask = 1;
function alkeellinen_tietokone(){
    var vuoronyt = 0;
    var valkortti = [0, 0];
    // Jos kyseessä on puolustus
    if(vaspuohuo == 1){
        // Jos omistaa kysyttyä maata
        if(sumArray(vas[omaviime[0]]) > 0){  
            valkortti[0] = omaviime[0];

            // Arvotaan satunnainen kortti kysytystä maasta, jos kortti ei ole käytetty, se menee läpi
            var temp = 0;
            while(true){
                temp = getRandomInt(0, vas[omaviime[0]].length - 1);
                if(vas[omaviime[0]][temp] != "!"){
                    break;
                }
            }

            // Asetetaan arvottu kortti valituksi kortiksi
            valkortti[1] = vas[omaviime[0]][temp];

            // Jos voitti pelaajan kortin, niin saa jatkaa
            if(valkortti[1] > omaviime[1]){
                vuoronyt = 2;
                vaspuohuo = 0;
                console.log("VIHOLLINEN VOITTI SAMALLA MAALLA");
            }else{
                console.log("VIHOLLINEN HÄVISI SAMALLA MAALLA");
                puohuo = 0;
                vuoronyt = 1;
            }
        }else{
            // Arvotaan satunnainen kortti
            valkortti = kaikkiarvonta();
            vuoronyt = 1;
            puohuo = 0;
            console.log("VIHOLLINEN PISTÄÄ SATUNNAISE KORTIN KOSKA EI OMISTA MAATA");
        }
    }else{
        // Arvotaan satunnainen kortti hyökkäystä varten
        valkortti = kaikkiarvonta();
        vuoronyt = 1;
        puohuo = 1;
        console.log("VIHOLLINEN HYÖKKÄÄ");
    }

    tietokone_loppu(valkortti, vuoronyt);

}

// Korttimäärät ja voittokataus pitää tehdä funktioksi koodirivien säästämisen vuoksi

// Pienin kortti tietokoneelta
function pieninkatsaus(){
    // Jos ei omista kysyttyä maata
    var pienin = [0, 15];

    // Katsotaan pienin kortti itseltä
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < vas[i].length; j++){
            if(vas[i][j] < pienin[1]){
                pienin = [i, vas[i][j]];
            }
        }
    }

    return pienin;
}

function tietokone_loppu(valkortti, vuoronyt){
    // Kortin virallinen pelaus
    vasviime = valkortti;
    vas[valkortti[0]].splice([vas[valkortti[0]].indexOf(valkortti[1])], 1);

    // Visuaalinen näyttö
    document.getElementById("vas" + (lask).toString()).style.position = "absolute";
    document.getElementById("vas" + (lask).toString()).style.top = "110%";
    document.getElementById("vas" + (lask).toString()).style.left = "10%";
    document.getElementById("vas" + (lask).toString()).src = "cards/" + valkortti[0].toString() + valkortti[1].toString() + ".svg";

    // Laskemsita kortteja varten (se, että mikä kortin takapuoli viholliselta poistuu ei ole väliä)
    lask += 1;

    vuorotiedotus(vuoronyt);

    // Voiton ja häviön katsominen puolustus/hyökkäys tietoejn perusteella
    korttimaarat[1] += 1;
    if(korttimaarat[0] == 5 && korttimaarat[1] == 5){
        if(vaspuohuo == 0){
            console.log("TIETOKONE VOITTI");
            document.getElementById("vuoro").innerHTML = "Hävisit";
            kierrostapahtuma(1);
        }else{
            console.log("ITSE VOITTI");
            document.getElementById("vuoro").innerHTML = "Voitit";
            kierrostapahtuma(0);
        }
    }
}

// Kehittyneempi tietokone vastustaja
function haastava_tietokone(){
    var vuoronyt = 0;
    var valkortti = [0, 0];

    // Jos kyseessä on puolustus
    if(vaspuohuo == 1){
        // Jos omistaa kysyttyä maata
        if(sumArray(vas[omaviime[0]]) > 0){
            // Valitaan kortti tästä maasta
            valkortti[0] = omaviime[0];
            // Katsotaan, että millä korteilla saa kiinni
            var isommat = [];
            for(var i = 0; i < vas[omaviime[0]].length; i++){
                if(vas[omaviime[0]][i] > omaviime[1]){
                    isommat.push(vas[omaviime[0]][i]);
                }
            }
            console.log(isommat);

            // Jos on isompia kortteja, isommista korteista valitaan pienin, jos ei, niin pienimmistä korteista valitaan pienin
            if(isommat.length > 0){
                valkortti[1] = Array.min(isommat);
                console.log("VIHOLLINEN VOITTI SAMALLA MAALLA");
                vaspuohuo = 0;
                vuoronyt = 2;
            }else{
                valkortti[1] = Array.min(vas[omaviime[0]]);
                console.log("VIHOLLINEN HÄVISI SAMALLA MAALLA");
                puohuo = 0;
                vuoronyt = 1;
            }

            console.log(valkortti);
        }else{
            valkortti = pieninkatsaus();
            console.log(valkortti);
            console.log("VIHOLLINEN PISTÄÄ PIENIMMÄN KORTIN KOSKA EI OMISTA MAATA");
            vuoronyt = 1;
            puohuo = 0;
        }
    }else{
        valkortti = pieninkatsaus();
        console.log(valkortti);     
        console.log("VIHOLLINEN PISTÄÄ PIENIMMÄN KORTIN KOSKA HYÖKKÄÄ");
        vuoronyt = 1;
        puohuo = 1;   
    }

    tietokone_loppu(valkortti, vuoronyt);

}

// Hallinnoi kierrosten vaihtumista
function kierrostapahtuma(voittaja){
    // Odottaa sekunnin kierrosten välissä, jotta "voitit" tai "hävisit" ruutu kierrosten välissä ehtii näkyä
    setTimeout(function(){
        kierros += 1;
        voitot[voittaja] += 1;

        document.getElementById("kierros").innerHTML = "Kierros " + kierros;
        document.getElementById("omavoitot").innerHTML = "Sinä: " + nimet[voitot[0]];
        document.getElementById("vasvoitot").innerHTML = "Vastustaja: " + nimet[voitot[1]];

        // Muuttujien resetointi
        oma = [[], [], [], []];
        vas = [[], [], [], []];
        omakoodit = [];
        vaskoodit = [];
        vuoro;
        puohuo = 0;
        vaspuohuo = 0;
        vasviime = [0, 0];
        omaviime = [0, 0];
        korttimaarat = [0, 0];    
        edel = [];
        lask = 1;

        // Laitetaan kortit takaisin riviin
        if(voitot[0] != 3 && voitot[1] != 3){
            for(var i = 1; i < 6; i++){
                document.getElementById("oma" + i.toString()).style.display = "block";
                document.getElementById("oma" + i.toString()).style.position = "absolute";
                document.getElementById("oma" + i.toString()).style.top = "0%";
                document.getElementById("oma" + i.toString()).style.left = (i * 15 - 10).toString() + "%";

                document.getElementById("vas" + i.toString()).style.display = "block";
                document.getElementById("vas" + i.toString()).style.position = "absolute";
                document.getElementById("vas" + i.toString()).style.top = "0%";
                document.getElementById("vas" + i.toString()).style.left = (i * 15 - 10).toString() + "%";
                document.getElementById("vas" + i.toString()).src = "cards/back.svg";
            }
        }else{
            document.getElementById("vuoro").style.display = "none";
            document.getElementById("tapahtuma").style.position = "absolute";
            document.getElementById("tapahtuma").style.top = "-5%";
            if(voitot[0] == 3){
                document.getElementById("tapahtuma").innerHTML = "Voitit pelin";
            }else{
                document.getElementById("tapahtuma").innerHTML = "Hävisit pelin";
            }
        }

        // Jaetaan pakka
        jaa();
        
    }, 1000);
}

function tietokonehaastavuus(vaikeustaso){
    vaikeus = vaikeustaso;
}

