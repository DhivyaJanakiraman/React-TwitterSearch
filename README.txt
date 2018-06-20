#TwitterSearch

Description:
============

This is a simple web application built using ReactJS and Node.js which provides to capability to do Twitter hashtag searches and retrieve relevant tweets based on the search. The user is given the ability to further refine the tweets based on number of tweets, favorite count, retweet count and number of comments per tweet. 

GitHub Link: https://github.com/DhivyaJanakiraman/React-TwitterSearch 
Heroku Link: https://dry-wildwood-64181.herokuapp.com/

Architecture:
=============

                            |---------|
                            |  App    |   ---> Parent Component
                            |---------|
                                 |
             |-----------------------------------------|
             |                   |                     |
          ----------         ----------            ----------
          | Data   |        | Input    |          | Display  |
          | Fetcher|        | Control  |          |          | 
          ----------         ----------            ----------
          (Child)           (Child)                (Child)

App -- This is the parent component which orchestrates the flow of information, to and from the child components. In a nutshell, the InputControl component receives new user information, triggers a fetch in the DataFetcher component which returns the tweets information and the parent stores that information and passes onto to the Display component for it to be filtered and displayed. Component also maintains state resources to save user information and fetched tweets from DataFetcher and passed onto the Display as needed upon an InputControl change to avoid unnecessary re-fetching of tweets. 

Data Fetcher -- This is the child component which triggers the AJAX fetch requests to the server.js which then performs the HTTP request to the TwitterAPI URL and retrieves the raw tweets. After the first pass is made, key details from the raw tweets are captured into a local TweetDetailsArray and then a 2nd pass is then made to fetch the tweets relevant to original set of tweets to calculate the number of comments per tweet. This is done using nested fetch calls and then() callback mechanism to resolve potential asynchronous returns between AJAX calls. This is key to providing deterministic response at the end when the fully updated TweetDetailsArray is returned to parent component to be saved into its local state.

A pictorial description of how the DataFetcher interacts with the server.js (Node.js) which then sends the HTTP request to TwitterAPI and then gets the raw result from back Twitter for further processing.

----------            ------------                   -------------
| Data   |----------->| server.js| ---HTTP Request-->| Twitter  |
| Fetcher|<-----------|          | <--HTTP Response--| API      |
----------            ------------                   -------------



Input Control -- This is the child component that receives new search hashtags, current tweet filtering criteria and number of tweets to be displayed information from the user and sends it to the parent component to be saved and re-directed to DataFetcher and Display components.

Display -- This is the child component that performs filtering on the fetched tweets , stored in parent (App) which is passed onto Display component to be stored in its local state as a copy. Tweet re-filtering is done in the componentWillReceiveProps function and setState is called to update the tweet array in its local resource. Then, when render is invoked, all the tweets in this.state.arr is displayed onto the site.


Directory Structure
===================
  client
    --> node_modules (auto-generated code from npm run)
    --> public (auto-generated)
    -->src  
      -->components (stateless components reside here)
        -->Header
          -->Header.css -- CSS info to render the header of site
          -->Header.js  -- Simple JS file to render the div of the header
      -->containers (stateful child components reside here)
        -->DataFetcher
          -->DataFetcher.css -- CSS Info for this component
          -->DataFetcher.js  -- Source code of DataFetcher child component
        -->Display
          -->Display.css -- CSS Info for this component
          -->Display.js  -- Source code for Display child component
        -->InputControl
          -->InputControl.css -- CSS Info for this component
          -->InputControl.js -- Source code for InputControl child component
      -->App.css -- CSS Info for the APP parent component
      -->App.js  -- Source code for the APP parent component
      -->index.js -- React auto-generated file
      -->registerServiceWorker -- React auto-generated file
      -->package.json -- File that captures all entities for this application to work
      -->config
        -->keys_dev.js --> Code development TwitterAPI keys and tokens (can't publish on GitHub)
        -->keys_prod.js --> Code production TwitterAPI keys and tokens (can't publish on GitHub)
        -->keys.js --> selects either dev or prod based on ENV variables

UI Design Approach:
===================
The main idea is to provide a visually appealing searchable UI with the sort criteria and number of tweets needed information. Hence, a long search bar with sorting and num tweets button at the bottom approach was taken, in order not to have a clobbered search bar.

TweetBoxes were chosen to have a simple white background, with the tweeter's picture, text, location and screen name and along with all the metrics are displayed per tweet.

A nice wavy green background with varying texture and contrast from left to right was chosen to look good on the eye.

Open Issue
===========
The application is perfectly functional and it retrieves tweets, calculates number of comments per tweet correctly. A lot of testing has been conducted to verify that no-refetching happens when only sort criteria or number of tweets needed is adjusted. H
owever, there is only one slight issue that occurs randomly which is hardly noticeable is that if the user intends sort by num comments per tweet at time of new search input will not render num comments per tweet immediately. The user has to click comments again to get the right sorting. This is happening, I believe due to a race condition on the set of array values passed between App and Display after DataFetcher has returned the tweets. One potential fix might be to move the componentWillReceiveProps code to getDerivedStateFromProps to be more deterministic which we can use then to trigger the render in Display component. 



