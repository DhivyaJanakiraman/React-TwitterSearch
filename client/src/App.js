import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import InputControl from "./containers/InputControl/InputControl";
import DataFetcher from "./containers/DataFetcher/DataFetcher";
import Display from "./containers/Display/Display";
import "./App.css";

/*
  Component: App
  Role: This is the parent component, a.k.a the MAIN Application which holds the children components namely InputControl, DataFetcher and Display. The parent component receives user changes from InputControl component, updates its state resources and then dispatches that information to DataFetcher and Display components to take necessary action.

*/

class App extends Component {
  /*
    Parent Resources 
  */

  state = {
    searchVal: "", //Input search string from user
    sort: "favorite", //Input sort criteria from user
    rows: 15, //Input number of tweets from user
    result: [], //TweetDetailsArray after DataFetcher has fetched the tweets
    hasFetchedData: false //Flag to indicate whether DataFetcher has fetched the data to act as display trigger or prevent additional AJAX requests
  };

  /*
    Function: handleFormData
    Input: Input values from user sent by InputControl child component
    Role: Update parent's state resources of user input information, updates hasFetchedData to trigger a fetch request in DataFetcher

  */
  handleFormData = data => {
    this.setState({
      searchVal: data.searchVal,
      sort: data.sort || "favorite",
      rows: data.rows || 15,
      hasFetchedData: false
    });
  };

  /*
    Function: handleFetchedTweets
    Input: Tweets Array from DataFetcher component after user input
    Role: Update parent's state resources of the result with TweetDetailsArray info and set the hasFetchedFlag to true to stop AJAX calls in DataFetcher and trigger display in Display component

  */

  handleFetchedTweets = data => {
    var newArr = this.state.result;
    newArr = [];
    newArr = data;
    this.setState({ result: newArr, hasFetchedData: true });
  };

  /*
    Function: handleFilterTweet
    Input: Sort criteria update from InputControl child component
    Role: Updates sort state resource in parent component and triggers a re-render in Display component without fetching new tweets

  */

  handleFilterTweet = data => {
    this.setState({ sort: data });
  };

  /*
    Function: handleFilterNumTweets
    Input: Number of tweets criteria update from InputControl child component
    Role: Updates rows state resource in parent component and triggers a re-render in Display component without fetching new tweets

  */

  handleFilterNumTweets = data => {
    this.setState({ rows: data });
  };

  /*
    Function: render
    Role: Establish the passage of necessary props from parent to child components 

  */

  render() {
    return (
      <div className="App">
        <Header />
        <InputControl
          formData={this.handleFormData}
          filterTweet={this.handleFilterTweet}
          filterNumTweets={this.handleFilterNumTweets}
        />
        <DataFetcher
          searchData={this.state}
          searchResult={this.updateResult}
          rawTweetsData={this.handleFetchedTweets}
        />
        <Display
          sort={this.state.sort}
          rows={this.state.rows}
          result={this.state.result}
          hasFetchedData={this.state.hasFetchedData}
        />
      </div>
    );
  }
}

export default App;
