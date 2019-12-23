import React from 'react';
import { mount } from 'enzyme';
import ArrowSelect from './index';


describe("<ArrowSelect />", () => {
   const optionsMock = ["A3", "A#3", "B3", "C4", "C#4", "D4"];
   let value = 'A#3';
   const setValue = v => (value = v);
   const mockEvent = { preventDefault: () => {} };
   it("smoke test", () => {
      const wrapper = mount(
         <ArrowSelect
            name="tonic"
            value={value}
            options={optionsMock}
            setValue={setValue}
         />
      );
      expect(wrapper.length).toEqual(1);
   });

   it("left arrow decrements w/o going out-of-bounds", () => {
      const wrapper = mount(
         <ArrowSelect
            name="tonic"
            value={value}
            options={optionsMock}
            setValue={setValue}
         />
      );
      const button = wrapper.find('button[name="left-arrow"]');
      button.simulate('click', mockEvent);
      expect(value).toEqual("A3");
      wrapper.setProps({ value });
      button.simulate('click', mockEvent);
      expect(value).toEqual("A3");
   });

   it("right arrow increments w/o going out-of-bounds", () => {
      value = "C#4";
      const wrapper = mount(
         <ArrowSelect
            name="tonic"
            value={value}
            options={optionsMock}
            setValue={setValue}
         />
      );
      const button = wrapper.find('button[name="right-arrow"]');
      button.simulate('click', mockEvent);
      expect(value).toEqual("D4");
      wrapper.setProps({ value });
      button.simulate('click', mockEvent);
      expect(value).toEqual("D4");
   });
});
