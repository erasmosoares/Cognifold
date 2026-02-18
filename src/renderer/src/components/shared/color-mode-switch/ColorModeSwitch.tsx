import { HStack, Switch, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack spacing={2}>
      {colorMode === "dark" ? <MoonIcon boxSize={6} /> : <SunIcon boxSize={6} />}
      <Switch
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
        variant="outline"
        colorScheme="teal"
      />
    </HStack>
  );
};

export default ColorModeSwitch;
