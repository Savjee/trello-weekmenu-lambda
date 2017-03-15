'use strict';

console.log('Loading function');

const REQUEST = require('request');

//
// Configuration
//
const API_URL = 'https://api.trello.com/1';
const BOARD_ID = process.env.TRELLO_BOARD_ID;
const API_TOKEN = process.env.TRELLO_API_TOKEN;
const API_KEY = process.env.TRELLO_API_KEY;
const API_AUTH = '&key=' + API_KEY + '&token=' + API_TOKEN;
const RESET_DAY = 6; // Saturday
const NAME_BACKLOG_COLUMN = "Ideeën";

// Ordered based on how Date.getDay() works in Javascript
let DAYS_OF_WEEK = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];


module.exports.hello = (event, context, callback) => {

  // Get the current day
  const date = new Date();
  const currentDay = DAYS_OF_WEEK[date.getDay()];

  // Reset the board if it's the reset day
  if (date.getDay() === RESET_DAY) {
    resetBoard(function () {
      orderBoard();
    });
  } else {
    orderBoard();
  }

  function orderBoard() {
    console.log("> Ordering board...");

    getAllListsOnTrello(function (listsOnTrello) {
      // Let's sort the array
      let foundCurrentDayInArray = false;

      while (foundCurrentDayInArray == false) {
        // If the first day of the week is the current one, yay!
        if (DAYS_OF_WEEK[0] == currentDay) {
          foundCurrentDayInArray = true;
        } else {
          DAYS_OF_WEEK.push(DAYS_OF_WEEK.shift());
        }
      }

      //
      // Find the highest position of list so that we can put them higher
      //
      let highestPos = Number.MIN_SAFE_INTEGER;

      listsOnTrello.forEach(function (list) {
        if (list.pos > highestPos) {
          highestPos = list.pos;
        }
      });

      // Order the lists on Trello
      for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
        // Loop over the lists on Trello
        listsOnTrello.forEach(function (trelloList) {
          if (trelloList.name.toLowerCase() == DAYS_OF_WEEK[i].toLowerCase()) {
            setPositionOfList(trelloList.id, parseInt((highestPos + 10) + i * 100));
          }
        });
      }
    });
  }

  function resetBoard(callback) {
    console.log("> It's reset day!! Resetting...");

    getAllListsOnTrello(function (listsOnTrello) {
      let backLogColumn = null;

      while (backLogColumn === null) {
        // Take the first list
        let el = listsOnTrello.shift();

        if (el.name === NAME_BACKLOG_COLUMN) {
          backLogColumn = el;
        }
      }

      getAllCardsOnTrello(function (cards) {
        console.log(cards);

        cards.forEach(function (card) {
          resetCardPosition(card, backLogColumn);
        });

      });
    });

    callback();
  }

  function resetCardPosition(card, backlogColumnObject) {
    console.log('--> Resetting card ' + card.id + ' to backlog list ' + backlogColumnObject.id);

    REQUEST.put(API_URL + '/cards/' + card.id)
      .form({ token: API_TOKEN, key: API_KEY, idList: backlogColumnObject.id, })
      .on('response', function (response) {
        if (response.statusCode != 200) {
          console.error('Could not move card ' + card.id + ' to pos 1');
        }
      });
  }

  function getAllCardsOnTrello(callback) {
    REQUEST(API_URL + '/boards/' + BOARD_ID + '?lists=open&cards=visible' + API_AUTH, function (error, response, body) {

      // Stop if there was an error
      if (error || response.statusCode != 200) {
        callback("Could not fetch an overview of the Trello board", null);
        return false;
      }

      callback(JSON.parse(body).cards);
    });
  }

  function getAllListsOnTrello(callback) {
    REQUEST(API_URL + '/boards/' + BOARD_ID + '/lists?fields=name,pos' + API_AUTH, function (error, response, body) {

      // Stop if there was an error
      if (error || response.statusCode != 200) {
        callback("Could not fetch an overview of the Trello board", null);
        return false;
      }

      callback(JSON.parse(body));
    });
  }

  function setPositionOfList(listId, position) {
    console.log('--> Moving list ' + listId + ' to pos ' + position);

    REQUEST.put(API_URL + '/lists/' + listId)
      .form({ token: API_TOKEN, key: API_KEY, pos: position })
      .on('response', function (response) {
        if (response.statusCode != 200) {
          console.error('Could not move list ' + listId + ' to pos ' + position);
        }
      });
  }
};