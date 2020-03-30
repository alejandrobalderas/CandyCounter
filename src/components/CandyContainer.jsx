import React, { Component } from "react";

export default class CandyContainer extends Component {
  state = {
    buttonClicked: false,
    likeStatus: null
  };

  handleClick = () => {
    this.setState({
      buttonClicked: true
    });
  };

  handleAdd = () => {
    this.handleClick();
    this.setState({
      likeStatus: "Like"
    });
    this.props.candyIsClicked(this.props.color.color_name, 1, this.props.id);
  };
  handleSubstract = () => {
    this.handleClick();
    this.setState({
      likeStatus: "Dislike"
    });
    this.props.candyIsClicked(this.props.color.color_name, 0, this.props.id);
  };

  render() {
    const { color_name, color_code } = this.props.color;
    const style = {
      backgroundColor: color_code
    };

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const defaultText = (
      <div>
        <h3>Please try the {capitalizeFirstLetter(color_name)} candy</h3>
        <h4>Did you like it?</h4>
      </div>
    );
    const clickedText = <h3>Thank you</h3>;
    return (
      <div className="candy-container card-panel" style={style}>
        {this.state.buttonClicked ? clickedText : defaultText}
        <a
          onClick={this.handleAdd}
          className="like-btn btn-floating btn-large waves-effect waves-light grey darken-2"
        >
          <i className="fa fa-thumbs-up" aria-hidden="true"></i>
        </a>
        <a
          onClick={this.handleSubstract}
          className="like-btn btn-floating btn-large waves-effect waves-light grey darken-2"
        >
          <i className="fa fa-thumbs-down" aria-hidden="true"></i>
        </a>
      </div>
    );
  }
}
