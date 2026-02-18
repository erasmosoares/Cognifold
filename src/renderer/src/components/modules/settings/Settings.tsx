// React imports
import { useState, useEffect } from 'react';

// Chakra UI imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  StackDivider,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Switch
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// Component import
import ColorModeSwitch from '../../shared/color-mode-switch/ColorModeSwitch';
import BuyMeACoffee from '@renderer/components/shared/BuyMeACoffee';

const Settings = () => {
  const toast = useToast();
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showSerper, setShowSerper] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);

  const panelBg = useColorModeValue('whiteAlpha.800', 'rgba(10, 15, 25, 0.4)');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const accentColor = 'blue.400';
  const secondaryAccent = 'purple.500';
  const systemTextColor = useColorModeValue('gray.500', 'whiteAlpha.500');

  useEffect(() => {
    const savedOpenAI = localStorage.getItem('OPENAI_API_KEY') || '';
    const savedSerper = localStorage.getItem('SERPER_API_KEY') || '';
    const savedShowTerminal = localStorage.getItem('SHOW_TERMINAL');
    setOpenAIKey(savedOpenAI);
    setSerperKey(savedSerper);
    setShowTerminal(savedShowTerminal === 'true'); // Default to false
  }, []);

  const handleSaveKeys = () => {
    localStorage.setItem('OPENAI_API_KEY', openAIKey);
    localStorage.setItem('SERPER_API_KEY', serperKey);
    toast({
      title: 'Uplink Synchronized',
      description: 'Neural parameters decrypted and stored locally.',
      status: 'success',
      duration: 3000,
    });
  };

  const inputStyle = {
    bg: useColorModeValue('white', 'rgba(0,0,0,0.3)'),
    border: '1px solid',
    borderColor: borderColor,
    borderRadius: 'xl',
    fontSize: 'sm',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    _focus: {
      borderColor: accentColor,
      boxShadow: `0 0 15px rgba(66, 153, 225, 0.2)`
    }
  };

  return (
    <Box p={4} maxW="container.md" mx="auto" pb={20}>
      <VStack align="start" mb={10} spacing={1}>
        <HStack>
          <Box boxSize="8px" bg={accentColor} borderRadius="full" />
          <Text fontSize="10px" fontWeight="black" letterSpacing="0.4em" color={accentColor}>SYSTEM_ACCESS_GRANTED</Text>
        </HStack>
        <Heading size="xl" fontWeight="black" letterSpacing="tight">
          CONFIG_CENTER
        </Heading>
        <Text fontSize="xs" color={systemTextColor} letterSpacing="widest" fontWeight="bold">
          NEURAL_PARAMETERS // ENCRYPTION_LAYER_ACTIVE
        </Text>
      </VStack>

      <Box
        bg={panelBg}
        borderRadius="3xl"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(20px)"
        overflow="hidden"
      >
        <VStack divider={<StackDivider borderColor={borderColor} />} spacing={0} align="stretch">
          {/* Visual Interface Section */}
          <Box p={8}>
            <HStack justify="space-between" mb={6}>
              <VStack align="start" spacing={0}>
                <Text fontSize="10px" fontWeight="black" color={accentColor} letterSpacing="0.4em">VISUAL_ENGINE</Text>
                <Heading size="md" letterSpacing="wider">INTERFACE_MODE</Heading>
              </VStack>
              <ColorModeSwitch />
            </HStack>
            <Text fontSize="xs" color={systemTextColor} fontWeight="bold">
              Customize your visual interface topology for optimal cognitive engagement.
            </Text>
          </Box>

          {/* Developer Tools Section */}
          <Box p={8}>
            <HStack justify="space-between" mb={6}>
              <VStack align="start" spacing={0}>
                <Text fontSize="10px" fontWeight="black" color="green.400" letterSpacing="0.4em">DEVELOPER_TOOLS</Text>
                <Heading size="md" letterSpacing="wider">NEURAL_TERMINAL</Heading>
              </VStack>
              <Switch
                size="lg"
                colorScheme="green"
                isChecked={showTerminal}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setShowTerminal(newValue);
                  localStorage.setItem('SHOW_TERMINAL', String(newValue));
                }}
              />
            </HStack>
            <Text fontSize="xs" color={systemTextColor} fontWeight="bold">
              Display live agent and task logs during deliberation. Useful for debugging and understanding the multi-agent workflow.
            </Text>
          </Box>

          {/* Intelligence Core Section */}
          <Box p={8}>
            <VStack align="start" spacing={1} mb={8}>
              <Text fontSize="10px" fontWeight="black" color={secondaryAccent} letterSpacing="0.4em">INTELLIGENCE_CORE</Text>
              <Heading size="md" letterSpacing="wider">UPLINK_PARAMETERS</Heading>
            </VStack>

            <Stack spacing={6}>
              <FormControl>
                <FormLabel fontSize="10px" fontWeight="black" color={systemTextColor} letterSpacing="widest">
                  [CHANNEL_01] OPENAI_API_UPLINK
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    pr="4.5rem"
                    type={showOpenAI ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    {...inputStyle}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowOpenAI(!showOpenAI)}
                      icon={showOpenAI ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label={showOpenAI ? 'Hide key' : 'Show key'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="10px" fontWeight="black" color={systemTextColor} letterSpacing="widest">
                  [CHANNEL_02] SERPER_DATA_SCAN_UPLINK
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    pr="4.5rem"
                    type={showSerper ? 'text' : 'password'}
                    placeholder="serper-..."
                    value={serperKey}
                    onChange={(e) => setSerperKey(e.target.value)}
                    {...inputStyle}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSerper(!showSerper)}
                      icon={showSerper ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label={showSerper ? 'Hide key' : 'Show key'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                size="lg"
                h="60px"
                bgGradient={`linear(to-r, ${accentColor}, ${secondaryAccent})`}
                color="white"
                fontWeight="black"
                letterSpacing="0.2em"
                fontSize="xs"
                borderRadius="2xl"
                onClick={handleSaveKeys}
                _hover={{ transform: 'translateY(-2px)', boxShadow: `0 5px 20px rgba(66, 153, 225, 0.3)` }}
                _active={{ transform: 'scale(0.98)' }}
              >
                SYNCHRONIZE_PARAMETERS
              </Button>
            </Stack>
          </Box>

          {/* Support Section */}
          <Box p={8}>
            <VStack align="start" spacing={1} mb={6}>
              <Text fontSize="10px" fontWeight="black" color="green.400" letterSpacing="0.4em">NETWORK_MAINTENANCE</Text>
              <Heading size="md" letterSpacing="wider">CONTRIBUTOR_PROTOCOL</Heading>
            </VStack>
            <Text fontSize="xs" color={systemTextColor} mb={6} fontWeight="bold">
              Contribute resources to maintain and expand the Cognifold neural matrix.
            </Text>
            <BuyMeACoffee />
          </Box>

          {/* Disclaimer */}
          <Box p={8} bg="blackAlpha.200">
            <Text fontSize="10px" fontWeight="black" color="red.400" mb={4} letterSpacing="0.4em">LEGAL_DISCLAIMER</Text>
            <Text fontSize="10px" color={systemTextColor} fontWeight="bold" lineHeight="1.6" fontFamily="monospace">
              THE_FINANCIAL_ANALYSIS_PROVIDED_BY_COGNIFOLD_IS_FOR_INFORMATIONAL_PURPOSES_ONLY_AND_GENERATED_BY_AI_AGENTS. IT_IS_NOT_INTENDED_TO_BE_A_SUBSTITUTE_FOR_PROFESSIONAL_FINANCIAL_ADVICE. ALL_DATA_AND_API_KEYS_ARE_STORED_LOCALLY_ON_YOUR_DEVICE_FOR_MAXIMUM_PRIVACY.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Settings;
