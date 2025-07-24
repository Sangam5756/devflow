class BaseError extends Error {
  constructor(name, statuscode, message, details) {
    super(message);
    this.name = name || "BaseError";
    this.statuscode = statuscode || 500;
    this.details = details || null;
  }
}

module.exports = BaseError;
