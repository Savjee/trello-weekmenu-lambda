# Meal planner with Trello and AWS Lambda
This is the source code for my weekly meal planner (built on Trello and AWS Lambda).

Read more about it on my blog: [https://www.savjee.be/2016/07/Meal-planning-with-trello-and-aws-lambda/](https://www.savjee.be/2016/07/Meal-planning-with-trello-and-aws-lambda/)

It's currently using the [Serverless framework](https://serverless.com/) to set up and create the resources on AWS.

## Setup
Before you begin, make sure that you have installed and configured [Serverless](https://serverless.com/).

Installing the dependencies:

    npm install

Now copy the ``config.example.yml`` to ``config.yml`` and change these parameters:
  * TRELLO_BOARD_ID
  * TRELLO_API_TOKEN
  * TRELLO_API_KEY

Deploy it to your AWS account:

    sls deploy

# Contributing
Please be gentle, I hacked this together on a train ride to work.

Improvements are welcome! Submit pull requests, create issue's or fork away!
# License
See LICENSE file
