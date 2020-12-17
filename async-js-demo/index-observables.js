const { Observable } = require('rxjs');

const asyncOp1$ = () => {
  return new Observable((observer) => {
    console.log('Observables are lazy');

    setTimeout(() => {
      observer.next('Observable Notification 1');
      observer.next('Observable Notification 2');
      // observer.error(new Error('Oops... something went wrong'));
      observer.next('Observable Notification 3');
      observer.complete();
    }, 2000);
  })
};

const asyncOp2 = () => {
  return new Promise((resolve, reject) => {
    console.log('Promises are eager');

    setTimeout(() => {
      resolve('Promise Notification 1');
      resolve('Promise Notification 2');
      resolve('Promise Notification 3');
    }, 2000);
  })
};

asyncOp1$().subscribe(
  result => console.log(result),
  error => console.log(error),
  () => console.log('Observable has completed')
);

asyncOp2()
  .then(result => console.log(result))
  .catch(error => console.log(error));
