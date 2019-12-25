import Promise from 'promise';

export const playFactory = jest.fn(ctx => jest.fn((name, when, options) => ctx.createGain()));

export const mockRejection = (ac, name, options) =>
   new Promise(
      (resolve, reject) =>
         (reject('Smoke test'))
   );

const mock = {
   instrument: jest.fn((ac, name, options) =>
      new Promise((resolve, reject) => {
         resolve({
            play: playFactory(ac),
         });
      })),
};

export default mock;
