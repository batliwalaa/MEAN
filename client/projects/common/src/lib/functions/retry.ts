import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";
import { HttpStatusCode } from "../types/http-status-codes";

const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BACKOFF = 500;

export function retry<T>(
    delayMs: number,
    maxRetry: number = DEFAULT_MAX_RETRIES,
    backoffMs: number = DEFAULT_BACKOFF
) {
    let retries = maxRetry;
    const noRetryStatusCodes = [
        HttpStatusCode.BadRequest,
        HttpStatusCode.Unauthorized,
        HttpStatusCode.NotFound,
        HttpStatusCode.Forbidden
    ];
    
    return (src: Observable<T>) =>
        src.pipe (
            retryWhen((errors: Observable<T>) => 
                errors.pipe(
                    mergeMap((error: any) => {                        
                        if (!noRetryStatusCodes.includes(error.status) && retries-- > 0) {
                            const backoffTime = delayMs + (maxRetry - retries) * backoffMs;
                            return of(error).pipe(delay(backoffTime));
                        }
                        return throwError(error);
                    })
                )
            )
        );
}
