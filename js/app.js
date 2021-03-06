/*
 * Create a list that holds all of your cards
 */
const cardArray = ['fa-anchor','fa-anchor','fa-bicycle','fa-bicycle','fa-bolt','fa-bolt',
  'fa-bomb','fa-bomb','fa-cube','fa-cube','fa-diamond','fa-diamond','fa-leaf','fa-leaf',
  'fa-paper-plane-o', 'fa-paper-plane-o'];
const openCard = [false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false];

const deck = document.querySelector('ul.deck');
const stars = document.querySelector('ul.stars');
const moveText = document.querySelector('span.moves');
let moveNum = 0;
let firstCard = null; // an object storing the element and its index in the deck
let matchedCards = 0;
let lock = false;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function initialScorePanel() {
  moveText.innerHTML = 0;
  stars.childNodes.forEach(function(ele) {
    if (ele.nodeType === 1) {
      ele.innerHTML = '<i class="fa fa-star"></i>';
    }
  });
}

function initialDeck() {
  // clear deck first
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  matchedCards = 0;
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

initialScorePanel();
initialDeck();

/*
  * Add timer to game
 */
let time = 0;
let timer = null;
const showTime = document.querySelector('span.timer');

function padTime(num) {
  let numStr = num + '';
  if (numStr.length < 2) {
    numStr = '0' + numStr;
  }
  return numStr;
}

function formatTime(seconds) {
  let mins = parseInt(seconds / 60), secs = seconds % 60;
  return `${padTime(mins)}:${padTime(secs)}`
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  showTime.textContent = '00:00';
  time = 0;
  clearInterval(timer);
  timer = null;
}

function startTimer() {
  timer = setInterval(function(){
    time++;
    if (time >= 3599) {
      time = 0;
    }
    showTime.textContent = formatTime(time);
  }, 1000);
}

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

 function changeStar() {
   if (moveNum === 25) {
     const lastStar = stars.lastElementChild.firstElementChild;
     lastStar.classList.remove('fa-star');
     lastStar.classList.add('fa-star-o');
   }
   if (moveNum === 40) {
     const midStar = stars.childNodes[3].firstElementChild;
     midStar.classList.remove('fa-star');
     midStar.classList.add('fa-star-o');
   }
 }

function changeMove() {
  moveNum++;
  moveText.innerHTML = moveNum;
  changeStar();
}

function findCardIndex (card) {
  let matchIndex = 0;
  card.parentElement.childNodes.forEach(function (ele, index){
    if (ele === card) {
      matchIndex = index;
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
  matchedCards += 2;
  if (matchedCards === 16) { // player won! stop timer and go to results.
    stopTimer();
    showResultPage();
  }
}

function hideCard(firstCard, secondCard, secondIndex) {
  firstCard.card.classList.remove('open', 'show');
  secondCard.classList.remove('open', 'show');
  openCard[firstCard.cardIndex] = false;
  openCard[secondIndex] = false;
}

function toggleCard(event) {
  if (lock) { // user clicked again in the 1 second that's showing unmatching pairs
    return;
  }
  if (timer == null) {
    startTimer();
  }
  const card = event.target;
  const cardIndex = findCardIndex(card);
  if (openCard[cardIndex]) { // user clicked on an already opened card
    return;
  }
  changeMove();
  displayCard(card, cardIndex);
  if (firstCard === null) { // the first in a guess round
    firstCard = {card, cardIndex};
  } else { // the second in a guess round
    if (firstCard.card.firstChild.className === card.firstChild.className) { // founc the same card
      cardsMatch(firstCard, card);
      firstCard = null;
    } else { // not the same type of card
      lock = true; // add a lock
      setTimeout(function(){
        hideCard(firstCard, card, cardIndex);
        firstCard = null;
        lock = false; //remove the lock
      }, 1000);
    }
  }
}

deck.addEventListener('click', toggleCard);

/*
  * Reset the whole deck
 */

function resetDeck() {
  moveNum = 0;
  lock = false;
  firstCard = null;
  initialDeck();
  initialScorePanel();
  resetTimer();
}

document.querySelector('.fa-repeat').addEventListener('click', resetDeck);

/*
 * Reach victory
 */

const resultPage = document.querySelector('div.result');
resultPage.style.display = 'none';

function showResultPage() {
  document.querySelector('.container').style.display = 'none';
  resultPage.style.display = 'flex';
  showResults();
  return;
}

function showResults() {
  document.querySelector('.result-moves').textContent = moveNum;
  let starNum = 3;
  if (moveNum >= 40) {
    starNum = 1;
  } else if (moveNum >= 25) {
    starNum = 2;
  }
  document.querySelector('.result-stars').textContent = starNum;
  document.querySelector('.result-time').textContent = formatTime(time);
}

document.querySelector('.play-again').addEventListener('click', function(){
  resetDeck();
  resultPage.style.display = 'none';
  document.querySelector('.container').style.display = 'flex';
})
