# bigER-langium

[Langium](https://langium.org/)-based realization of [bigER](https://github.com/borkdominik/bigER).

## Getting Started

Requirements:
- [Node.js](https://nodejs.org/en/) 18 or above
- [VS Code](https://code.visualstudio.com/) 1.67 or above
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/)


Clone the repository and in the root directory of the project, run the command:

```bash
yarn
```

The command automatically installs all dependencies and builds the modules located in `packages/`.
To run the extension in VS Code, press <kbd>F5</kbd> or select `Run ➜ Start Debugging` from the menu.


## Pull Request

First, make sure your repository is up-to-date by pulling the latest changes from the `master` branch:

```bash
git pull origin master
```

Then create a new branch and commit your changes:

```bash
# create a new branch 
git checkout -b your-branch-name

# commit changes
git commit -m "Describe changes..."
```

Push the newly created branch with your changes to GitHub:

```bash
git push origin your-branch-name
```

Afterwards, the new branch should be visible on GitHub and you can [create a new Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). 