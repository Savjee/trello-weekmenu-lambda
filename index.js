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

// Ordered based on how Date.getDay() works in Javascript
var DAYS_OF_WEEK = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

exports.handler = (event, context, callback) => {

    // Fetch an overview of the board
    REQUEST(API_URL + '/boards/' + BOARD_ID + '/lists?fields=name,pos' + API_AUTH, function (error, response, body) {
        
        // Stop if there was an error
        if (error || response.statusCode != 200) {
            callback("Could not fetch an overview of the Trello board", null);
            return false;
        }

        var listsOnTrello = JSON.parse(body);

        //
        // Get the current day and order the array in the correct way
        //
        var date = new Date();
        var currentDay = DAYS_OF_WEEK[date.getDay()];
        console.log(currentDay);

        // Let's sort the array
        var foundCurrentDayInArray = false;

        while (foundCurrentDayInArray == false) {
            // If the first day of the week is the current one, yay!
            if (DAYS_OF_WEEK[0] == currentDay) {
                foundCurrentDayInArray = true;
            } else {
                let day = DAYS_OF_WEEK.shift();
                DAYS_OF_WEEK.push(day);
            }
        }

        //
        // Find the lowest and highest position
        var lowestPos = Number.MAX_SAFE_INTEGER;
        var highestPos = 0;

        listsOnTrello.forEach(function(list){
            if(list.pos > highestPos){
                highestPos = list.pos;
            }

            if(list.pos < lowestPos){
                lowestPos = list.pos;
            }
        });

        //
        // Order the lists on Trello
        //
        for (let i = 0; i < DAYS_OF_WEEK.length; i++)
        {
            // Loop over the lists on Trello
            listsOnTrello.forEach(function (trelloList)
            {
                if (trelloList.name.toLowerCase() == DAYS_OF_WEEK[i].toLowerCase())
                {
                    setPositionOfList(trelloList.id, parseInt((highestPos +10) + i * 100));
                }
            });
        }

    });

    function setPositionOfList(listId, position)
    {
        console.log('--> Moving list ' + listId + ' to pos ' + position);

        REQUEST.put(API_URL + '/lists/' + listId)
            .form({token: API_TOKEN, key: API_KEY, pos: position})
            .on('response', function (response) {
                if (response.statusCode != 200) {
                    console.error('Could not move list ' + listId + ' to pos ' + position);
                }
            });
    }
};