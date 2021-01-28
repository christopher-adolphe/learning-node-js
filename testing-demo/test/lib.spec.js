const lib = require('../lib');

// Using #describe to group related unit tests
describe('#absolute', () => {
  let inputValue;

  // Using #it to setup each unit test
  it('should return a positive number given the input number is positive', () => {
    // Arrange
    inputValue = 1;

    // Act
    const result = lib.absolute(inputValue);

    // Assert
    expect(result).toBe(1);
  });

  it('should return a positive number given the input number is negative', () => {
    // Arrange
    inputValue = -1;
    
    // Act
    const result = lib.absolute(inputValue);

    // Assert
    expect(result).toBe(1);
  });

  it('should return zero given the input number is zero', () => {
    // Arrange
    inputValue = 0;
    
    // Act
    const result = lib.absolute(inputValue);

    // Assert
    expect(result).toBe(0);
  });
});

describe('#greet', () => {
  it('should return a greeting message' , () => {
    const inputString = 'John';

    const result = lib.greet(inputString);

    expect(result).toMatch(/Welcome John/);
  });

  it('should return a greeting message containing the input string' , () => {
    const inputString = 'Jane';

    const result = lib.greet(inputString);

    expect(result).toMatch(/Jane/);
  });
});

describe('#getCurrencies', () => {
  it('should return a list of currencies', () => {
    const result = lib.getCurrencies();

    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a list of supported currencies', () => {
    const supportedCurrencies = ['AUD', 'EUR', 'USD'];
    const result = lib.getCurrencies();

    expect(result).toEqual(expect.arrayContaining(supportedCurrencies));
  });
});

describe('#getProduct', () => {
  it('should return a product with the given id', () => {
    const id = 1;

    const result = lib.getProduct(1);

    expect(result).toMatchObject({ id, price: 10});
  });

  it('should return a product with property #id', () => {
    const id = 1;

    const result = lib.getProduct(1);

    expect(result).toHaveProperty('id', 1);
  })
});

describe('#registerUser', () => {
  it('should throw an exception given username is falsy', () => {
    const params = [null, undefined, NaN, '', 0, false];

    for (const param of params) {
      expect(() => { lib.registerUser(param) }).toThrow(Error);
    }
  });

  it('should return a user object given a username is provided', () => {
    const username = 'Janette';

    const result = lib.registerUser(username);

    expect(result).toMatchObject( { username });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe('#fizzBuzz', () => {
  it('should throw an exception given the parameter provided is not a number', () => {
    const params = ['param', false, undefined, { id: 1, username: 'Joe' }];

    for (const param of params) {
      expect(() => { lib.fizzBuzz(param) }).toThrow(Error);
    }
  });

  it('should return a string containing FizzBuzz given the parameter is divisible by 3 and 5', () => {
    const params = [15, 30, 45, 60, 75];

    for (const param of params) {
      const result = lib.fizzBuzz(param);

      expect(result).toBe('FizzBuzz');
    }
  });

  it('should return a string containing Fizz given the parameter is onlyd divisible by 3', () => {
    const params = [3, 6, 9, 12];

    for (const param of params) {
      const result = lib.fizzBuzz(param);

      expect(result).toBe('Fizz');
    }
  });

  it('should return a string containing Buzz given the parameter is only divisible by 5', () => {
    const params = [5, 10, 20, 25];

    for (const param of params) {
      const result = lib.fizzBuzz(param);

      expect(result).toBe('Buzz');
    }
  });

  it('should return the input number given the parameter is not divisible by 3 or 5', () => {
    const params = [2, 4, 7, 11];

    for (const param of params) {
      const result = lib.fizzBuzz(param);

      expect(result).toBe(param);
    }
  });
});
