import { Flex, FormControl, Option, Select, Slider, SliderMark } from "@yamada-ui/react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export const ZoomLevelSlider = ({ value, onChange }: Props) => {
  return (
    <Flex align="center" gap={10} minW="40vw">
      <FormControl label="Zoom level" flex={1}>
        <Slider value={value} min={0.1} max={2.0} step={0.1} onChange={onChange}>
          <SliderMark value={0.1} ml={-4}>
            10%
          </SliderMark>
          <SliderMark value={0.5} ml={-4}>
            50%
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
        <Option value="0.1">10%</Option>
        <Option value="0.5">50%</Option>
        <Option value="1">100%</Option>
        <Option value="1.5">150%</Option>
        <Option value="2">200%</Option>
      </Select>
    </Flex>
  );
};
