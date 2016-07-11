# Meal planner with Trello and AWS Lambda
This is the source code for my weekly meal planner (built on Trello and AWS Lambda).

Read more about it on my blog: [https://www.savjee.be/2016/07/meal-planning-with-trello-and-aws-lambda/](https://www.savjee.be/2016/07/meal-planning-with-trello-and-aws-lambda/)

## Setup
Start by installing the dependencies:

    npm install

Now copy the ``.env.example`` to ``.env`` and change these parameters:
  * AWS_ACCESS_KEY_ID
  * AWS_SECRET_ACCESS_KEY
  * AWS_ROLE_ARN
  * TRELLO_BOARD_ID
  * TRELLO_API_TOKEN
  * TRELLO_API_KEY
  
You can test this funtion locally on your machine with node-lambda:

    node-lambda run
    
Or deploy it to AWS:

    node-lambda deploy --configFile .env

# Contributing
Please be gentle, I hacked this together on a train ride to work.

Improvements are welcome! Submit pull requests, create issue's or fork away!
# License
See LICENSE file