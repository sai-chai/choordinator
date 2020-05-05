import React from 'react';
import { mount } from 'enzyme';
import Key from './index';

describe('<Key />', () => {
   it('smoke test', () => {
      const wrapper = mount(
         <Key note="A#" onMouseDown={() => {}} onMouseUp={() => {}} />,
      );
      expect(wrapper).toHaveLength(1);
   });

   it('background changes depending on whether note has an accidental', () => {
      const wrapper = mount(
         <Key black note="A#" onMouseDown={() => {}} onMouseUp={() => {}} />,
      );
      expect(wrapper.find('button')).toHaveStyleRule('background', '#000');
   });

   it('background changes depending on whether note is pressed', () => {
      const wrapper = mount(
         <Key
            black
            pressed
            note="A#"
            onMouseDown={() => {}}
            onMouseUp={() => {}}
         />,
      );
      expect(wrapper.find('button')).toHaveStyleRule('background', '#4f4f4f');

      wrapper.setProps({ black: false });
      expect(wrapper.find('button')).toHaveStyleRule('background', '#e3e3e3');
   });
});
