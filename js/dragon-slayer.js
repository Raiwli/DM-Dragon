'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/



/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/




/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/

'use strict';

// Utilisation des fonctions utilitaires : getRandomInteger, throwDices, requestInteger
(function() {
    // Choix de la difficulté
    const difficultyMap = {1: 'facile', 2: 'normal', 3: 'difficile'};
    let diffChoice = requestInteger(
        'Choisissez la difficulté :\n1 - Facile\n2 - Normal\n3 - Difficile',
        1, 3
    );
    const difficulty = difficultyMap[diffChoice];

    // Choix de la classe du héros
    const classMap = {1: 'chevalier', 2: 'voleur', 3: 'mage'};
    let classChoice = requestInteger(
        'Choisissez votre classe :\n1 - Chevalier\n2 - Voleur\n3 - Mage',
        1, 3
    );
    const heroClass = classMap[classChoice];

    // Génération des points de vie de départ
    let dragonHP, playerHP;
    switch (difficulty) {
        case 'facile':
            dragonHP = 100 + throwDices(5, 10);
            playerHP = 100 + throwDices(10, 10);
            break;
        case 'normal':
            dragonHP = 100 + throwDices(10, 10);
            playerHP = 100 + throwDices(10, 10);
            break;
        case 'difficile':
            dragonHP = 100 + throwDices(10, 10);
            playerHP = 100 + throwDices(7, 10);
            break;
    }
    const initialDragonHP = dragonHP;
    const initialPlayerHP = playerHP;

    // Fonction utilitaire pour afficher l'état d'un joueur
    function renderState(name, currentHP, initialHP) {
        let imgName;
        if (currentHP <= 0) {
            imgName = name === 'player' ? 'knight-wounded.png' : 'dragon-winner.png';
        } else if (currentHP <= initialHP * 0.3) {
            imgName = name === 'player' ? 'knight-wounded.png' : 'dragon-wounded.png';
        } else {
            imgName = name === 'player' ? 'knight.png' : 'dragon.png';
        }
        document.write('<figure class="game-state_player">');
        document.write('<img src="images/' + imgName + '" alt="' + (name === 'player' ? 'Chevalier' : 'Dragon') + '">');
        if (currentHP > 0) {
            document.write('<figcaption>');
            document.write('<progress max="' + initialHP + '" value="' + currentHP + '"></progress> ' + currentHP + ' PV');
            document.write('</figcaption>');
        } else {
            document.write('<figcaption>Game Over</figcaption>');
        }
        document.write('</figure>');
    }

    // Affichage des PV de départ
    document.write('<h3>PV de départ</h3>');
    document.write('<div class="game-state">');
    renderState('player', playerHP, initialPlayerHP);
    renderState('dragon', dragonHP, initialDragonHP);
    document.write('</div>');

    // Boucle de jeu
    let turn = 1;
    while (playerHP > 0 && dragonHP > 0) {
        // Initiative
        let heroInit = throwDices(10, 6);
        let dragonInit = throwDices(10, 6);
        // Bonus de voléur
        if (heroClass === 'voleur') {
            const bonusPct = throwDices(1, 6);
            heroInit += Math.floor(heroInit * bonusPct / 100);
        }

        let attacker, defender;
        if (heroInit >= dragonInit) {
            attacker = 'player'; defender = 'dragon';
        } else {
            attacker = 'dragon'; defender = 'player';
        }

        // Calcul des dégâts de base
        let baseDmg = throwDices(3, 6);
        let pctMod = 0;

        if (attacker === 'dragon') {
            // Modif selon difficulté
            if (difficulty === 'facile') pctMod -= throwDices(2, 6);
            if (difficulty === 'difficile') pctMod += throwDices(1, 6);
            // Bonus armure du chevalier
            if (heroClass === 'chevalier') pctMod -= throwDices(1, 10);
        } else {
            // Héros attaque
            if (difficulty === 'facile') pctMod += throwDices(2, 6);
            if (difficulty === 'difficile') pctMod -= throwDices(1, 6);
            // Bonus mage
            if (heroClass === 'mage') pctMod += throwDices(1, 10);
        }
        const dmg = Math.max(1, Math.floor(baseDmg * (1 + pctMod / 100)));

        // Mise à jour des PV
        if (attacker === 'dragon') {
            playerHP -= dmg;
        } else {
            dragonHP -= dmg;
        }

        // Affichage du tour
        document.write('<h3>Tour n°' + turn + '</h3>');
        document.write('<figure class="game-round">');
        const winImg = attacker === 'player' ? 'knight-winner.png' : 'dragon-winner.png';
        const altText = attacker === 'player' ? 'Chevalier vainqueur' : 'Dragon vainqueur';
        document.write('<img src="images/' + winImg + '" alt="' + altText + '">');
        const attackerName = attacker === 'player' ? 'Vous' : 'Le dragon';
        document.write('<figcaption>' + attackerName + ' atta' + (attacker === 'player' ? 'quez' : '') + 
                       (attacker === 'player' ? '' : 'e') + ' et infligez ' + dmg + ' points de dégât !</figcaption>');
        document.write('</figure>');

        // Affichage de l'état du jeu
        document.write('<div class="game-state">');
        renderState('player', playerHP, initialPlayerHP);
        renderState('dragon', dragonHP, initialDragonHP);
        document.write('</div>');

        turn++;
    }

    // Fin de la partie
    document.write('<footer>');
    document.write('<h3>Fin de la partie</h3>');
    document.write('<figure class="game-end">');
    if (playerHP > 0) {
        document.write('<figcaption>Vous avez vaincu le dragon !</figcaption>');
        document.write('<img src="images/knight-winner.png" alt="Chevalier vainqueur">');
    } else {
        document.write('<figcaption>Vous avez perdu le combat, le dragon vous a carbonisé !</figcaption>');
        document.write('<img src="images/dragon-winner.png" alt="Dragon vainqueur">');
    }
    document.write('</figure>');
    document.write('</footer>');
})();
