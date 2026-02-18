import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Code,
    SimpleGrid,
    useColorModeValue,
    Icon,
    Flex,
    Divider,
    Step,
    StepIndicator,
    StepStatus,
    StepTitle,
    StepDescription,
    StepSeparator,
    Stepper,
    StepIcon,
    StepNumber,
} from '@chakra-ui/react';
import { FiCpu, FiLayers, FiTerminal, FiCode, FiGitBranch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TerminalBlock = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const bg = useColorModeValue('gray.50', 'blackAlpha.400');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

    return (
        <Box
            bg={bg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            overflow="hidden"
            fontFamily="monospace"
            fontSize="sm"
        >
            <Flex
                bg={useColorModeValue('gray.100', 'whiteAlpha.100')}
                px={3}
                py={1}
                borderBottom="1px solid"
                borderColor={borderColor}
                align="center"
                gap={2}
            >
                <Box w={2} h={2} borderRadius="full" bg="red.400" />
                <Box w={2} h={2} borderRadius="full" bg="yellow.400" />
                <Box w={2} h={2} borderRadius="full" bg="green.400" />
                <Text ml={2} fontSize="xs" color="gray.500" textTransform="uppercase">
                    {title}
                </Text>
            </Flex>
            <Box p={4} overflowX="auto">
                {children}
            </Box>
        </Box>
    );
};

const SectionCard = ({ title, icon, children, delay = 0 }) => {
    const bg = useColorModeValue('white', 'rgba(10, 12, 16, 0.6)');
    const border = useColorModeValue('gray.200', 'whiteAlpha.100');
    const accent = 'cyan.400';

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            bg={bg}
            border="1px solid"
            borderColor={border}
            borderRadius="xl"
            p={6}
            position="relative"
            overflow="hidden"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                w: '2px',
                h: '100%',
                bg: accent,
                opacity: 0.5,
            }}
        >
            <HStack mb={4} spacing={3}>
                <Icon as={icon} boxSize={5} color={accent} />
                <Heading size="md" fontFamily="heading" letterSpacing="wide" textTransform="uppercase">
                    {title}
                </Heading>
            </HStack>
            {children}
        </MotionBox>
    );
};

const ContributionView: React.FC = () => {
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const accentColor = 'cyan.400';

    const steps = [
        {
            title: 'Backend Service',
            description: 'Create python-server/app/services/your_agent.py',
            code: `class YourAgent(BaseAgent):
    async def run(self, input_data: str):
        return "Agent Result"`,
        },
        {
            title: 'Register Endpoint',
            description: 'Update python-server/app/api/router.py',
            code: `@router.post("/your-agent")
async def run_agent(req: Request):
    return await agent.run(req.data)`,
        },
        {
            title: 'Frontend UI',
            description: 'Create src/renderer/components/modules/YourAgent.tsx',
            code: `const YourAgent = () => {
  return <AgentView agent="YourAgent" />
}`,
        },
    ];

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">

                {/* Header */}
                <Box textAlign="center" mb={4}>
                    <Text
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.2em"
                        color={accentColor}
                        textTransform="uppercase"
                        mb={2}
                    >
                        System Uplink
                    </Text>
                    <Heading size="2xl" fontFamily="heading" mb={4} bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text">
                        Contribution Protocol
                    </Heading>
                    <Text color={textColor} maxW="2xl" mx="auto" fontSize="lg">
                        Initialize sequence to expand the Cognifold network. Follow the protocol below to integrate new intelligent agents.
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Project Structure */}
                    <SectionCard title="Neural Architecture" icon={FiLayers} delay={0.1}>
                        <Text color={textColor} mb={4} fontSize="sm">
                            The system is divided into two primary cortexes: the Python-based intelligence engine and the Electron-based visual interface.
                        </Text>
                        <TerminalBlock title="directory_tree.sh">
                            <Code display="block" bg="transparent" color="green.300" whiteSpace="pre">
                                {`project/
├── python-server/       # Intelligence Core
│   ├── app/services/    # Agent Logic Modules
│   ├── app/api/         # Neural Pathways (API)
│   └── main.py          # Synapse Entry Point
│
├── src/renderer/        # Visual Cortex
│   └── components/      # UI Modules`}
                            </Code>
                        </TerminalBlock>
                    </SectionCard>

                    {/* Development Setup */}
                    <SectionCard title="Initialization" icon={FiTerminal} delay={0.2}>
                        <VStack align="stretch" spacing={4}>
                            <Box>
                                <Text fontWeight="bold" color="white" mb={2} fontSize="sm">:: BACKEND SEQUENCE</Text>
                                <TerminalBlock title="terminal - backend">
                                    <Code display="block" bg="transparent" color="cyan.300">
                                        cd python-server<br />
                                        pip install -r requirements.txt<br />
                                        python main.py
                                    </Code>
                                </TerminalBlock>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" color="white" mb={2} fontSize="sm">:: FRONTEND SEQUENCE</Text>
                                <TerminalBlock title="terminal - frontend">
                                    <Code display="block" bg="transparent" color="cyan.300">
                                        npm install<br />
                                        npm run dev
                                    </Code>
                                </TerminalBlock>
                            </Box>
                        </VStack>
                    </SectionCard>
                </SimpleGrid>

                {/* Integration Steps */}
                <SectionCard title="Agent Integration Protocol" icon={FiGitBranch} delay={0.3}>
                    <Stepper index={-1} orientation="vertical" height="auto" gap="0">
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>

                                <Box flexShrink='0' w="full" mb={8}>
                                    <StepTitle>{step.title}</StepTitle>
                                    <StepDescription mb={4}>{step.description}</StepDescription>
                                    <TerminalBlock title={`step_0${index + 1}.py`}>
                                        <Code display="block" bg="transparent" color="purple.300" whiteSpace="pre">
                                            {step.code}
                                        </Code>
                                    </TerminalBlock>
                                </Box>

                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </SectionCard>

            </VStack>
        </Container>
    );
};

export default ContributionView;
