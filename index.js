//variables
let diller = [];
let player = [];
let dillerSum =0;
let playerSum = 0;
let card;
let card2;
let bet =0;
let countOfTokens = 3;
let redLine = true;
let statusOfVictory = false;

//querrySelectors

//btns
const btnStart = document.querySelector('.btnStart');
const btnSubmit = document.querySelector('.submit');
const btnTake = document.querySelector('.take');
const btnLetsGo = document.querySelector(".letsGo");
const finalBtn = document.querySelector(".finalBtn");
const finalBtn2 = document.querySelector(".finalBtn2");
const closeDialogBtn = document.querySelector(".closeDialogBtn");
const btncontinue = document.querySelector(".continue");
const btnsubmitFirstBet = document.querySelector(".submitFirstBet");
const btnmute = document.querySelector(".mute");
const btnRoules =document.querySelector(".btnRoules");
const closeBtn = document.querySelector(".closeBtn")
//
let dillerFeild = document.querySelector('.diller-feild');
let playerFeild = document.querySelector('.player-feild');
let board = document.querySelector('#board')
let jazz = document.querySelector('.jazz')
let roulsBar = document.querySelector(".roulsBar")

//dialog lose/win
const res = document.getElementById("results");
let finalMessage = document.querySelector(".finalmessage");
let finalScore = document.querySelector(".score");
let loseWinPicture = document.querySelector(".loseWinPicture");

//bets

let firstBet = document.querySelector(".first-bet");
let overlay = document.querySelector(".overlay");
let tokensScore = document.querySelector(".tokensScore");
let betField = document.querySelector(".betField");
let doThebets = document.querySelector("#doThebets");
let messageBets =document.querySelector('.messageBets')
let nextBetValue = document.querySelector(".next-bet");
let dialogTokens = document.querySelector(".dialog-tokens");
let dialogMessages = document.querySelector('#dialog-messages')
let dialogMessagesTitle = document.querySelector('.dialog-messages-title')
let roundPicture = document.querySelector(".roundPicture");
let infoTokens =  document.querySelector(".infoTokens");

//creating the deck
const suits = ['H', 'C', 'D', 'S']

const cards = [{name: 'A', weight: 11}, {name: 'K', weight:10 },
{name: 'Q', weight: 10}, {name: 'J', weight: 10}, {name: '10', weight: 10}, 
{name: '9', weight: 9}, {name: '8', weight: 8}, {name: '7', weight: 7}, {name: '6', weight: 6},
{name: '5', weight: 5}, {name: '4', weight: 4}, {name: '3', weight: 3}, {name: '2', weight: 2}]
const deck = []
for (let suit of suits) {
	for (let cardProto of cards) {
		deck.push({
			suit: suit,
			name: cardProto.name,
			weight: cardProto.weight
		})
	}
}



// event listeners
btnRoules.addEventListener('click', ()=> {
    roulsBar.classList.add("show-sidebar")
})

closeBtn.addEventListener('click', () => {
    roulsBar.classList.remove("show-sidebar")
})

closeDialogBtn.addEventListener('click', () => {
    dialogMessages.close()
})

btnLetsGo.addEventListener('click', () => { 
    btncontinue.classList.add("eventsNon")
    bet = parseInt(firstBet.value);
    if (bet!=0 && bet <= 3) {
        countOfTokens -= bet
        console.log(bet, countOfTokens, 'первая проверка')

      gsap.to(".overlay", { 
        y: -700 ,
        delay: 0.5, 
        duration: 2,
        opacity: .8,
        ease: "power1.out", 
        force3D: true
    })
   setTimeout(
    ()=> {
        overlay.classList.add('overlayOff')
}, 3000)

        writingBets()
        btnSubmit.classList.add("eventsNon")
        btnTake.classList.add("eventsNon")
    }
    else if (bet <= 0) {
        openMessagesDialogAndSetTitle('No bet - No game')
       
    }
    else {
        openMessagesDialogAndSetTitle('You dont have that many tokens!')
    }
})

btnStart.addEventListener('click', () => {
    btnSubmit.classList.remove("eventsNon")
    btnTake.classList.remove("eventsNon")

if(btnStart.classList.contains('start')) {

    btnStart.textContent = 'Restart'
    btnStart.classList.remove("start");
    btnStart.classList.add("restart");
    generateGame()
}
else {
   restart()
}
//

});

btncontinue.addEventListener('click', () =>{
    if(countOfTokens>0) {
        nextRound()
    }
    else{
        openMessagesDialogAndSetTitle('The casino has won')
    }
    btncontinue.classList.add("eventsNon")
})

btnTake.addEventListener('click', () => {
  
    playersTurn()
});


btnSubmit.addEventListener('click', () => {
    document.querySelector('.thinking').classList.add("active");
  btnSubmit.classList.add("eventsNon")
  btnTake.classList.add("eventsNon")
 
   setTimeout(() => {
    dillersTurn()
   }, 2000); 
});

finalBtn.addEventListener('click', function() {
    if(countOfTokens<=0) {
       setTimeout(() => {openMessagesDialogAndSetTitle('The casino has won')}, 2000)
       cleanEvrething()
       setTimeout(() => { 
         overlay.classList.remove('overlayOff');
         gsap.to(".overlay", { 
            y: 0 ,
            duration: 2,
            opacity: 1,
            ease: "power1.out", 
            force3D: true
        })
        }
         , 2000)
        }
    else if (countOfTokens>20) {
        setTimeout(() => {openMessagesDialogAndSetTitle('You beat the casino!')}, 2000)
        cleanEvrething()
        setTimeout(() => { 
            overlay.classList.remove('overlayOff');
            gsap.to(".overlay", { 
                y: 0 ,
                duration: 2,
                ease: "power1.out", 
                force3D: true
            }) }
            , 2000)
           }
        
    
        else{
            btncontinue.classList.add("eventsNon")
            tokensScore.innerHTML = countOfTokens;
            betField.innerHTML = '';
            dillerFeild.innerHTML = '';
            playerFeild.innerHTML = '';
            btncontinue.classList.remove("eventsNon")
    } 
})

finalBtn2.addEventListener('click', function() {
    bet = nextBetValue.valueAsNumber;
    if (bet <= countOfTokens) {
        countOfTokens-=bet
        writingBets()
        generateGame()
    } else {
    
  
    openMessagesDialogAndSetTitle ('You are too poor for this')
    }
    
})

/// functions
//shuffle the deck
function shuffleCards() {
    deck.sort(() => Math.random() - 0.5);
    return deck;
}

//handing out 2 cards for each side
function pickCard() {
   for (let i =0; i<2; i++){
        card = deck.shift()
        player.push(card)
        card2 = deck.shift()
        diller.push(card2)
         generateCards(i) 
    }
    calculatePoints()
    return player, diller
}
function generateCards(i) {

  const img = document.createElement("img");
  img.classList.add("cardImg");
  if (diller.length>1){
    img.src = "images/CardBackBlue2.png"
    img.classList.add("back");
    img.dataset.hidden = `cards/${diller[i].name}-${diller[i].suit}.png`
  } else {
      img.src = `cards/${diller[i].name}-${diller[i].suit}.png`;
 
  }
  dillerFeild.appendChild(img);

    const img2 = document.createElement("img");
    img2.classList.add("cardImg");  
    img2.src = `cards/${player[i].name}-${player[i].suit}.png`;
    playerFeild.appendChild(img2);

}

// calculate score that we have in the beginning
function calculatePoints() {
    for (let key of diller){
        dillerSum += key.weight
    }
    for (let key of player){
        playerSum += key.weight
    }
    console.log(dillerSum, playerSum)
}

//so player can't take card if he has score >21
//otherwise ge can or take cart or submit
function playersTurn()  {
    if( playerSum <21) {
      
        setTimeout(()=>
            {
                card = deck.shift()
                player.push(card)
                const img2 = document.createElement("img");
                img2.classList.add("cardImg");
                let n =player.length-1
                img2.src = `cards/${player[n].name}-${player[n].suit}.png`;
                playerFeild.appendChild(img2);
              playerSum += player[n].weight
              console.log(dillerSum, playerSum)
              if (player.length>4) {
                document.querySelector('.cardImg').style.margin = '.5rem';
                document.querySelector('.diller-feild').style.paddingLeft = '2rem';
                document.querySelector('.player-feild').style.paddingLeft = '2rem';
              }
              else{}
              return  playerSum
            },1000
        )
   
    }
    else {
        openMessagesDialogAndSetTitle("Maximum reached")
    }
}
function dealerSayHeTakes() {
    document.querySelector('.thinking').classList.remove("active");
    document.querySelector('.phrase').textContent = "I need one more card"
  }
function dealerSayHeDoesntTake() {
    document.querySelector('.thinking').classList.remove("active");
    document.querySelector('.phrase').textContent = "I don't need more cards, I'll smear you anyway"
  }
//by rouls of the game if diller has score<17 he should tske 1 more card
function dillersTurn() {
    if (dillerSum<17) {
         
        setTimeout(()=> {
            dealerSayHeTakes()   
    }, 2000)
    setTimeout(()=> {
       
        let card3 = deck.shift()
        diller.push(card3)
        console.log(card3, diller, 'посмотрим')
        const img3 = document.createElement("img");
        img3.classList.add("cardImg");
        let n = diller.length-1
        img3.src = `cards/${diller[n].name}-${diller[n].suit}.png`;
        dillerFeild.appendChild(img3);
      dillerSum += diller[n].weight
  
}, 5000)
  
    setTimeout(()=> {
        document.querySelector('.phrase').textContent = "Okay, Let's see who's the best here"
        flipCard() }, 7000)
    
      setTimeout(() => {
        compairFinalScore()
       }, 9000); 
    }
    else {
        setTimeout(()=> {
            dealerSayHeDoesntTake() }, 1000)
    
        setTimeout(()=> {
            document.querySelector('.phrase').textContent = "Okay, Let's see who's the best here"
            flipCard() }, 4000 )
        setTimeout(() => {
            compairFinalScore()   }, 7000); 
        }
    }

function flipCard() {
    let b = document.querySelector('.back');
    b.src= b.dataset.hidden // TODO CHANGE THIS HOW YOU NEED IT TO BE
}

function compairFinalScore () {
    btncontinue.classList.remove("eventsNon")

    if(playerSum > 21 && dillerSum <= 21) {
       finalMessage.textContent = 'You lose';
       finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`;
       loseWinPicture.src =`images/bb2bad619dcae9c901aead1aac4c5315 (1).jpg`;
       dialogTokens.textContent = `You now have ${countOfTokens} token(s)`;
      
       return  res.showModal();
    }

    if(playerSum > 21 && dillerSum > 21) {
        countOfTokens+= +bet;
        statusOfVictory = null;
        //dialog
        dialogTokens.textContent =`You now have ${countOfTokens} token(s)` 
        finalMessage.textContent = 'Draw'
        finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`
        loseWinPicture.src ='images/jinx-flipzflops.gif'
        return   res.showModal();
    }
    else if(dillerSum > 21 && playerSum<=21){
        finalMessage.textContent = 'You won'
        finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`
        loseWinPicture.src =`images/anime-cute.gif`
        countOfTokens+= +bet*2
        console.log(bet, countOfTokens, 'вторая проверка')
        dialogTokens.textContent =  `You now have ${countOfTokens} token(s)` 
        statusOfVictory = true;
      return res.showModal();
    }
else if(dillerSum> playerSum) {
    finalMessage.textContent = 'You lose'
    finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`
    loseWinPicture.src =`images/bb2bad619dcae9c901aead1aac4c5315 (1).jpg`
    console.log(bet, countOfTokens, typeof(bet), 'вторая проверка')
    dialogTokens.textContent = `You now have ${countOfTokens} token(s)` 
  return res.showModal();

}
else if(dillerSum< playerSum) {
    finalMessage.textContent = 'You won'
    finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`
    loseWinPicture.src =`images/anime-cute.gif`;
    countOfTokens+= +bet*2
    statusOfVictory = true;
    dialogTokens.textContent = `You now have ${countOfTokens} token(s)` 
  return res.showModal();
 }
 else if ( dillerSum === playerSum){ 
    countOfTokens+= +bet
    statusOfVictory = null;
//    dialogTokens.textContent = countOfTokens
dialogTokens.textContent = `You now have ${countOfTokens} token(s)` 
finalMessage.textContent = 'Draw'
finalScore.textContent = `your points ${playerSum} : dealer points ${dillerSum}`
loseWinPicture.src ='images/jinx-flipzflops.gif'
res.showModal();

   
 }

}

function generateGame () {
    writingBets()
    shuffleCards()
    pickCard()  
    btnSubmit.classList.remove("eventsNon")
    btnTake.classList.remove("eventsNon")
    jazz.play();
}

function cleanEvrething() {
    diller = [];
    player = [];
    dillerSum =0;
    playerSum = 0;
    card;
    card2;

    countOfTokens = 3;
    bet =0;
    
    dillerFeild.innerHTML = '';
    playerFeild.innerHTML = '';
    tokensScore.innerHTML = '';
    betField.innerHTML = '';
}

function restart() {
   
    cleanEvrething()
   

   document.querySelector('.phrase').textContent = "I will win you this time!"
   creatMidalBets()
   doThebets.showModal();

 //  return  generateGame ()
}

function writingBets(){
    tokensScore.textContent =  countOfTokens
    betField.textContent = bet
}

function nextRound() {
    diller = [];
    player = [];
    dillerSum = 0;
    playerSum = 0;
    card;
    card2;
    bet=0;

 // dillerFeild.innerHTML = '';
  // playerFeild.innerHTML = '';
   tokensScore.innerHTML = countOfTokens;
   //betField.innerHTML = '';

   //messageBets.textContent = 'Time for the next bet!'
   creatMidalBets()
   doThebets.showModal();

}

function creatMidalBets() {
    roundPicture.src = `images/alright-tolkien-black.gif`
    messageBets.innerHTML = `Time to bet! How many tokens will you stake?`
    nextBetValue.style.margin = `1rem`;
    nextBetValue.setAttribute('max', countOfTokens)

    console.log(nextBetValue, countOfTokens)
    infoTokens.innerHTML = `You have ${countOfTokens} token(s)`
}

function openMessagesDialogAndSetTitle(title) {
    dialogMessagesTitle.textContent = title;
    dialogMessages.showModal()
}

//music
btnmute.addEventListener('click', () => {
    console.log('mute', jazz)
    if (btnmute.classList.contains("soundOn")) {
   jazz.volume = 0;
   btnmute.classList.remove("soundOn")
   btnmute.innerHTML =' <i class="fas fa-volume-up"></i>'
    } else {
        jazz.volume = 1;
        btnmute.classList.add("soundOn")
        btnmute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
    }
})


//игрок берет или не берет карту +
//если у дилера меньше 17 то он берет еще одну карту +
//сделать таймер на время хода компьютера +

//рестарт и очистить поле +
//переделать колоду на 52 карты +
//открывать карту вконце +
// рестарт +

//создатб кнопку правила+
// ставки учет+

// вынести повторную ставку в отдельную функцию++
//надо доработать диалоговое окно для ничьей6+
//доработать диалоговое окно для ставок+
//сделать интро оверлей красивым+
//тузы?
// проблемв с проверкой на победу+
//аудио эффекты+
// какие-то эффекты казинопроигрывает выигрывает+
//анимация колоды
//анимация карт