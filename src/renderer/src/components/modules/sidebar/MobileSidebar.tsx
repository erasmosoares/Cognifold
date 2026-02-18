// React-related import
import React from 'react';

// Project-specific imports
import ColorModeSwitch from '../../shared/color-mode-switch/ColorModeSwitch';
import { MobileProps } from '../../types';

// Chakra UI imports
import { HStack, Text, IconButton, Flex } from '@chakra-ui/react';

// Icon import
import { FiMenu } from 'react-icons/fi';

// Custom component import



const MobileSidebar: React.FC<MobileProps> = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      bg="transparent"
      backdropFilter="blur(10px)"
      position="relative"
      {...rest}>

      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="ghost"
        color="teal.400"
        _hover={{ bg: 'whiteAlpha.200' }}
        aria-label="open menu"
        icon={<FiMenu size={24} />}
      />

      <Text
        fontSize="2xl"
        ml="8"
        fontWeight="black"
        letterSpacing="tighter"
        bgGradient="linear(to-r, teal.400, purple.500)"
        bgClip="text"
        display={{ base: 'flex', md: 'none' }}
      >
        COGNIFOLD
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <ColorModeSwitch />
        <Flex alignItems={'center'}>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileSidebar;
