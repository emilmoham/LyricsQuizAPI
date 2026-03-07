const ApiError = require('./ApiError');

class ApiResponse {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static Ok(data) {
    return new ApiResponse(true, data, null);
  }

  static Fail(code, message) {
    return new ApiResponse(false, null, new ApiError(code, message));
  }
}

module.exports = ApiResponse;
