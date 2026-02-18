// React-related imports
import React, { useState, useEffect } from 'react';

// Chakra UI imports
import { Box, Drawer, useDisclosure, useColorModeValue } from '@chakra-ui/react';

// Motion import
import { motion, AnimatePresence } from 'framer-motion';

// Custom component imports
import SidebarContent from './SidebarContent';
import MobileSidebar from './MobileSidebar';

// Project-specific logic import
import { userMarketLogic } from '../contentRenderer';

interface SidebarWithHeaderProps {
  initialSelectedLink?: string; // Optional prop for initial selected link
}

// Motion-wrapped Chakra components
const MotionBox = motion(Box);
const MotionDrawerContent = motion(Box);

const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = ({
  initialSelectedLink = 'Home',
}) => {
  const [selectedLink, setSelectedLink] = useState(initialSelectedLink);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLinkClick = (linkName: string) => {
    setSelectedLink(linkName);
    onClose();
  };

  useEffect(() => {
    handleLinkClick(initialSelectedLink);
  }, [initialSelectedLink]);

  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail) {
        handleLinkClick(e.detail);
      }
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const sidebarTransition = { type: 'tween', duration: 2, ease: 'easeInOut' };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.950')}>

      {/* Desktop Sidebar */}
      <AnimatePresence>
        <MotionBox
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={sidebarTransition}
          display={{ base: 'none', md: 'block' }}
        >
          <SidebarContent
            onClose={onClose}
            onLinkClick={handleLinkClick}
            selectedLink={selectedLink}
          />
        </MotionBox>
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        size="full"
      >
        <AnimatePresence>
          {isOpen && (
            <MotionDrawerContent
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={sidebarTransition}
            >
              <SidebarContent onClose={onClose} onLinkClick={handleLinkClick} selectedLink={selectedLink} />
            </MotionDrawerContent>
          )}
        </AnimatePresence>
      </Drawer>

      {/* Mobile Top Bar */}
      <MobileSidebar onOpen={onOpen} />

      {/* Main Content */}
      <MotionBox
        ml={{ base: 0, md: 60 }}
        p="4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {userMarketLogic(selectedLink)}
      </MotionBox>
    </Box>
  );
};

export default SidebarWithHeader;