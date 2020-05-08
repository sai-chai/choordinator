jest.mock('soundfont-player');
import { AudioContext as audioContextMock } from 'web-audio-mock-api';
import flushPromises from 'flush-promises';
import Soundfont, {
   getMockPlays,
   mockRejection,
   mockStop,
} from 'soundfont-player';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Collection from '@tonaljs/collection';
import { get as getScale } from '@tonaljs/scale';
import { note } from '@tonaljs/tonal';
import PianoRoll from './index';

describe('<PianoRoll />', () => {
   const scale = 'minor';
   const tonic = 'A3';
   const notes = Collection.rotate(-2, getScale(`${tonic} ${scale}`).notes);
   const keyUpMock = new KeyboardEvent('keyup', {
      code: 'KeyA',
      key: 'a',
      location: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: false,
      isComposing: false,
      charCode: 0,
      keyCode: 65,
      view: window,
      detail: 0,
      which: 65,
      bubbles: false,
      cancelable: true,
      composed: true,
   });
   const keyDownMock = new KeyboardEvent('keydown', {
      code: 'KeyA',
      key: 'a',
      location: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: false,
      isComposing: false,
      charCode: 0,
      keyCode: 65,
      view: window,
      detail: 0,
      which: 65,
      bubbles: false,
      cancelable: true,
      composed: true,
   });
   const wrongKeyMock = new KeyboardEvent('keydown', {
      code: 'KeyR',
      key: 'r',
      location: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: false,
      isComposing: false,
      charCode: 0,
      keyCode: 82,
      view: window,
      detail: 0,
      which: 82,
      bubbles: true,
      cancelable: true,
      composed: true,
   });
   const listenerMap = {};
   window.addEventListener = jest.fn((event, listener) => {
      listenerMap[event] = listener;
   });
   window.removeEventListener = jest.fn((event, listener) => {
      listenerMap[event] = null;
   });
   window.dispatchEvent = jest.fn(event => {
      listenerMap[event.type](event);
   });

   beforeEach(() => {
      window.AudioContext = audioContextMock;
   });

   it('rejection smoke test', async () => {
      Soundfont.instrument.mockImplementationOnce(mockRejection);
      const wrapper = mount(<PianoRoll />);
      await act(async () => {
         await flushPromises();
      });
      const container = wrapper.find('PianoRoll__Container');
      expect(wrapper).toHaveLength(1);
      expect(container).toHaveStyleRule('background-size', '400% 100%');
      expect(container.text()).toContain('Error');
   });

   it('resolution smoke test', async () => {
      const wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
      await act(async () => {
         await flushPromises();
         wrapper.update();
      });
      const keys = wrapper.find('Key');
      expect(keys).toHaveLength(11);
      keys.map((k, i) => {
         expect(k.prop('note').charAt(0)).toEqual(
            note(notes[i >= 7 ? i - 7 : i]).pc,
         );
      });
   });

   it('plays note F3 on keydown and stops on keyup', async () => {
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
      await act(async () => {
         await flushPromises();
         window.dispatchEvent(keyDownMock);
         await flushPromises();
         window.dispatchEvent(keyUpMock);
      });
      const playMock = getMockPlays()[0].value;
      expect(playMock).toHaveBeenLastCalledWith(note('F3').midi);
      expect(mockStop).toHaveBeenCalledTimes(1);
   });

   it('ignores keys that are already playing or have already stopped playing', async () => {
      let playMock;
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
      await act(async () => {
         await flushPromises();
         playMock = getMockPlays()[0].value;
         window.dispatchEvent(keyDownMock);
         await flushPromises();
         window.dispatchEvent(keyDownMock);
         await flushPromises();
         window.dispatchEvent(keyUpMock);
         await flushPromises();
         window.dispatchEvent(keyUpMock);
      });
      expect(playMock).toHaveBeenCalledTimes(1);
      expect(mockStop).toHaveBeenCalledTimes(1);
   });

   it('ignores non-home-row keys', async () => {
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
      await act(async () => {
         await flushPromises();
         window.dispatchEvent(wrongKeyMock);
         await flushPromises();
      });
      const playMock = getMockPlays()[0].value;
      expect(playMock).not.toHaveBeenCalled();
   });

   it('cleans up promises in onMount effect', async () => {
      const errorSpy = jest.spyOn(console, 'error');
      let error, wrapper;
      try {
         wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
         // without effect cleanup, this would throw a warning
         // about setting state on an unmounted component
         await act(async () => {
            wrapper.unmount();
            await flushPromises();
         });
      } catch (e) {
         error = e;
      }
      // Testing for both resolve and reject states
      Soundfont.instrument.mockImplementationOnce(mockRejection);
      try {
         wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
         await act(async () => {
            wrapper.unmount();
            await flushPromises();
            wrapper.update();
         });
      } catch (e) {
         error = e;
      }
      expect(error).toBeUndefined();
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
   });

   it('uses the workaround for Safari', async () => {
      window.AudioContext = undefined;
      window.webkitAudioContext = audioContextMock;
      // eslint-disable-next-line no-unused-vars
      const wrapper = mount(<PianoRoll scale={scale} tonic={tonic} />);
      await act(async () => {
         await flushPromises();
         window.dispatchEvent(keyDownMock);
         await flushPromises();
      });
      expect(getMockPlays()[0].value).toHaveBeenCalledTimes(1);
   });
});
