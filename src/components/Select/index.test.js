import React from 'react';
import { mount } from 'enzyme';
import Select from './index';


describe("<Select />", () => {
   const optionsMock = ['mixolydian', 'harmonic major', 'minor'];
   let value = 'harmonic major';
   const setValue = v => (value = v);
   const mockEvent = { target: { blur: jest.fn(() => {}), value: 'minor' } };

   it("smoke test", () => {
      const wrapper = mount(
         <Select
            name="scale"
            options={optionsMock}
            value={value}
            setValue={setValue}
         />
      );

      expect(wrapper.length).toEqual(1);
   });
   it("sets value on change", () => {
      const wrapper = mount(
         <Select
            name="scale"
            options={optionsMock}
            value={value}
            setValue={setValue}
         />
      );
      wrapper.find('select').simulate('change', mockEvent);

      expect(value).toEqual(mockEvent.target.value);
      expect(mockEvent.target.blur).toHaveBeenCalled();
   });
});
