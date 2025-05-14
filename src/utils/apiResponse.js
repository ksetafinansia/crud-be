/**
 * Standard API response formatter
 */
class ApiResponse {
  /**
   * Success response
   * @param {Object} data - The data to return
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Formatted success response
   */
  static success(data = null, message = 'Operation successful', statusCode = 200) {
    return {
      success: true,
      status: statusCode,
      data,
      message,
    };
  }

  /**
   * Error response
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {String} code - Error code
   * @param {Array|Object} details - Error details
   * @returns {Object} Formatted error response
   */
  static error(message = 'Internal server error', statusCode = 500, code = 'SERVER_ERROR', details = null) {
    return {
      success: false,
      status: statusCode,
      error: {
        code,
        message,
        details,
      },
    };
  }
}

module.exports = ApiResponse;