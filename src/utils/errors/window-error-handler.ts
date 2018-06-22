export class WindowErrorHandler {
    /**
     * Calls the window.onerror function. Use this method for errors that cannot be handled by the window.onerror standard handler.
     * Mostly, this method will be used to provide retroaction on Promise errors.
     * @param error The unhandled error.
     * @param defer True will delay the execution of the call to the next cyle, allowing, for example, stopping the propagation of the error in the promise chain. Default is false.
     */
    public static onError(error: ErrorEvent, defer: boolean = false): void {
        let call: () => any = () => {
            if (!error.cancelBubble) {
                window.dispatchEvent(error);
            }
        };
        defer ? setTimeout(() => call(), 0) : call();
    }
}
