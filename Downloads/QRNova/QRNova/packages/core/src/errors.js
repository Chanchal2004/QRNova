/**
 * Error thrown by QRNova for invalid input or options.
 * `code` is a stable, machine-readable identifier (e.g. "DATA_TOO_LONG").
 */
export class QRNovaError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "QRNovaError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}
