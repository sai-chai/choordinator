import { useRef, useEffect, useCallback } from 'react';

export function makeCancellable(promise) {
   let isCanceled = false;

   // eslint-disable-next-line no-undef
   const wrappedPromise = new Promise((resolve, reject) => {
      promise
         .then(val =>
            isCanceled ? reject({ isCanceled: true }) : resolve(val),
         )
         .catch(error =>
            isCanceled ? reject({ isCanceled: true }) : reject(error),
         );
   });

   return {
      promise: wrappedPromise,
      cancel() {
         isCanceled = true;
      },
   };
}

export default function useCancellablePromise(cancellable = makeCancellable) {
   const promises = useRef();
   const trueCancellable = useRef(cancellable);

   useEffect(() => {
      // eslint-disable-next-line no-undef
      const emptyPromise = Promise.resolve(true);
      if (trueCancellable.current(emptyPromise).cancel === undefined) {
         throw new Error(
            'promise wrapper argument must provide a cancel() function',
         );
      }
      promises.current = promises.current || [];
      return function () {
         promises.current.forEach(p => p.cancel());
         promises.current = [];
      };
   }, []);

   const registerPromise = useCallback(function cancellablePromise(promise) {
      const result = trueCancellable.current(promise);
      promises.current.push(result);
      return result.promise;
   }, []);

   return registerPromise;
}
