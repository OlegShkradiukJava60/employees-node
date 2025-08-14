export class AuthenticationError extends Error {
    constructor() {
        super("Authentication Error");
        Object.setPrototypeOf(this, AuthenticationError.prototype)

    }
}
export class AuthorizationError extends Error {
    constructor() {
        super("Authorization Error");
        Object.setPrototypeOf(this, AuthorizationError.prototype)

    }
}