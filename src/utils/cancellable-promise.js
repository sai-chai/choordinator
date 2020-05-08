import { useRef, useEffect, useCallback } from 'react';

export function makeCancellable(promise) {
   let isCanceled = false;
   let isPending = true;

   // eslint-disable-next-line no-undef
   const wrappedPromise = new Promise((resolve, reject) => {
      promise
         .then(val =>
            isCanceled
               ? reject({
                    message: 'Promise has been canceled',
                    isCanceled: true,
                 })
               : resolve(val),
         )
         .catch(error =>
            isCanceled
               ? reject({
                    message: 'Promise has been canceled',
                    isCanceled: true,
                 })
               : reject(error),
         )
         .finally(() => (isPending = false));
   });

   return {
      promise: wrappedPromise,
      isPending,
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
      promises.current =
         promises.current?.filter(promise => promise.isPending) || [];
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
