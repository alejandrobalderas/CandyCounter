import React, { Component } from "react";
import CandyContainer from "./components/CandyContainer";

import axios from "axios";
import uuid from "uuid";
import Test from "./components/Test";

export default class App extends Component {
  state = {
    newKey: 0,
    candy: [],
    nextCandy: null,
    currentProbabilities: [0.5, 0.5, 0.5, 0.5],
    totalNumberOfCandy: 0
  };
  update_probabilities() {
    axios.get("http://localhost:5000/get_probabilities").then(res => {
      const rounded_probabilites = res.data.probabilities.map(num =>
        Math.round(num * 100)
      );
      this.setState({
        currentProbabilities: rounded_probabilites,
        totalNumberOfCandy: res.data.total_number_of_candy
      });
    });
  }
  componentDidUpdate() {
    // setTimeout(this.update_probabilities(), 5000);
  }

  componentDidMount() {
    this.update_probabilities();
  }

  render() {
    const update_results = () => {
      this.update_probabilities();
    };
    setTimeout(update_results, 2000);

    const colors = {
      orange: "rgb(222, 171, 75)",
      green: "rgb(54, 143, 103)",
      // blue: "rgb(33,106,200	)",
      yellow: "rgb(205, 209, 102)",
      purple: "rgb(173, 105, 184)"
    };

    const random_color = colors => {
      var keys = Object.keys(colors);
      const random_color = (keys.length * Math.random()) << 0;
      return {
        color_name: keys[random_color],
        color_code: colors[keys[random_color]]
      };
    };

    const getNewCandy = colors => {
      return random_color(colors);
    };

    const candyIsClicked = (candyColor, buttonValue, deleteId) => {
      axios
        .post("http://localhost:5000/color", {
          color: candyColor,
          value: buttonValue
        })
        .then(res => {
          console.log("Model updated");
          setTimeout(() => {
            const newCandyList = this.state.candy.filter(candy => {
              return candy.props.id !== deleteId;
            });
            this.setState({ candy: newCandyList, nextCandy: "test" });
          }, 1000);
        });
    };

    const addNewCandyToList = () => {
      axios.post("http://localhost:5000/newcandy", {}).then(res => {
        const rounded_probabilites = res.data.expected_values.map(num =>
          Math.round(num * 100)
        );
        this.setState({
          nextCandy: res.data.color,
          currentProbabilities: rounded_probabilites
        });
        var id = uuid.v4();
        const newComponent = (
          <CandyContainer
            id={id}
            key={id}
            color={{
              color_name: this.state.nextCandy,
              color_code: colors[this.state.nextCandy]
            }}
            candyIsClicked={candyIsClicked}
          />
        );
        this.setState({
          candy: [...this.state.candy, newComponent],
          newKey: this.state.newKey + 1
        });
      });
    };

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const tableOfProbabilities = (
      <div>
        <table>
          <thead>
            <tr>
              <th>Color</th>
              <th>Probability</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{capitalizeFirstLetter(Object.keys(colors)[0])}</td>
              <td>{this.state.currentProbabilities[0]}%</td>
            </tr>
            <tr>
              <td>{capitalizeFirstLetter(Object.keys(colors)[1])}</td>
              <td>{this.state.currentProbabilities[1]}%</td>
            </tr>
            <tr>
              <td>{capitalizeFirstLetter(Object.keys(colors)[2])}</td>
              <td>{this.state.currentProbabilities[2]}%</td>
            </tr>
            <tr>
              <td>{capitalizeFirstLetter(Object.keys(colors)[3])}</td>
              <td>{this.state.currentProbabilities[3]}%</td>
            </tr>
          </tbody>
        </table>
        <h6>Total number of candy: {this.state.totalNumberOfCandy}</h6>
      </div>
    );

    return (
      <div className="">
        <div className="row">
          <div className="valign-wrapper">
            <h2 className="col s5">Candy Optimizer</h2>

            <div className="col s5 more-candy-btn ">
              <a
                onClick={addNewCandyToList}
                className="waves-effect waves-light btn"
              >
                Get a Candy!
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="col s3">
              <h6>Probabilities of liking the candy</h6>
              {tableOfProbabilities}
            </div>
            <div className="col s8 offset-s1">
              {this.state.candy.map(candy => candy)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
