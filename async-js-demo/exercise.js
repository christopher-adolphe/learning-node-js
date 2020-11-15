const getCustomer = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id !== null) {
        resolve({ 
          id: 1, 
          name: 'John Doe', 
          isGold: true, 
          email: 'john.doe@gmail.com' 
        });
      } else {
        reject(new Error(`Sorry, could not get customer with id ${id}.`));
      }
    }, 3000);
  });
};

const getTopMovies = (customer) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (customer !== null && customer.isGold) {
        resolve(['movie1', 'movie2']);
      } else {
        reject(new Error('Sorry, could not fetch top movies.'));
      }
    }, 3000);
  });
};

const sendEmail = (customer, movieList) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (customer !== null && movieList.length) {
        resolve(`Email sent to customer at ${customer.email}`);
      } else {
        reject(new Error('Sorry, could not send email to customer'));
      }
    }, 3000);
  });
};

const notifyGoldCustomer = async () => {
  try {
    const customer = await getCustomer(1);
    console.log('Customer: ', customer);

    const topMovieList = await getTopMovies(customer);
    console.log('Top movies: ', topMovieList);

    const emailMessage = await sendEmail(customer, topMovieList);
    console.log('Message: ', emailMessage);
  } catch(error) {
    console.log('Error: ', error.message);
  }
};

notifyGoldCustomer();
