// Using the Promise class to directly create a resolved promise
const resolvedPromise = Promise.resolve({id: 23, username: 'Christopher'});

resolvedPromise.then(result => console.log('Result: ', result));

// Using the Promise class to directly create a rejected promise
const rejectedPromise = Promise.reject(new Error('Oops! Something went wrong.'));

rejectedPromise.catch(error => console.log('Error: ', error));

// Running parallel promises
const asyncOp1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // const randomVal = Math.floor(Math.random() * 6);
    const randomVal = 5;

    if (randomVal > 3) {
      resolve({id: 23, username: 'Christopher'});
    } else {
      reject(new Error('Oops! Could not complete asyncOp1.'));
    }
  }, 2000);
});

const asyncOp2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // const randomVal = Math.floor(Math.random() * 6);
    const randomVal = 4;

    if (randomVal > 3) {
      resolve({repoId: 230, repName: 'Learning Node.js', commits: ['commit1', 'commit2', 'commit3']});
    } else {
      reject(new Error('Oops! Could not complete asyncOp2.'));
    }
  }, 2000);
});

/**
 * Using the Promise.all() to run promises in parallel.
 * 
 * Promise.all() takes an array of promises and returns a new promise which
 * either resolves with an array of results or rejects if any of the promise provided
 * in the array is rejected.
*/
Promise.all([asyncOp1, asyncOp2])
  .then(result => console.log('Result promise.all: ', result))
  .catch(error => console.log('Error: ', error));


  const asyncOp3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      // const randomVal = Math.floor(Math.random() * 6);
      const randomVal = 5;
  
      if (randomVal > 3) {
        resolve({id: 23, username: 'Christopher'});
      } else {
        reject(new Error('Oops! Could not complete asyncOp1.'));
      }
    }, 3000);
  });
  
  const asyncOp4 = new Promise((resolve, reject) => {
    setTimeout(() => {
      // const randomVal = Math.floor(Math.random() * 6);
      const randomVal = 4;
  
      if (randomVal > 3) {
        resolve({repoId: 230, repName: 'Learning Node.js', commits: ['commit1', 'commit2', 'commit3']});
      } else {
        reject(new Error('Oops! Could not complete asyncOp2.'));
      }
    }, 2000);
  });
/**
 * Using the Promise.race() to run promises in parallel.
 * 
 * Promise.race() takes an array of promises and returns a new promise out of
 * any of the promises provided in the array which either is resolved first
 * or is rejected first.
*/
Promise.race([asyncOp3, asyncOp4])
  .then(result => console.log('Result promise.race: ', result))
  .catch(error => console.log('Error: ', error));
