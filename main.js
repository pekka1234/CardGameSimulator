// Satunnaisluku generaattori
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Summa lista elementeistä
function sumArray(array) {
    for (
      var
        index = 0,              // The iterator
        length = array.length,  // Cache the array length
        sum = 0;                // The total amount
        index < length;         // The "for"-loop condition
        sum += array[index++]   // Add number on each iteration
    );
    return sum;
}

// Listan pienin numero
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

  
// Katku pelin hallinta
function katku(vaikeustaso){
    // Vaihtaa aloitusvalikosta katku peliin
    document.getElementById("aloitus").style.display = "none";
    document.getElementById("katku").style.display = "block";
    document.body.style.backgroundColor = "#047a29";

    // Asettaa visuaalisesti kortteja
    for(var i = 1; i < 6; i++){
        document.getElementById("vas" + i.toString()).style.position = "absolute";
        document.getElementById("vas" + i.toString()).style.top = "0%";
        document.getElementById("vas" + i.toString()).style.left = (i * 15 - 10).toString() + "%";

        document.getElementById("oma" + i.toString()).style.position = "absolute";
        document.getElementById("oma" + i.toString()).style.top = "0%";
        document.getElementById("oma" + i.toString()).style.left = (i * 15 - 10).toString() + "%";
    }

    // Lähettää tiedon vaikeustasosta eteenpäin
    tietokonehaastavuus(vaikeustaso);

    // Jakaa kortit
    jaa();
}