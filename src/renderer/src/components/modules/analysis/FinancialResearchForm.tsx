import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Text,
    VStack,
    HStack,
    useToast,
    useColorModeValue,
    Heading,
    SimpleGrid,
    Image,
    Badge,
    Flex,
    useDisclosure
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Loading Component
import NeuralLoading from '../../shared/loading/NeuralLoading';
import ApiKeyAlert from '../../shared/alerts/ApiKeyAlert';
// Import assets - assuming vite handles asset imports like this
import agentResearcherImg from '../../../assets/agents/agent_researcher.png';
import agentAnalystImg from '../../../assets/agents/agent_analyst.png';

const schema = z.object({
    company: z.string().min(1, { message: 'Company name is required' }),
});

type FormData = z.infer<typeof schema>;

const scanLine = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const scanVertical = keyframes`
  0% { bottom: 0%; }
  50% { bottom: 100%; }
  100% { bottom: 0%; }
`;

const FinancialResearchForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

    const handleGoToSettings = () => {
        onAlertClose();
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'Settings' }));
    };

    // Futuristic Theme Colors
    const cardBg = useColorModeValue('whiteAlpha.800', 'rgba(10, 15, 25, 0.4)');
    const panelBg = useColorModeValue('white', 'rgba(10, 15, 25, 0.7)');
    const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const accentColor = 'teal.400';
    const secondaryAccent = 'purple.500';
    const systemTextColor = useColorModeValue('gray.500', 'whiteAlpha.500');

    const agents = [
        {
            name: "Aura",
            role: "RESEARCH_DIRECTOR",
            desc: "Neural-linked market surveillance and deep sector analysis.",
            image: agentResearcherImg,
            color: "teal.400",
            delay: "0s"
        },
        {
            name: "Cipher",
            role: "DATA_SYNTHESIZER",
            desc: "Expert in cross-referencing global news fragments and market signals.",
            image: agentAnalystImg,
            color: "purple.400",
            delay: "1s"
        }
    ];

    const onSubmit = async (data: FormData) => {
        const openai = localStorage.getItem('OPENAI_API_KEY');
        const serper = localStorage.getItem('SERPER_API_KEY');
        const missing: string[] = [];
        if (!openai) missing.push('OPENAI_API_KEY');
        if (!serper) missing.push('SERPER_API_KEY');

        if (missing.length > 0) {
            setMissingKeys(missing);
            onAlertOpen();
            return;
        }

        setIsLoading(true);
        setResult(null);
        setLogs([]);

        // Start log stream
        const eventSource = new EventSource('http://127.0.0.1:8000/sse-logs');
        eventSource.onmessage = (event) => {
            setLogs((prev) => [...prev, event.data]);
        };
        eventSource.onerror = () => {
            console.error("EventSource failed.");
            eventSource.close();
        };
        try {
            const response = await fetch('http://localhost:8000/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-openai-api-key': openai || '',
                    'x-serper-api-key': serper || ''
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(`Server collision: ${response.status}`);
            const resultData = await response.json();
            if (resultData.result && resultData.result.startsWith("Error importing")) throw new Error(resultData.result);

            setResult(resultData.result);
            toast({ title: 'Uplink Successful', description: 'Data fragments synthesized.', status: 'success' });
        } catch (error: any) {
            toast({
                title: 'Operation Failure',
                description: error.message || 'Data bridge collapsed.',
                status: 'error',
                duration: 5000,
            });
        } finally {
            eventSource.close();
            setIsLoading(false);
        }
    };

    return (
        <VStack spacing={8} align="stretch" pb={10}>
            <ApiKeyAlert
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                onGoToSettings={handleGoToSettings}
                missingKeys={missingKeys}
            />

            {/* Header Section: Hub Status */}
            <Flex
                bg={panelBg}
                p={8}
                borderRadius="3xl"
                border="1px solid"
                borderColor={borderColor}
                backdropFilter="blur(20px)"
                justify="space-between"
                align="center"
                position="relative"
                overflow="hidden"
            >
                <VStack align="start" spacing={1} zIndex={1}>
                    <HStack>
                        <Box boxSize="8px" bg="green.400" borderRadius="full" />
                        <Text fontSize="xs" fontWeight="black" letterSpacing="0.4em" color="green.400">HUB_ACTIVE</Text>
                    </HStack>
                    <Heading size="lg" letterSpacing="tight" fontWeight="black">
                        DATA_EXTRACTION_HUB
                    </Heading>
                    <Text fontSize="xs" color={systemTextColor} letterSpacing="widest" fontWeight="bold">
                        MULTIVECTOR_RESEARCH_ARRAY // STANDBY_MODE
                    </Text>
                </VStack>

                <Flex gap={4} display={{ base: 'none', md: 'flex' }}>
                    <Box textAlign="right">
                        <Text fontSize="10px" fontWeight="black" color={accentColor}>LATENCY</Text>
                        <Text fontSize="sm" fontFamily="monospace">15ms</Text>
                    </Box>
                    <Box textAlign="right">
                        <Text fontSize="10px" fontWeight="black" color={secondaryAccent}>THROUGHPUT</Text>
                        <Text fontSize="sm" fontFamily="monospace">8.4GB/s</Text>
                    </Box>
                </Flex>

                {/* Decorative scanning line */}
                <Box
                    position="absolute"
                    top={0}
                    bottom={0}
                    left="10%"
                    w="1px"
                    bgGradient={`linear(to-b, transparent, ${accentColor}, transparent)`}
                    opacity={0.3}
                    animation={`${scanVertical} 4s linear infinite`}
                />
            </Flex>

            {/* Agents Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {agents.map((agent) => (
                    <Box
                        key={agent.name}
                        bg={panelBg}
                        p={6}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor={borderColor}
                        backdropFilter="blur(20px)"
                        position="relative"
                        overflow="hidden"
                        transition="all 0.3s"
                        _hover={{ transform: 'translateY(-4px)', borderColor: agent.color }}
                    >
                        <Flex gap={6} align="center">
                            {/* Hexagonal Agent pod */}
                            <Box
                                boxSize="100px"
                                bg="blackAlpha.800"
                                clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                                border="1px solid"
                                borderColor={agent.color}
                                position="relative"
                                overflow="hidden"
                            >
                                <Image
                                    src={agent.image}
                                    alt={agent.name}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    filter={useColorModeValue('invert(0.8) brightness(1.2)', 'brightness(1.5)')}
                                />
                                {isLoading && (
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        right={0}
                                        h="1px"
                                        bg={agent.color}
                                        boxShadow={`0 0 10px ${agent.color}`}
                                        animation={`${scanLine} 2s linear infinite`}
                                    />
                                )}
                            </Box>

                            <VStack align="start" spacing={1}>
                                <Badge colorScheme={agent.color.split('.')[0]} variant="subtle" fontSize="9px">
                                    {agent.role}
                                </Badge>
                                <Heading size="md" letterSpacing="wider">{agent.name}</Heading>
                                <Text fontSize="xs" color={systemTextColor} noOfLines={2}>
                                    {agent.desc}
                                </Text>
                            </VStack>
                        </Flex>

                        {/* Decorative index marker */}
                        <Text position="absolute" top={4} right={6} fontSize="10px" fontWeight="black" opacity={0.2} fontFamily="monospace">
                            ID: 0x{agent.name.length}A
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Deployment Console */}
            <Box
                bg={cardBg}
                p={8}
                borderRadius="3xl"
                border="1px solid"
                borderColor={borderColor}
                backdropFilter="blur(20px)"
                position="relative"
            >
                <VStack align="start" mb={6} spacing={0}>
                    <Text fontSize="10px" fontWeight="black" color={accentColor} letterSpacing="0.4em" mb={2}>DEPLOYMENT_PARAMETERS</Text>
                    <Heading size="md">TARGET_IDENTIFICATION</Heading>
                    <Text fontSize="xs" color={systemTextColor}>Specify entity for deep market traversal.</Text>
                </VStack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                        <FormControl isInvalid={!!errors.company} flex="1">
                            <Input
                                {...register('company')}
                                placeholder="e.g. NVIDIA (NVDA)"
                                size="lg"
                                bg={panelBg}
                                borderRadius="2xl"
                                border="1px solid"
                                borderColor={borderColor}
                                backdropFilter="blur(20px)"
                                fontSize="sm"
                                _focus={{ borderColor: accentColor, boxShadow: `0 0 15px rgba(56, 178, 172, 0.2)` }}
                                isDisabled={isLoading}
                            />
                            <FormErrorMessage>{errors.company?.message}</FormErrorMessage>
                        </FormControl>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            loadingText="SCANNING..."
                            size="lg"
                            px={12}
                            borderRadius="2xl"
                            bgGradient={`linear(to-r, ${accentColor}, ${secondaryAccent})`}
                            color="white"
                            fontWeight="black"
                            letterSpacing="widest"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(128, 90, 213, 0.4)' }}
                            _active={{ transform: 'scale(0.98)' }}
                        >
                            INITIATE_RESEARCH
                        </Button>
                    </Flex>
                </form>
            </Box>

            {/* Neural Loading Indicator */}
            {isLoading && <NeuralLoading message="TRAVERSING_MARKET_NODES... COLLECTING_INTEL..." logs={logs} />}

            {/* Results Section: Mission Report */}
            {result && !isLoading && (
                <Box
                    bg={panelBg}
                    p={10}
                    borderRadius="3xl"
                    border="1px solid"
                    borderColor={borderColor}
                    backdropFilter="blur(20px)"
                    position="relative"
                >
                    <HStack justify="space-between" mb={8} borderBottom="1px solid" borderColor={borderColor} pb={4}>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="10px" fontWeight="black" color={secondaryAccent} letterSpacing="0.4em">DOC_STATUS: FINALIZED</Text>
                            <Heading size="lg" letterSpacing="widest">MISSION_REPORT</Heading>
                        </VStack>
                        <Box boxSize="12px" border="2px solid" borderColor={accentColor} borderRadius="sm" />
                    </HStack>

                    <Box
                        maxW="100%"
                        sx={{
                            'h1, h2, h3': { mt: 8, mb: 4, fontWeight: 'black', letterSpacing: 'tight' },
                            'h1': { fontSize: '2xl', color: accentColor, borderBottom: '1px solid', pb: 2, borderColor: 'whiteAlpha.100' },
                            'h2': { fontSize: 'xl', color: secondaryAccent },
                            'p': { mb: 6, lineHeight: '1.8', fontSize: 'md', color: useColorModeValue('gray.800', 'whiteAlpha.900') },
                            'ul, ol': { ml: 6, mb: 6 },
                            'li': { mb: 3, fontSize: 'sm' },
                            'blockquote': {
                                borderLeft: '2px solid',
                                borderColor: accentColor,
                                pl: 6,
                                fontStyle: 'italic',
                                bg: 'whiteAlpha.50',
                                py: 4,
                                my: 6,
                                borderRadius: 'md'
                            },
                        }}
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {result}
                        </ReactMarkdown>
                    </Box>

                    {/* Footer Markers */}
                    <HStack mt={10} justify="space-between" opacity={0.3}>
                        <Text fontSize="9px" fontFamily="monospace">GEN_TS: {new Date().toISOString()}</Text>
                        <Text fontSize="9px" fontFamily="monospace">SIG_HASH: 0x8F2C4E...A1</Text>
                    </HStack>
                </Box>
            )}
        </VStack>
    );
};

export default FinancialResearchForm;
