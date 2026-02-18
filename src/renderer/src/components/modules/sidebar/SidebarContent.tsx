import React from 'react';
import { LinkItemProps, SidebarProps } from '../../types';
import { Box, Flex, VStack, Text, CloseButton, useColorModeValue } from '@chakra-ui/react';
import NavSidebar from './NavSidebar';
import { FiHome, FiCompass, FiSettings, FiStar, FiActivity } from 'react-icons/fi';

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: 'Financial Agents', icon: FiCompass },
  { name: 'Conversational Agents', icon: FiActivity },
  { name: 'Entertainment Agents', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

interface ExtendedSidebarProps extends SidebarProps {
  selectedLink?: string;
}

const SidebarContent: React.FC<ExtendedSidebarProps> = ({ onClose, onLinkClick, selectedLink, ...rest }) => {
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');
  const accentColor = useColorModeValue('teal.400', 'teal.300');

  return (
    <Box
      transition="all 0.2s"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      bg={'transparent'}
      backdropFilter="blur(30px)"
      borderColor={borderColor}
      boxShadow="r-3xl"
      {...rest}
    >
      {/* Header & Logo */}
      <Flex
        h="24"
        alignItems="center"
        mx="6"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor={borderColor}
        mb={4}
      >
        <VStack align="start" spacing={0}>
          <Text
            fontSize="xs"
            fontWeight="black"
            letterSpacing="0.4em"
            color={accentColor}
            mb={-1}
          >
            PROJECT
          </Text>
          <Text
            fontSize="xl"
            fontWeight="black"
            letterSpacing="0.2em"
            bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
            bgClip="text"
            textShadow={`0 0 20px rgba(56, 178, 172, 0.4)`}
          >
            COGNIFOLD
          </Text>
        </VStack>
        <CloseButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          size="md"
        />
      </Flex>

      {/* Navigation Links */}
      <Box as="nav" mt="4" overflowY="auto" px={2}>
        {LinkItems.map((link) => (
          <NavSidebar
            key={link.name}
            icon={link.icon}
            isActive={selectedLink === link.name}
            onClick={() => onLinkClick(link.name)}
          >
            {link.name}
          </NavSidebar>
        ))}
      </Box>

      {/* Footer: Contribution & Updates */}
      <Box position="absolute" bottom={4} w="full" px={6}>
        <VStack spacing={3} align="start">

          <Box
            onClick={() => onLinkClick('Contribution')}
            cursor="pointer"
            role="group"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              _groupHover={{ color: accentColor }}
              transition="color 0.2s"
              textAlign="center"
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              How to Contribute
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SidebarContent;