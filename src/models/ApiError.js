class ApiError {
  constructor(code, message) {
    this.code = code;
    this.error = message;
  }
}

module.exports = ApiError;
