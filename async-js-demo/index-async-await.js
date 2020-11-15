const getUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Fetching user from database...');
      
      if (id !== null) {
        resolve({id, gitHubUsername: 'Christopher'});
      } else {
        reject(new Error(`Sorry, could not fetch user with id ${id}`));
      }
    }, 2000);
  });
};

const getRepositories = (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Calling GitHub APi...');

      if (username !== null) {
        resolve(['repo1', 'repo2', 'repo3']);
      } else {
        reject(new Error(`Sorry, could not fetch repositories for username ${username}`));
      }
    }, 2000);
  });
};

const getCommits = (repo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Getting list of commits...');
      
      if (repo !== null) {
        resolve(['commit1', 'commit2', 'commit3']);
      } else {
        reject(new Error(`Sorry, could not fetch commits for ${repo} repository`));
      }
    }, 2000);
  });
};

console.log('Start');
// Async Await approach
const displayCommits = async () => {
  try {
    const user = await getUser(23);
    const repoList = await getRepositories(user.gitHubUsername);
    const commitList = await getCommits(repoList[0]);

    console.log('Commit list: ', commitList);
  } catch(error) {
    console.log('Error: ', error.message);
  }
};
displayCommits();
console.log('End');
