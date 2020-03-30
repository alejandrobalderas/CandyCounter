from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import beta


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class ThompsonSampler:
    def __init__(self):
        self.number_of_candy = 4
        self.number_of_reward_1 = [0]*self.number_of_candy
        self.number_of_reward_0 = [0]*self.number_of_candy
        self.total_reward = 0
        self.theta = [0]*self.number_of_candy
        self.candy_selected = []

    def pick_new_candy(self):
        for i in range(self.number_of_candy):
            self.theta[i] = np.random.beta(
                self.number_of_reward_1[i] + 1, self.number_of_reward_0[i]+1)
        return self.color_from_int(np.argmax(self.theta))

    def color_from_int(self, candy):
        candy_map = {
            0: "orange",
            1: "green",
            2: "yellow",
            3: "purple"
        }
        return candy_map.get(candy, "Invalid argument")

    def int_from_color(self, candy):
        candy_map = {
            "orange": 0,
            "green": 1,
            "yellow": 2,
            "purple": 3
        }
        return candy_map.get(candy, "Invalid argument")

    def update_weights(self, candy_int, value):
        if value == 1:
            self.number_of_reward_1[candy_int] += 1
        elif value == 0:
            self.number_of_reward_0[candy_int] += 1
        self.total_reward += value
        print(self.number_of_reward_0)
        print(self.number_of_reward_1)
        print("update weights")

    def get_expected_value(self):
        expected_values = [0]*self.number_of_candy
        for i in range(self.number_of_candy):
            dist = beta(
                self.number_of_reward_1[i] + 1, self.number_of_reward_0[i]+1)
            expected_values[i] = dist.mean()
        return expected_values

    def get_total_picks(self):
        num_of_picks = np.sum(self.number_of_reward_0) + \
            np.sum(self.number_of_reward_1)
        return num_of_picks

    def reset_values(self):
        self.number_of_reward_1 = [0]*self.number_of_candy
        self.number_of_reward_0 = [0]*self.number_of_candy


thompson = ThompsonSampler()


@app.route("/")
@cross_origin()
def helloWorld():
    data = request.json
    print(data)
    return "Hello, cross-origin-world!"


@app.route("/color", methods=["GET", "POST"])
@cross_origin()
def colors():
    data = request.json
    color_name = data["color"]
    button_value = data["value"]
    color_int = thompson.int_from_color(color_name)
    thompson.update_weights(color_int, button_value)
    print(color_int)
    return "done"


@app.route("/newcandy", methods=["GET", "POST"])
@cross_origin()
def get_new_candy():
    expected_values = thompson.get_expected_value()
    candy = thompson.pick_new_candy()
    total_number_of_candy = thompson.get_total_picks().item()
    return {"color": candy, "expected_values": expected_values}


@app.route("/get_probabilities", methods=["GET", "POST"])
@cross_origin()
def get_probabilities():
    probabilities = thompson.get_expected_value()
    total_number_of_candy = thompson.get_total_picks().item()
    return {"probabilities": probabilities, "total_number_of_candy": total_number_of_candy}


@app.route("/reset", methods=["GET", "POST"])
@cross_origin()
def reset_values():
    thompson.reset_values()
    return "reset"


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
