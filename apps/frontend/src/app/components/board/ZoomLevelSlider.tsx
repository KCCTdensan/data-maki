import { Flex, FormControl, Option, Select, Slider, SliderMark } from "@yamada-ui/react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export const ZoomLevelSlider = ({ value, onChange }: Props) => {
  return (
    <Flex align="center" gap={10} w="40vw" minW={300}>
      <FormControl label="Zoom level" flex={1}>
        <Slider value={value} min={0.4} max={2.0} step={0.1} onChange={onChange}>
          <SliderMark value={0.4} ml={-4}>
            40%
          </SliderMark>
          <SliderMark value={0.7} ml={-4}>
            70%
          </SliderMark>
          <SliderMark value={1.0} ml={-4}>
            100%
          </SliderMark>
          <SliderMark value={1.5} ml={-4}>
            150%
          </SliderMark>
          <SliderMark value={2.0} ml={-4}>
            200%
          </SliderMark>

          <SliderMark
            value={value}
            bg="blue.500"
            color="white"
            rounded="md"
            w={14}
            mt={-10}
            ml={-6}
            fontFeatureSettings='"tnum"'
          >
            {Math.floor(value * 100)}%
          </SliderMark>
        </Slider>
      </FormControl>
      <Select
        placeholder="Zoom..."
        placeholderInOptions={false}
        maxW={110}
        mt={8}
        onChange={(value) => onChange(+value)}
      >
        <Option value="0.4">40%</Option>
        <Option value="0.7">70%</Option>
        <Option value="1">100%</Option>
        <Option value="1.5">150%</Option>
        <Option value="2">200%</Option>
      </Select>
    </Flex>
  );
};
