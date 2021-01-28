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
