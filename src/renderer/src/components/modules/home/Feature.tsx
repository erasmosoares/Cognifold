import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  HStack,
  Text,
  useColorModeValue,
  useColorMode,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiCompass, FiStar, FiActivity } from 'react-icons/fi';
import { ReactElement } from 'react';
import CognifoldFace from '@renderer/assets/cognifold_face.png';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

interface CardProps {
  heading: string
  description: string
  icon: ReactElement
}

const Card = ({ heading, description, icon }: CardProps) => {
  const accentColor = useColorModeValue('blue.500', 'blue.400');
  const cardBg = useColorModeValue('whiteAlpha.800', 'rgba(10, 15, 25, 0.4)');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const systemTextColor = useColorModeValue('gray.500', 'whiteAlpha.500');

  return (
    <Box
      maxW={{ base: 'full', md: '350px' }}
      w={'full'}
      borderRadius="3xl"
      p={8}
      bg={cardBg}
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
      _hover={{ transform: 'translateY(-8px)', borderColor: accentColor, boxShadow: '0 10px 30px rgba(66, 153, 225, 0.1)' }}
    >
      {/* Technical markers */}
      <Box position="absolute" top={4} right={6} fontSize="9px" fontWeight="black" opacity={0.3} fontFamily="monospace">
        NODE_{heading.split(' ')[0].toUpperCase()}
      </Box>
      <Box position="absolute" bottom={0} right={0} w="40px" h="40px" bgGradient={`linear(to-br, transparent, ${accentColor})`} opacity={0.1} />

      <Stack align={'start'} spacing={5}>
        <Flex
          w={12}
          h={12}
          align={'center'}
          justify={'center'}
          color={'white'}
          borderRadius="xl"
          bgGradient={`linear(to-br, ${accentColor}, purple.500)`}
          shadow="lg">
          {icon}
        </Flex>
        <Box>
          <Heading size="md" letterSpacing="widest" fontWeight="black">{heading.toUpperCase()}</Heading>
          <Text mt={4} fontSize={'sm'} color={systemTextColor} lineHeight="tall" fontWeight="bold">
            {description}
          </Text>
        </Box>
        <HStack spacing={2} pt={2}>
          <Box boxSize="6px" borderRadius="full" bg={accentColor} />
          <Text fontSize="10px" fontWeight="black" letterSpacing="0.2em">STATUS_STABLE</Text>
        </HStack>
      </Stack>
    </Box>
  )
}

const Feature = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const accentColor = useColorModeValue('blue.400', 'blue.300');
  const systemTextColor = useColorModeValue('gray.500', 'whiteAlpha.500');

  return (
    <Box p={4}>
      <Container maxW={'6xl'} pt={10} pb={20}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={20}
        >
          <Stack spacing={10} flex={1} textAlign={{ base: 'center', lg: 'left' }}>
            <Box>
              <HStack justify={{ base: 'center', lg: 'start' }} mb={4} spacing={3}>
                <Box w="15px" h="2px" bg={accentColor} />
                <Text
                  fontWeight="black"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.5em"
                  color={accentColor}
                >
                  NEURAL_OS_V2.0
                </Text>
              </HStack>
              <Heading
                fontWeight="black"
                fontSize={{ base: '4xl', sm: '5xl', md: '7xl' }}
                lineHeight={'90%'}
                letterSpacing="tight"
              >
                <Text
                  as={'span'}
                  bgClip="text"
                  bgGradient="linear(to-r, blue.400, purple.400, blue.600)"
                >
                  COGNIFOLD
                </Text>
              </Heading>
              <Text mt={6} fontSize="xs" fontWeight="black" letterSpacing="0.6em" opacity={0.5}>
                AMPLIFIED_INTELLIGENCE_LAYERS
              </Text>
            </Box>

            <Text color={systemTextColor} fontSize={{ base: 'lg', md: 'xl' }} lineHeight="1.6" fontWeight="bold">
              Cognifold is a multi-dimensional intelligence aggregator.
              Acquire knowledge through layered neural structures, unified into a singular reality for strategic deployment.
            </Text>
          </Stack>

          <Flex flex={1} justify="center" align="center" position="relative">
            {/* Hexagonal Frame for Face */}
            <Box
              position="relative"
              w={{ base: "300px", md: "450px" }}
              h={{ base: "320px", md: "480px" }}
              bg="blackAlpha.900"
              clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              border="2px solid"
              borderColor={accentColor}
              overflow="hidden"
              boxShadow={`0 0 50px rgba(66, 153, 225, 0.2)`}
            >
              <Box
                position="absolute"
                inset={0}
                bgGradient={`radial-gradient(circle at 50% 50%, rgba(66, 153, 225, 0.1) 0%, transparent 70%)`}
              />
              <Image
                src={CognifoldFace}
                alt="Cognifold Mesh"
                w="full"
                h="full"
                objectFit="contain"
                filter={isDarkMode ? 'brightness(1.5)' : 'invert(0.8) brightness(1.2)'}
                style={{ filter: `drop-shadow(0 0 30px rgba(66, 153, 225, 0.3))` }}
                animation={`${float} 10s ease-in-out infinite`}
              />
              {/* Decorative scanning line */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="1px"
                bg={accentColor}
                boxShadow={`0 0 20px ${accentColor}`}
                animation={`${pulse} 3s linear infinite`}
              />
            </Box>

            {/* Background glow */}
            <Box
              position="absolute"
              w="500px"
              h="500px"
              bg="blue.500"
              filter="blur(150px)"
              opacity={0.15}
              borderRadius="full"
              zIndex={-1}
            />
          </Flex>
        </Flex>
      </Container>

      <Container maxW={'6xl'} mb={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Card
            heading={'Conversational Core'}
            icon={<Icon as={FiActivity} w={6} h={6} />}
            description={'Directly interface with the Cognifold neural network for open-ended intelligence gatherings.'}
          />
          <Card
            heading={'Entertainment Hub'}
            icon={<Icon as={FiStar} w={6} h={6} />}
            description={'From content reviews to creative specialists, explore agents designed to refine your engagement.'}
          />
          <Card
            heading={'Financial Hub'}
            icon={<Icon as={FiCompass} w={6} h={6} />}
            description={'Navigate global markets with high-precision research agents and data deliberation.'}
          />
        </SimpleGrid>
      </Container>
    </Box>
  )
};

export default Feature;