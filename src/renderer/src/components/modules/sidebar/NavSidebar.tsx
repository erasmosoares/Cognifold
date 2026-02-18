import React from 'react';
import { Box, Flex, Icon, Text, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { NavItemProps } from '../../types';

const MotionFlex = motion(Flex);

const NavSidebar: React.FC<NavItemProps> = ({ icon, children, isActive, ...rest }) => {
  const activeBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100');
  const activeColor = useColorModeValue('teal.600', 'teal.300');
  const iconColor = useColorModeValue('gray.500', 'whiteAlpha.600');
  const textColor = useColorModeValue('gray.600', 'whiteAlpha.700');
  const accentColor = '#38B2AC'; // teal.400

  return (
    <Box
      as="a"
      href="#"
      textDecoration="none"
      _focus={{ boxShadow: 'none' }}
      _hover={{ textDecoration: 'none' }}
      position="relative"
    >
      <MotionFlex
        align="center"
        justify="flex-start"
        gap={3}
        p="3"
        mx="2"
        my="1"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        transition={{ duration: 0.2 }}
        color={isActive ? activeColor : textColor}
        bg={isActive ? activeBg : 'transparent'}
        backdropFilter={isActive ? 'blur(10px)' : 'none'}
        border="1px solid"
        borderColor={isActive ? 'whiteAlpha.300' : 'transparent'}
        boxShadow={isActive ? `0 0 20px rgba(56, 178, 172, 0.15)` : 'none'}
        _hover={{
          bg: activeBg,
          color: activeColor,
          backdropFilter: 'blur(10px)',
          borderColor: 'whiteAlpha.400',
        }}
        {...rest}
      >
        {/* Neon Indicator - technical style */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            style={{
              position: 'absolute',
              left: '0px',
              width: '3px',
              height: '20px',
              borderRadius: '2px',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        )}

        {icon && (
          <Icon
            as={icon}
            boxSize={5}
            color={isActive ? activeColor : iconColor}
            _groupHover={{
              color: activeColor,
              transform: 'scale(1.1)',
            }}
            transition="all 0.2s ease"
          />
        )}

        <HStack spacing={2} align="center" flex={1}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="0.05em"
            _groupHover={{ color: activeColor }}
            transition="color 0.2s ease"
            lineHeight="1"
            pt={"2px"} // Fine-tuning vertical alignment
          >
            {children}
          </Text>
          {isActive && <Box boxSize="4px" borderRadius="full" bg={accentColor} boxShadow={`0 0 5px ${accentColor}`} />}
        </HStack>
      </MotionFlex>
    </Box>
  );
};

export default NavSidebar;