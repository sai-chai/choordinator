import Promise from 'promise';

export const mockStop = jest.fn();

const playFactory = jest.fn(ctx =>
   jest.fn((name, when, options) => {
      const node = ctx.createGain();
      node.stop = mockStop;
      return node;
   }));

export const getMockPlays = () => playFactory.mock.results;

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
