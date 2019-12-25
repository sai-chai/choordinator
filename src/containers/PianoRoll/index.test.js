jest.mock('soundfont-player');
import { AudioContext } from 'web-audio-mock-api';
import flushPromises from 'flush-promises';
import Soundfont, { playFactory, mockRejection } from 'soundfont-player';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { rotate } from '@tonaljs/array';
import { scale as scaleInfo } from '@tonaljs/scale';
import { note } from '@tonaljs/tonal';
import PianoRoll from './index';

describe("<PianoRoll />", () => {
   const scale = 'minor';
   const tonic = 'A3';
   const notes = rotate(-2, scaleInfo(`${tonic} ${scale}`).notes);
   window.AudioContext = AudioContext;
   const keyUpMock = { code: 'KeyA', type: 'keyup' };
   const keyDownMock = { code: 'KeyA', type: 'keydown' };

   beforeEach(() => {
      playFactory.mockClear();
   });

   it("rejection smoke test", async () => {
      Soundfont.instrument.mockImplementationOnce(mockRejection);
      const wrapper = mount(
         <PianoRoll />
      );
      await act(async () => {
         await flushPromises();
      });
      const container = wrapper.find('PianoRoll__Container');
      expect(wrapper.length).toEqual(1);
      expect(container)
         .toHaveStyleRule('background-size', '400% 100%');
      expect(container.text()).toEqual('Error');
   });

   it("resolution smoke test", async () => {
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         wrapper.update();
      });
      const keys = wrapper.find('Key');
      expect(keys.length).toEqual(11);
      keys.map((k, i) => {
         expect(k.prop('note').charAt(0))
            .toEqual(note(notes[i >= 7 ? i - 7 : i]).pc);
      });
   });

   it("plays note F3 on keydown and stops on keyup", async () => {
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         window.onkeydown(keyDownMock);
         window.onkeyup(keyUpMock);
         wrapper.update();
      });
      const playMock = playFactory.mock.results[0].value;
      expect(playMock).toHaveBeenLastCalledWith(note('F3').midi);
   });
});
