/*
 * Create a list that holds all of your cards
 */
const cardArray = ['fa-anchor','fa-anchor','fa-bicycle','fa-bicycle','fa-bolt','fa-bolt',
  'fa-bomb','fa-bomb','fa-cube','fa-cube','fa-diamond','fa-diamond','fa-leaf','fa-leaf',
  'fa-paper-plane-o', 'fa-paper-plane-o'];
const openCard = [false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false];

const deck = document.querySelector('ul.deck');
const moveText = document.querySelector('span.moves');
let moveNum = 0;
let firstCard = null; // an object storing the element and its index in the deck
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function initialDeck() {
  shuffle(cardArray);
  openCard.forEach(function(ele, index, array) {
    array[index] = false;
  });
  for (let i = 0; i < 16; i++) {
    let newCard = document.createElement('li');
    newCard.innerHTML = `<i class="fa ${cardArray[i]}"></i>`;
    newCard.classList.add('card');
    deck.appendChild(newCard);
  }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

initialDeck();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function changeMoveText() {
  moveText.innerHTML = moveNum;
}

function findCardIndex (card) {
  let matchIndex = 0;
  card.parentElement.childNodes.forEach(function (ele, index){
    if (ele === card) {
      matchIndex = index - 1;
    }
  });
  return matchIndex;
}

function displayCard(card, index) {
  card.classList.add('open', 'show');
  openCard[index] = true;
}

function cardsMatch(firstCardAndIndex, secondCard) {
  firstCardAndIndex.card.classList.add('match');
  firstCardAndIndex.card.classList.remove('open', 'show');
  secondCard.classList.add('match');
  secondCard.classList.remove('open', 'show');
}

function hideCard(firstCard, secondCard, secondIndex) {
  console.log('here');
  firstCard.card.classList.remove('open', 'show');
  secondCard.classList.remove('open', 'show');
  openCard[firstCard.cardIndex] = false;
  openCard[secondIndex] = false;
}

function toggleCard(event) {
  const card = event.target;
  const cardIndex = findCardIndex(card);
  console.log(cardIndex);
  if (openCard[cardIndex]) {
    return;
  }
  moveNum++;
  changeMoveText();
  displayCard(card, cardIndex);
  if (firstCard === null) { // the first in a guess round
    firstCard = {card, cardIndex};
  } else { // the second in a guess round
    if (firstCard.card.firstChild.className === card.firstChild.className) { // founc the same card
      cardsMatch(firstCard, card);
      firstCard = null;
    } else {
      setTimeout(function(){
        hideCard(firstCard, card, cardIndex);
        firstCard = null;
      }, 1000);
    }
  }
  console.log(openCard);
}

deck.addEventListener('click', toggleCard);
