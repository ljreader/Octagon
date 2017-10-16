//set date
let d = new Date();
let year = d.getFullYear();

$("#year").text(year);

//initialize global variables
var wrestle = false;
var chooseWrestler = false;
var userPinned = false;
var aiPinned = false;
var victim;
var attacker;
var winner;
var pinnedWrestler = [];
// Wrestler Oblects //
var HulkHogan = {
    hp: 100,
    attackPower: 9
}
var AndreTheGiant = {
    hp: 120,
    attackPower: 7
}
var TheUndertaker = {
    hp: 180,
    attackPower: 5
}
var TheUltimateWarrior = {
    hp: 150,
    attackPower: 6
}
var MrT = 
    hp: 125,
    attackPower: 8
}
var  LunaVachon= {
    hp: 155,
    attackPower: 5
}
var RayMysterio = {
    hp: 125,
    attackPower: 6
}
var MachoMan = {
    hp: 170,
    attackPower: 5
}


//manages click events on Jedi
//will only work during original Jedi selection
//or after user kills an opponent
$(".character").on("click", function() {
    //check for startgame conditions
    if (!(wrestle) && !(chooseWrestler)) {
        chooseWrestler = true; // flags that user needs to choose opponent next
        $(this).css("border-color", "#e9491e");
        $("#choose").html("Enemy"); //changes choose Jedi prompt
        attacker = $(this).detach(); // removes user from available
        attacker.appendTo("#active"); // adds user to battle
        console.log(attacker);
        $("#battle").fadeIn("slow");
    } else if (chooseWrestler) { //user is alive and needs a new opponent
        chooseWrestler = false;
        wrestle = true; //flags functionality of fight and reset buttons, disables characters
        $("#alerts").html(""); // clears any alerts, if any
        $(this).css("border-color", "#2053b3");
        victim = $(this).detach(); // removes opponent from available
        victim.appendTo("#under-attack"); // adds opponent to battle
        console.log(victim);
        $("#available").fadeOut("slow"); //hide available
        $("#fight").fadeIn("slow"); //show fight button
    } 
})

function reset() {
    // gets opponent to reinsert into available if the user lost
    if (userPinned) {
        winner = victim.detach();
    }
    wrestle = false;
    chooseWrestler = false;
    userPinned = false;
    aiPinned = false;
    // reattaches all pinnedWrestler (if any), including a dead user, back to available
    for (let x = 0; x < pinnedWrestler.length; x++) {
        pinnedWrestler[x].appendTo("#available");
    }
    //emptys pinnedWrestler array (perhaps there is function I could chain to above to do the same?)
    pinnedWrestler = [];
    winner.appendTo("#available"); //winner will either be user or opponent, attaches to available
    //reset display to start screen
    $("#alerts").html("");
    $("#choose").html("Character");
    $(".character").css("border-color", "#7D9403");
    $("#reset").fadeOut("slow");
    $("#battle").fadeOut("slow");
    //resets data on all Jedi to start conditions
    $("#HulkHogan").data("hp", HulkHogan.hp).find(".wrestlerPts").html(HulkHogan.hp);
    $("#HulkHogan").data("attack-power", HulkHogan.attackPower);

    $("#AndreTheGiant").data("hp", AndreTheGiant.hp).find(".wrestlerPts").html(AndreTheGiant.hp);;
    $("#AndreTheGiant").data("attack-power", AndreTheGiant.attackPower);

    $("#TheUndertaker").data("hp", TheUndertaker.hp).find(".wrestlerPts").html(TheUndertaker.hp);;
    $("#TheUndertaker").data("attack-power", TheUndertaker.attackPower);

    $("#TheUltimateWarrior").data("hp", TheUltimateWarrior.hp).find(".wrestlerPts").html(TheUltimateWarrior.hp);;
    $("#TheUltimateWarrior").data("attack-power", TheUltimateWarrior.attackPower);
// Mr T//
    $("#MrT").data("hp", HulkHogan.hp).find(".wrestlerPts").html(MrT.hp);
    $("#MrT").data("attack-power", MrT.attackPower);
// Luna Vachon//
    $("#LunaVachon").data("hp", LunaVachon.hp).find(".wrestlerPts").html(LunaVachon.hp);;
    $("#LunaVachon").data("attack-power", LunaVachon.attackPower);
// Ray Mysterio//
    $("#RayMysterio").data("hp", RayMysterio.hp).find(".wrestlerPts").html(RayMysterio.hp);;
    $("#RayMysterio").data("attack-power", RayMysterio.attackPower);
// Macho Man Randy Savage//
    $("#MachoManRandySavage").data("hp", MachoManRandySavage.hp).find(".wrestlerPts").html(MachoManRandySavage.hp);;
    $("#MachoManRandySavage").data("attack-power", MachoManRandySavage.attackPower);
    //only shows wrestler when they have reset
    $("#available").fadeIn("slow");
}

var transition;
function checkForWin () {
    //see if all seven of the other wrestlers have been pinned. (added to pinnedWrestler array)
    if (pinnedWrestler.length === 7) {
        function youWin() {
            $("#alerts").text(" Ahh Yaa!");
            $("#fight").fadeOut("fast"); //hide fight button
            $("#battle").fadeOut("fast"); //hide battle area
            $("#reset").fadeIn("slow"); //show start over button
            wrestle = false;
            //get winner out of attack position to be reinserted into available on reset
            winner = attacker.detach();
        }
        transition = setTimeout(youWin, 2000);
    } else { 
        $("#fight").fadeOut("slow"); // hide fight button
        $("#available").fadeIn("slow"); //show remaining available Jedi
        chooseWrestler = true;
    }
}

//calculates damage done by user before taking damage from opponent
function battle() {
    var vhp = parseInt(victim.data("hp")); // get victim hit points
    var attack = parseInt(attacker.data("attack-power")); // get user attack power 
    vhp-= attack; //decrease victim hit points
    victim.data("hp", vhp); //change data on victim hp
    $("#under-attack").find(".wrestlerPts").html(vhp); // display change in hp
    $("#alerts").html("You did " + attack + " damage to " + victim.data("name") +". ");
    attack+=attack; //update attack-power
    attacker.data("attack-power", attack); //change data on user attack power
    //check to see if victim has been killed
    if (vhp <= 0) {
        function wrestlerPinned() {
            pinnedWrestler.push(victim.detach());
            console.log(pinnedWrestler);
            $("#alerts").text(" And you got the pin!");
            //checks to see if all jedi are dead
            checkForWin();
        }
        transition = setTimeout(wrestlerPinned, 2000);
    } else {
        //this only runs if victim still alive. This calculates counter-damage
        var uhp = parseInt(attacker.data("hp")); // get user hit points
        var counterAttack = parseInt(victim.data("counter-attack")); // get victim counter
        uhp -= counterAttack; //decrease user hit points
        attacker.data("hp", uhp); //change data on user hp
        $("#active").find(".wrestlerPts").html(uhp); //display user hp
        $("#alerts").append(victim.data("name") + " did " + counterAttack + " damage to you.");
        //check to see if user has been killed
        if (uhp <= 0) {
            $("#alerts").text(" And he pinned you!");
            function userGotPinned() {
                userPinned = true;
                //store dead Jedi in an array
                pinnedWrestler.push(attacker.detach());
                console.log(pinnedWrestler);
                //go to end-game screen
                $("#fight").fadeOut("fast"); // hide fight button
                $("#battle").fadeOut("fast"); //hide battle area
                $("#reset").fadeIn("slow"); // show start over button
            }
            transition = setTimeout(userGotPinned, 2000);
        }
    }
}

// Attack and Start Over Buttons only active after players selected
// Start Over Button only visible after game won or game lost
$("button").on("click", function() {
    if (userPinned || !(wrestle)) {
        reset();
    } else {
        battle();
    }
})
