/**
 * A promise is an object that holds the eventual result of
 * an asynchronous operation
*/
const userPromise = new Promise((resolve, reject) => {
  // Kicking off an asynchronous operation
  setTimeout(() => {
    const randomVal = Math.floor(Math.random() * 10);

    if (randomVal >= 5) {
      // Pending to resolve
      resolve({id: 254, username: 'Christopher'});
    } else {
      // Pending to reject
      reject(new Error('Sorry, could not fetch user.'));
    }
  }, 2000);
});

/**
 * Consuming the promise.
 * 
 * Use the then() method to get the value resolved by the promise.
 * Use the catch() method to get the error rejected by the promise.
*/
userPromise.then(result => {
  console.log('Result: ', result);
}).catch(error => {
  console.log('Error: ', error.message);
});
