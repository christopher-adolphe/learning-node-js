const getUser = (id, callback) => {
  setTimeout(() => {
    console.log('Fetching user from database...');
    callback({id, gitHubUsername: 'Christopher'});
  }, 2000);
};

const getRepositories = (username, callback) => {
  setTimeout(() => {
    console.log('Calling GitHub APi...');
    callback(['repo1', 'repo2', 'repo3']);
  }, 2000);
};

const getCommits = (repo, callback) => {
  setTimeout(() => {
    console.log('Getting list of commits...');
    callback(['commit1', 'commit2', 'commit3']);
  }, 2000);
};

// Using named function to resolve callback hell issue
const fetchUser = (user) => {
  console.log('User: ', user);

  getRepositories(user.gitHubUsername, diplayRepos);
};

const diplayRepos = (repoList) => {
  console.log('Github repositories: ', repoList);

  getCommits(repoList[0], displayCommits);
};

const displayCommits = (commitList) => {
  console.log('Commits list: ', commitList);
};

console.log('Start');
// Callback hell
getUser(1, fetchUser);
console.log('End');
