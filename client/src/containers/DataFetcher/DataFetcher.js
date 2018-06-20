import React, { Component } from "react";
import "./DataFetcher.css";

/*

  Component: DataFetcher
  Role: The role of this component is to retrieve the tweets using the TwitterAPI and then calculates the number of comments per tweet 

*/

class DataFetcher extends Component {
  /*
    Function: componentDidUpdate
    Inputs: prevProps
    Role: We need to only retrieve the tweets if the incoming props have any changes and if we have not fetched the data already. This is controlled by the hasFetchedData flag, which is set once the tweets have been fetched. Upon a new search val input, the flag will be set to false and once the tweets are retrieved, this flag will be set to true in the App.js (parent) and it will prevent re-render.

  */
  componentDidUpdate(prevProps) {
    if (this.props.searchData.searchVal !== prevProps.searchData.searchVal) {
      if (
        !this.props.searchData.hasFetchedData &&
        this.props.searchData.searchVal !== ""
      ) {
        this.getDataFromAPI();
      }
    }
  }

  /*
    Function: getDataFromAPI()
    Inputs: None
    Outputs: this.props.rawTweetsData --> TweetDetailsArray
    Role: This function is used to retrieve the tweets using the fetch api that performs the nested ajax calls. In fact this is done as a two-step process:
    a) First fetch the raw tweets
    b) Second pass is done to do another fetch request to calculate the number of comments per tweet. 
    The logic to calculate num comments per tweet,is that for every tweet, a 2nd ajax call is made to retrieve the tweets back to the author of the original tweet,since the tweet was made and filter it based on the 'in_reply_to_status_id_str' to match it the original tweet id. If there is match, a counter is incremented for overall number of comments and TweetDetailsArray is updated and returned.
    Note that only relevant fields from the TwitterAPI JSON response is tracked for this application and you can find those below.

  */
  getDataFromAPI = () => {
    fetch("/tweets/" + encodeURIComponent(this.props.searchData.searchVal))
      .then(res => {
        return res.json();
      })
      .then(data => {
        var TweetDetails = {};
        var rawTweets = data.statuses;
        var TweetDetailsArray = [];

        //This is the filtered array that captures key metrics from the rawTweets returned by the TwitterAPI
        //This array is returned back to parent
        TweetDetailsArray = [];
        if (rawTweets.length > 0) {
          for (let i = 0; i < rawTweets.length; i++) {
            TweetDetails[i] = {
              tweet_id: rawTweets[i].id_str,
              text: rawTweets[i].text,
              created_at: rawTweets[i].created_at,
              screen_name: rawTweets[i].user.screen_name,
              name: rawTweets[i].user.name,
              user_location: rawTweets[i].user.location,
              retweet_count: rawTweets[i].retweet_count,
              favorite_count: rawTweets[i].favorite_count,
              in_reply_to_status_id: rawTweets[i].in_reply_to_status_id_str,
              profile_image_url: rawTweets[i].user.profile_image_url,
              num_comments: 0
            };
            TweetDetailsArray.push(TweetDetails[i]);
          }

          //Update Num Comments Per Tweet
          for (let i = 0; i < TweetDetailsArray.length; i++) {
            fetch(
              "/comments/" +
                TweetDetailsArray[i].screen_name +
                "/" +
                TweetDetailsArray[i].tweet_id
            )
              .then(data => {
                return data.json();
              })
              .then(data => {
                let count = 0;
                var resultData = data.statuses;
                if (resultData !== null || resultData !== undefined) {
                  for (let j = 0; j < resultData.length; j++) {
                    if (
                      resultData[j]["in_reply_to_status_id_str"] !== null &&
                      resultData[j]["in_reply_to_status_id_str"] ===
                        TweetDetailsArray[i].tweet_id
                    ) {
                      count++;
                    }
                  }
                }
                TweetDetailsArray[i]["num_comments"] = count;
              })
              .catch(err => console.log(err));
          }
        } else {
          console.log("No tweets fetched");
        }
        return this.props.rawTweetsData(TweetDetailsArray);
      })
      .catch(err => console.log(err));
  };

  render() {
    return <div />;
  }
}

export default DataFetcher;
