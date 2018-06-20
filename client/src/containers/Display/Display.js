import React, { Component } from "react";
import "./Display.css";

/*
  Component: Display
  Role: The role of this component is to do a simple sorting of TweetDetailsArray based on user input and then render the tweets onto the page
*/

class Display extends Component {
  /*
    Local state resources are needed to store the next incoming props from parent to be used for filtering and display
  */
  state = {
    arr: [], //Final Tweets Array
    hasFetchedData: false, //Flag to check if DataFetcher has actually fetched any tweets before rendering
    sort: "favorite", //Placeholder -- May not be needed. FIXME_REVIEW!
    rows: 15 //Placeholder -- May not be needed. FIXME_REVIEW!
  };

  /*
    Function: componentWillReceiveProps
    Inputs: nextProps
    Outputs: none
    Role: This is a standard React function in which ,nextProps are received at the start of the update phase. In this function, I simply the update the TweetDetailsArray with the user-level filtering based on favorite count, retweet-count or num-comments count , and number of tweets required (pagination support) and store it in the local state resource, arr. Doing a setState in this function, will not cause an additonal re-render.
  */
  componentWillReceiveProps = nextProps => {
    var filterCategory = nextProps.sort;
    var TweetDetailsArray = nextProps.result;

    switch (filterCategory) {
      case "favorite":
        if (TweetDetailsArray.length > 0) {
          TweetDetailsArray.sort(this.dynamicSort("favorite_count"));
        }
        break;
      case "retweet":
        if (TweetDetailsArray.length > 0) {
          TweetDetailsArray.sort(this.dynamicSort("retweet_count"));
        }
        break;
      case "comment":
        if (TweetDetailsArray.length > 0) {
          TweetDetailsArray.sort(this.dynamicSort("num_comments"));
        }
        break;
      default:
        if (TweetDetailsArray.length > 0) {
          TweetDetailsArray.sort(this.dynamicSort("favorite_count"));
        }
    }

    // adding pagination support here
    // finally just slice the array by the appropriate value
    // and store it in the local state resource for display
    var tweets_needed = nextProps.rows;
    if (tweets_needed > TweetDetailsArray.length) {
      tweets_needed = TweetDetailsArray.length;
    }

    TweetDetailsArray = TweetDetailsArray.slice(0, tweets_needed);

    this.setState({ arr: TweetDetailsArray });
    this.setState({ hasFetchedData: nextProps.hasFetchedData });
  };

  /*
    Function: dynamicSort
    Inputs: tweet a's value, tweet b's value, sortCriteria
    Role: This is sorting template function, written as a closure, to allow sorting based on the one of three options: favorite_count, retweet_count or number of comments.
  */

  dynamicSort = property => {
    var sortOrder = -1;
    return function(a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };

  /*
    Function: render
    Role: This is the key render function that displays the set of tweets to the screen. And this is only performed after the DataFetcher has fetched the tweets (hasFetchedFlag set to true);

  */

  render() {
    var result;
    if (this.state.arr && this.state.hasFetchedData) {
      result = this.state.arr.map(tweet => {
        return (
          <div id="tweetBox" key={tweet.tweet_id} className="tweetBox">
            <div className="img-container">
              <img
                src={tweet.profile_image_url}
                className="profile-img"
                alt="Profile-pic"
              />
            </div>
            <div className="text-content">
              <div className="sub-content">
                <h3 className="sub-content-title">{tweet.name} :</h3>
                <span> @{tweet.screen_name} </span>
                <p className="sub-content-text">{tweet.text}</p>
              </div>
              <div className="metrics">
                <ul id="metrics">
                  <li className="comments">
                    <i className="far fa-comment" /> {tweet.num_comments}
                  </li>
                  <li className="retweets">
                    <i className="fas fa-retweet" /> {tweet.retweet_count}
                  </li>
                  <li className="favorite">
                    <i className="far fa-heart" /> {tweet.favorite_count}
                  </li>
                  <li className="location">
                    <i className="fas fa-globe" /> {tweet.user_location}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      });
    } else {
      result = "empty";
    }

    return (
      <div>
        {this.state.hasFetchedData && (
          <div>
            <hr />
            {result}
          </div>
        )}
      </div>
    );
  }
}

export default Display;
