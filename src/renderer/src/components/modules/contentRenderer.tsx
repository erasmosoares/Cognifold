import { AGENTS } from '../../config/agents';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components imports
import Feature from '../modules/home/Feature';
import Settings from './settings/Settings';
import FinancialResearchForm from './analysis/FinancialResearchForm';
import ReviewSpecialistsForm from './analysis/ReviewSpecialistsForm';
import ConversationalAgents from './conversational/ConversationalAgents';
import ContributionView from './contribution/ContributionView';

// Hook
import { useContentRenderer } from '@renderer/hooks/useContentRenderer';

// Managing the common logic
export const userMarketLogic = (selectedLink: string) => {
  const state = useContentRenderer();

  const {
    selectedTabAnalysis,
    setSelectedTabAnalysis,
    selectedTabEntertainment,
    setSelectedTabEntertainment,
    showWelcomeModal,
    handleCloseModal,
  } = state;

  // Global Futuristic Colors
  const mainBg = useColorModeValue(
    "radial-gradient(circle at 50% 50%, #f7fafc 0%, #edf2f7 100%)",
    "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d0d15 100%)"
  );
  const gridOpacity = useColorModeValue(0.03, 0.05);
  const gridLineColor = useColorModeValue('#000000', '#ffffff');
  const accentGradient = 'linear(to-r, #FF0080, #7928CA)';

  const panelBg = useColorModeValue("whiteAlpha.900", "rgba(10, 15, 25, 0.6)");
  const panelBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

  const tabTextColor = useColorModeValue('gray.500', 'gray.400');
  const tabListBg = useColorModeValue('whiteAlpha.600', 'blackAlpha.700');
  const tabListBorder = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');

  const renderWithShell = (content: React.ReactNode) => (
    <Box
      minH="calc(100vh - 80px)"
      p={4}
      background={mainBg}
      position="relative"
      overflow="hidden"
      borderRadius="3xl"
      m={2}
    >
      {/* Background Grid Overlay */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        opacity={gridOpacity}
        backgroundImage={`radial-gradient(${gridLineColor} 1px, transparent 1px)`}
        backgroundSize="40px 40px"
      />
      <Box position="relative" zIndex={1} h="full">
        {content}
      </Box>
    </Box>
  );

  switch (selectedLink) {
    case 'Contribution':
      return renderWithShell(<ContributionView />);
    case 'Home':
      return renderWithShell(
        <VStack spacing={8} align="stretch" p={4}>
          <Feature />
          {/* Welcome Modal */}
          <Modal isOpen={showWelcomeModal} onClose={handleCloseModal} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent
              bg={panelBg}
              border="1px solid"
              borderColor={panelBorder}
              borderRadius="3xl"
              boxShadow="2xl"
              backdropFilter="blur(20px)"
            >
              <ModalHeader fontSize="2xl" fontWeight="black" textAlign="center" pt={8} letterSpacing="wider">
                COGNIFOLD_OS
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={8} px={10}>
                <VStack spacing={6} align="center" textAlign="center">
                  <Box fontSize="md" color={tabTextColor} letterSpacing="tight">
                    Your unified aggregation platform for specialized AI agents.
                    Research, advise, and explore new dimensions of intelligence.
                  </Box>
                  <Feature />
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      );

    case 'Financial Agents':
      return renderWithShell(
        <Box p={4}>
          <Tabs
            index={selectedTabAnalysis}
            onChange={(index) => setSelectedTabAnalysis(index)}
            variant="soft-rounded"
          >
            <TabList
              mb="2em"
              p={1}
              bg={tabListBg}
              backdropFilter="blur(15px)"
              borderRadius="full"
              border="1px solid"
              borderColor={tabListBorder}
              boxShadow="xl"
              justifyContent="center"
              gap={2}
              maxW="fit-content"
              mx="auto"
            >
              <Tab
                px={8}
                py={3}
                fontSize="xs"
                fontWeight="black"
                textTransform="uppercase"
                letterSpacing="widest"
                color={tabTextColor}
                borderRadius="full"
                transition="all 0.3s"
                _selected={{
                  color: "white",
                  bgGradient: accentGradient,
                  boxShadow: "0 0 20px rgba(255, 0, 128, 0.3)",
                }}
              >
                Financial Researcher
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={4}>
                <FinancialResearchForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      );

    case 'Entertainment Agents':
      return renderWithShell(
        <Box p={4} h="full">
          <Tabs
            index={selectedTabEntertainment}
            onChange={(index) => setSelectedTabEntertainment(index)}
            variant="soft-rounded"
          >
            <TabList
              mb="2em"
              p={1}
              bg={tabListBg}
              backdropFilter="blur(15px)"
              borderRadius="full"
              border="1px solid"
              borderColor={tabListBorder}
              boxShadow="xl"
              justifyContent="center"
              gap={2}
              maxW="fit-content"
              mx="auto"
            >
              <Tab
                px={8}
                py={3}
                fontSize="xs"
                fontWeight="black"
                textTransform="uppercase"
                letterSpacing="widest"
                color={tabTextColor}
                borderRadius="full"
                transition="all 0.3s"
                _selected={{
                  color: "white",
                  bgGradient: accentGradient,
                  boxShadow: "0 0 20px rgba(255, 0, 128, 0.3)",
                }}
              >
                Review Specialists
              </Tab>
            </TabList>

            <TabPanels h="full">
              <TabPanel p={0} pt={4} h="full">
                <ReviewSpecialistsForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      );

    case 'Conversational Agents':
      const { selectedTabConversational, setSelectedTabConversational } = state;
      return renderWithShell(
        <Box p={4} h="full">
          <Tabs
            index={selectedTabConversational}
            onChange={(index) => setSelectedTabConversational(index)}
            variant="soft-rounded"
          >
            <TabList
              mb="2em"
              p={1}
              bg={tabListBg}
              backdropFilter="blur(15px)"
              borderRadius="full"
              border="1px solid"
              borderColor={tabListBorder}
              boxShadow="xl"
              justifyContent="center"
              gap={2}
              maxW="fit-content"
              mx="auto"
            >
              <Tab
                px={8}
                py={3}
                fontSize="xs"
                fontWeight="black"
                textTransform="uppercase"
                letterSpacing="widest"
                color={tabTextColor}
                borderRadius="full"
                transition="all 0.3s"
                _selected={{
                  color: "white",
                  bgGradient: "linear(to-r, blue.500, purple.500)",
                  boxShadow: "0 0 20px rgba(66, 153, 225, 0.3)",
                }}
              >
                Cognifold Agent
              </Tab>
              <Tab
                px={8}
                py={3}
                fontSize="xs"
                fontWeight="black"
                textTransform="uppercase"
                letterSpacing="widest"
                color={tabTextColor}
                borderRadius="full"
                transition="all 0.3s"
                _selected={{
                  color: "white",
                  bgGradient: "linear(to-r, pink.500, purple.500)",
                  boxShadow: "0 0 20px rgba(237, 100, 166, 0.3)",
                }}
              >
                Therapy Agent
              </Tab>
            </TabList>

            <TabPanels h="full">
              <TabPanel p={0} pt={4} h="full">
                <ConversationalAgents
                  agentName={AGENTS.COGNIFOLD.name}
                  endpoint={AGENTS.COGNIFOLD.endpoint}
                  accentColor={AGENTS.COGNIFOLD.accentColor}
                  systemLabel={AGENTS.COGNIFOLD.systemLabel}
                  placeholder={AGENTS.COGNIFOLD.placeholder}
                />
              </TabPanel>
              <TabPanel p={0} pt={4} h="full">
                <ConversationalAgents
                  agentName={AGENTS.THERAPY.name}
                  endpoint={AGENTS.THERAPY.endpoint}
                  accentColor={AGENTS.THERAPY.accentColor}
                  systemLabel={AGENTS.THERAPY.systemLabel}
                  placeholder={AGENTS.THERAPY.placeholder}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      );

    case 'Settings':
      return renderWithShell(<Settings />);

    default:
      return renderWithShell(
        <VStack spacing={8} align="stretch" p={4}>
          <Feature />
        </VStack>
      );
  }
};
