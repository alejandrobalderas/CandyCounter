# %%
from sci
from scipy.stats import beta
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
# %%

number_of_persons = 100
true_ratios = np.array([0.3, 0.4, 0.7, 0.2, 0.7])

data = []
for x in range(number_of_persons):
    random_pick = np.random.uniform(size=5)
    data.append(np.where(true_ratios > random_pick, 1, 0))

dataset = pd.DataFrame(
    data, columns=["red", "yellow", "blue", "purple", "new"])
dataset = dataset.apply(pd.to_numeric)
# %%
candy_selected = []
total_reward = 0
number_of_candy = 5
for n in range(number_of_persons):
    candy_color = np.random.randint(number_of_candy)
    candy_selected.append(candy_color)
    reward = dataset.values[n, candy_color]
    total_reward += reward
print(total_reward)
plt.hist(candy_selected, bins=number_of_candy)


# %%
# Generate data


def generateDataset(number_of_persons=100, probabilities=[1]):
    probabilities = np.array(probabilities)
    number_of_candys = np.size(probabilities)
    tmp_data = []
    for _ in range(number_of_persons):
        random_pick = np.random.uniform(size=number_of_candys)
        tmp_data.append(np.where(probabilities > random_pick, 1, 0))

    df = pd.DataFrame(tmp_data)
    return df.apply(pd.to_numeric)


# %%
# UCB
number_of_candy = dataset.shape[1]
number_of_persons = dataset.shape[0]
number_of_selections = [0]*number_of_candy
candy_selected = []
sum_of_rewards = [0]*number_of_candy
total_reward = 0

for n in range(number_of_persons):
    candy = 0
    max_upper_bound = 0
    for i in range(number_of_candy):
        if (number_of_selections[i] > 0):
            average_reward = sum_of_rewards[i] / number_of_selections[i]
            delta_i = np.sqrt(3/2 * np.log(n+1)/number_of_selections[i])
            upper_bound = average_reward + delta_i
        else:
            upper_bound = 1e400
        if upper_bound > max_upper_bound:
            max_upper_bound = upper_bound
            candy = i

    candy_selected.append(candy)
    number_of_selections[candy] = number_of_selections[candy] + 1
    reward = dataset.iloc[n, candy]
    sum_of_rewards[candy] = sum_of_rewards[candy] + reward
    total_reward += reward

print(f"Total reward: {total_reward}")
plt.hist(candy_selected, bins=number_of_candy)

# %% THOMPSON SAMPLING


probs = [0.6, 0.4, 0.6, 0.8, 0.7, 0.6]
dataset = generateDataset(probabilities=probs)

number_of_candy = dataset.shape[1]
number_of_persons = dataset.shape[0]

number_of_reward_1 = [0]*number_of_candy
number_of_reward_0 = [0]*number_of_candy
total_reward = 0
theta = [0]*number_of_candy
candy_selected = []


for n in range(number_of_persons):

    if n % 30 == 0:
        plot_distributions(number_of_reward_0, number_of_reward_1)
        plt.title(f"Number of draws: {n}")

    for i in range(number_of_candy):
        theta[i] = np.random.beta(
            number_of_reward_1[i] + 1, number_of_reward_0[i]+1)

    highest_probability_candy = np.argmax(theta)
    candy_selected.append(highest_probability_candy)
    reward = dataset.iloc[n, highest_probability_candy]
    if reward == 1:
        number_of_reward_1[highest_probability_candy] += 1
    elif reward == 0:
        number_of_reward_0[highest_probability_candy] += 1
    total_reward += reward


plt.figure()
dataset.sum().plot.bar()
print(f"Total reward: {total_reward}")
plt.figure()
plt.hist(candy_selected, bins=number_of_candy)

for i in range(number_of_candy):
    mean_candy = dataset.mean()[i]
    dist = beta(number_of_reward_1[i] + 1, number_of_reward_0[i]+1)
    expected_candy = dist.mean()
    print(f"Actual value: {mean_candy:.2f}, Predicted: {expected_candy:.2f}")
# %%

number_of_reward_1[2]

# %%

# Define the distribution parameters to be plotted
alpha_values = [0.5, 1.5, 3.0, 0.5]
beta_values = [0.5, 1.5, 3.0, 1.5]
linestyles = ['-', '--', ':', '-.']
x = np.linspace(0, 1, 1002)[1:-1]

# ------------------------------------------------------------
# plot the distributions
fig, ax = plt.subplots(figsize=(5, 3.75))

for a, b, ls in zip(alpha_values, beta_values, linestyles):
    dist = beta(a, b)

    plt.plot(x, dist.pdf(x), ls=ls, c='black',
             label=r'$\alpha=%.1f,\ \beta=%.1f$' % (a, b))

plt.xlim(0, 1)
plt.ylim(0, 3)

plt.xlabel('$x$')
plt.ylabel(r'$p(x|\alpha,\beta)$')
plt.title('Beta Distribution')

plt.legend(loc=0)
plt.show()

# %%
x = np.linspace(0, 1, 1002)[1:-1]
for i in range(number_of_candy):
    dist = beta(number_of_reward_1[i] + 1, number_of_reward_0[i]+1)
    y = dist.pdf(x)

    plt.plot(x, y)

# %%


def plot_distributions(number_of_reward_0, number_of_reward_1):
    plt.figure()
    x = np.linspace(0, 1, 1002)[1:-1]
    for i in range(len(number_of_reward_0)):
        dist = beta(number_of_reward_1[i] + 1, number_of_reward_0[i]+1)
        y = dist.pdf(x)

        plt.plot(x, y, label=f"Candy {i + 1} - E[x]={dist.mean():.2f}")
        plt.legend()


# %%
plot_distributions(number_of_reward_0, number_of_reward_1)

# %%


# %%
