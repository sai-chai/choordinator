jest.mock('soundfont-player');
import { AudioContext } from 'web-audio-mock-api';
import flushPromises from 'flush-promises';
import Soundfont, {
   getMockPlays,
   mockRejection,
   mockStop,
} from 'soundfont-player';
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
   const wrongKeyMock = { code: 'KeyR', type: 'keydown' };

   it("rejection smoke test", async () => {
      Soundfont.instrument.mockImplementationOnce(mockRejection);
      const wrapper = mount(
         <PianoRoll />
      );
      await act(async () => {
         await flushPromises();
      });
      const container = wrapper.find('PianoRoll__Container');
      expect(wrapper).toHaveLength(1);
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
      expect(keys).toHaveLength(11);
      keys.map((k, i) => {
         expect(k.prop('note').charAt(0))
            .toEqual(note(notes[i >= 7 ? i - 7 : i]).pc);
      });
   });

   it("plays note F3 on keydown and stops on keyup", async () => {
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         window.onkeydown(keyDownMock);
         await flushPromises();
      });
      const playMock = getMockPlays()[0].value;
      expect(playMock).toHaveBeenLastCalledWith(note('F3').midi);

      await act(async () => {
         window.onkeyup(keyUpMock);
         await flushPromises();
      });
      expect(mockStop).toHaveBeenCalledTimes(1);
   });

   it("ignores keys that are already playing or have already stopped playing", async () => {
      let playMock;
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         playMock = getMockPlays()[0].value;
         window.onkeydown(keyDownMock);
         await flushPromises();
         window.onkeydown(keyDownMock);
         await flushPromises();
         window.onkeyup(keyUpMock);
         await flushPromises();
         window.onkeyup(keyUpMock);
      });
      expect(playMock).toHaveBeenCalledTimes(1);
      expect(mockStop).toHaveBeenCalledTimes(1);
   });

   it("ignores non-home-row keys", async () => {
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         window.onkeydown(wrongKeyMock);
         await flushPromises();
      });
      const playMock = getMockPlays()[0].value;
      expect(playMock).not.toHaveBeenCalled();
   });

   it("cleans up promises in onMount effect", async () => {
      const errorSpy = jest.spyOn(console, 'error');
      let error, wrapper;
      try {
         wrapper = mount(
            <PianoRoll
               scale={scale}
               tonic={tonic}
            />
         );
         // without effect cleanup, this would throw a warning
         // about setting state on an unmounted component
         await act(async () => {
            wrapper.unmount();
            await flushPromises();
         });
      } catch (e) {
         error = e;
      }
      Soundfont.instrument.mockImplementationOnce(mockRejection);
      try {
         wrapper = mount(
            <PianoRoll
               scale={scale}
               tonic={tonic}
            />
         );
         await act(async () => {
            wrapper.unmount();
            await flushPromises();
         });
      } catch (e) {
         error = e;
      }
      expect(error).toBeUndefined();
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
   });

   it("uses the workaround for Safari", async () => {
      window.AudioContext = undefined;
      window.webkitAudioContext = AudioContext;
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(
         <PianoRoll
            scale={scale}
            tonic={tonic}
         />
      );
      await act(async () => {
         await flushPromises();
         window.onkeydown(keyDownMock);
         await flushPromises();
      });
      expect(getMockPlays()[0].value).toHaveBeenCalledTimes(1);
   });
});
