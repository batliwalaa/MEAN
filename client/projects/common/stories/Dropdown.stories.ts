// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { ILookup } from '@common/src/public-api';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { DropdownComponent } from '../src/lib/component/common/input/dropdown/dropdown.component';

const items: Array<ILookup> = [
    { id: "1", value: "Item 1" },
    { id: "2", value: "Item 2" }
];
export default {
  title: 'Common/DropDown',
  component: DropdownComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  
} as Meta;

const Template: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: args,
});

export const WithItems = Template.bind({});
WithItems.args = {
    items,
    metadata: { pleaseSelect: 'Please select' },
    show: true,
    ngModel: ''
};

