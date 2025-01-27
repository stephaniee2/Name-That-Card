import * as types from '../constants/actionTypes';

const initialState = {
  score: 0,
  questionNumber: 1,
  cards: [],
  wrongAnswers: [],
  answeredQuestions: [],
  selectedAnswer: '',
  ableToNext: false,
  nextClicked: false,
  gameLogo: '',
  displayResults: false,
  gameStarted: false,
  gameLoadingContent: true,
  flipped: false,
};

export default function (previousState = initialState, action) {
  let stateCopy;

  switch (action.type) {
    case types.POPULATE_CARDS_ARRAY: {
      stateCopy = Object.assign({}, previousState);
      stateCopy.cards = action.payload;
      stateCopy.gameLoadingContent = false;
      stateCopy.flipped = false;
      return stateCopy;
    }
    case types.SELECT_ANSWER: {
      stateCopy = Object.assign({}, previousState);
      if (stateCopy.selectedAnswer === '') {
        stateCopy.selectedAnswer = action.payload;
      }
      if (stateCopy.cards[0].card_name === stateCopy.selectedAnswer && !stateCopy.ableToNext) {
        stateCopy.score += 1;
      }
      stateCopy.flipped = true;
      stateCopy.ableToNext = true;
      return stateCopy;
    }
    case types.GO_TO_NEXT: {
      stateCopy = Object.assign({}, previousState);
      if (stateCopy.ableToNext === true) {
        const newAnsweredQuestions = stateCopy.answeredQuestions.slice();
        const newCards = stateCopy.cards.slice();
        newAnsweredQuestions.push(newCards.shift());
        stateCopy.answeredQuestions = newAnsweredQuestions;
        stateCopy.cards = newCards;
        if (stateCopy.questionNumber === 20) {
          stateCopy.questionNumber = 20;
        } else {
          stateCopy.questionNumber += 1;
        }
        stateCopy.selectedAnswer = '';
      }
      stateCopy.flipped = false;
      stateCopy.ableToNext = false;
      return stateCopy;
    }
    case types.FINISH_GAME: {
      stateCopy = Object.assign({}, previousState);
      if (stateCopy.ableToNext === true) {
        const newAnsweredQuestions = stateCopy.answeredQuestions.slice();
        const newCards = stateCopy.cards.slice();
        newAnsweredQuestions.push(newCards.shift());
        stateCopy.answeredQuestions = newAnsweredQuestions;
        stateCopy.cards = newCards;
        stateCopy.displayResults = true;
      }
      return stateCopy;
    }
    case types.RESET_GAME: {
      stateCopy = Object.assign({}, previousState);
      stateCopy.score = 0;
      stateCopy.questionNumber = 1;
      stateCopy.cards = [];
      stateCopy.wrongAnswers = [];
      stateCopy.answeredQuestions = [];
      stateCopy.selectedAnswer = '';
      stateCopy.flipped = false;
      stateCopy.ableToNext = false;
      stateCopy.nextClicked = false;
      stateCopy.gameLogo = '';
      stateCopy.displayResults = false;
      stateCopy.gameStarted = false;
      stateCopy.gameLoadingContent = true;
      return stateCopy;
    }
    default:
      return previousState;
  }
}
