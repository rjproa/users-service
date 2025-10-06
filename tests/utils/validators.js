validateNotEmpty = (received) => {
  expect(received).not.toBeNull();
  expect(received).not.toBeUndefined();
  expect(received).toBeTruthy();
};


validateStringEquality = (received, expected) => {
  expect(received).toEqual(expected);
};


validateMongoDuplicationError = (name, code) => {
  expect(name).not.toEqual(/dummy/i);
  expect(name).toEqual('MongoServerError');
  expect(code).not.toBe(255);
  expect(code).toBe(11000);
};

module.exports = {
  validateNotEmpty,
  validateStringEquality,
  validateMongoDuplicationError
}