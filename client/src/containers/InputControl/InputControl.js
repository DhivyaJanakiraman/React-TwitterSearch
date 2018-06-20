import React, { Component } from "react";
import "./InputControl.css";
/*
  Component: InputControl
  Role: The role of this component is to submit new values from the user back to the parent which is then dispatched to DataFetcher component and Display component
*/
class InputControl extends Component {
  /*
    Function: handleSubmit
    Input: searchString value
    Output: returns searchString value to parent component (App.js) call back function, formData
  */
  handleSubmit = e => {
    e.preventDefault();
    var searchInput = {
      searchVal: this.refs.searchVal.value,
      rows: this.refs.rows.value,
      sort: this.refs.sort.value
    };
    this.props.formData(searchInput);
  };

  /*
    Function: handleSort
    Input: sort button input
    Output: sends sort button input to parent component to trigger to a re-render in Display component upon an on-Change detection
  */

  handleSort = e => {
    this.props.filterTweet(e.target.value);
  };

  /*
    Function: handleRows
    Input: Number of Tweets value 
    Output: sends number of tweets button input to parent component to trigger to a re-render in Display component upon an on-Change detection
  */

  handleRows = e => {
    this.props.filterNumTweets(e.target.value);
  };

  render() {
    return (
      <div className="wrapper">
        <div className="search-container">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="searchVal"
              className="searchBox"
              ref="searchVal"
              placeholder="Search..."
            />
            <button type="submit" className="searchBtn">
              <span role="img" aria-label="emoji">
                &#128269;
              </span>
            </button>
          </form>
        </div>
        <div className="sortBox-container">
          <div className="sortBox-sort">
            <select
              name="sort"
              id="sort"
              className="sortBox1"
              onChange={this.handleSort}
              ref="sort"
            >
              <option value="" disabled selected>
                SortBy
              </option>
              <option value="favorite">Favorite</option>
              <option value="comment">Comment</option>
              <option value="retweet">Re-Tweet</option>
            </select>
          </div>
          <div className="sortBox-pages">
            <select
              name="rows"
              id="rows"
              className="sortBox2"
              ref="rows"
              onChange={this.handleRows}
            >
              <option value="" disabled selected>
                Tweets Per Page
              </option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default InputControl;
