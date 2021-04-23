export class NoServiceException extends Error {
    constructor(message: string) {
        super(message);
    }
}