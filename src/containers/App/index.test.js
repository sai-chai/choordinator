jest.mock('soundfont-player');
import { AudioContext } from 'web-audio-mock-api';
import flushPromises from 'flush-promises';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import App from './index';

describe('<PianoRoll />', () => {
   window.AudioContext = AudioContext;

   it('smoke test', async () => {
      const wrapper = shallow(<App />);
      await act(async () => {
         await flushPromises();
      });
      expect(wrapper).toMatchSnapshot();
   });
});
