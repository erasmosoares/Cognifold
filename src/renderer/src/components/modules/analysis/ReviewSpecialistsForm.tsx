import { useState, useRef } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Text,
    useToast,
    useColorModeValue,
    Heading,
    SimpleGrid,
    Image,
    Container,
    Divider,
    Badge,
    Flex,
    useDisclosure,
    Center,
    Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCpu, FiShield, FiHexagon, FiActivity } from 'react-icons/fi';

// Loading Component
import NeuralLoading from '../../shared/loading/NeuralLoading';
import ApiKeyAlert from '../../shared/alerts/ApiKeyAlert';

// Reuse existing wireframe assets
import agentSummarizerImg from '../../../assets/agents/agent_advisor_summarizer.png';
import agentResearcherImg from '../../../assets/agents/agent_researcher.png';
import agentInvestmentImg from '../../../assets/agents/agent_advisor_investment.png';
import agentAnalystImg from '../../../assets/agents/agent_advisor_analyst.png';

const MotionBox = motion(Box);

// Futuristic Animations
const scanLine = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;


const AgentPod = ({ agent, isLoading, index }: { agent: any, isLoading: boolean, index: number }) => {
    const borderColor = useColorModeValue('pink.300', 'pink.500');
    const glowColor = useColorModeValue('rgba(237, 100, 166, 0.2)', 'rgba(237, 100, 166, 0.6)');
    const podBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.700');
    const nameColor = useColorModeValue('gray.800', 'white');

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            position="relative"
            p={2}
            role="group"
        >
            {/* Outer Hexagon frame */}
            <Box
                position="relative"
                w="110px"
                h="120px"
                bg={podBg}
                clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                border="1px solid"
                borderColor={borderColor}
                transition="all 0.3s"
                _groupHover={{
                    borderColor: 'purple.400',
                    boxShadow: `0 0 15px ${glowColor}`
                }}
                overflow="hidden"
            >
                {/* Background Grid */}
                <Box
                    position="absolute"
                    inset={0}
                    opacity={0.1}
                    backgroundImage="radial-gradient(circle, #ff0080 1px, transparent 1px)"
                    backgroundSize="10px 10px"
                />

                {/* Agent Image with Hologram Effect */}
                <Image
                    src={agent.image}
                    alt={agent.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    filter={agent.filter || `hue-rotate(${agent.hue}) brightness(1.2) contrast(1.1)`}
                    opacity={0.8}
                    _groupHover={{ opacity: 1, filter: `hue-rotate(${agent.hue}) brightness(1.4) contrast(1.2)` }}
                    transition="all 0.3s"
                />

                {/* Scanning Line during loading */}
                {isLoading && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="2px"
                        bg="pink.300"
                        boxShadow="0 0 10px #ff0080"
                        animation={`${scanLine} 2s linear infinite`}
                    />
                )}

                {/* Decorative bits */}
                <Box
                    position="absolute"
                    bottom="10%"
                    left="50%"
                    transform="translateX(-50%)"
                    textAlign="center"
                    w="full"
                    px={1}
                    zIndex={1}
                >
                    <Text fontSize="10px" fontWeight="black" color={nameColor} textShadow={useColorModeValue("none", "0 0 5px black")} isTruncated>
                        {agent.name.toUpperCase()}
                    </Text>
                    <Box h="1px" w="60%" bg={useColorModeValue("blackAlpha.200", "whiteAlpha.400")} mx="auto" mt={0.5} />
                    <Text fontSize="6px" color="pink.500" fontWeight="bold" mt={0.5}>
                        {agent.role.toUpperCase()}
                    </Text>
                </Box>

                {/* Status Indicator */}
                <Box
                    position="absolute"
                    top="10%"
                    right="15%"
                    w="4px"
                    h="4px"
                    borderRadius="full"
                    bg={isLoading ? "yellow.400" : "green.400"}
                    boxShadow={`0 0 8px ${isLoading ? "yellow.400" : "green.400"}`}
                    animation={isLoading ? `${pulse} 1s infinite` : "none"}
                />
            </Box>
        </MotionBox>
    );
};

const ReviewSpecialistsForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState(''); // Added theme state for manual input
    const [logs, setLogs] = useState<string[]>([]); // Added logs state
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const resultRef = useRef<HTMLDivElement>(null);
    const toast = useToast();

    const handleGoToSettings = () => {
        onAlertClose();
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'Settings' }));
    };

    // Removed useForm and zodResolver as per the snippet's implied change to manual form handling
    // const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    //     resolver: zodResolver(schema),
    //     defaultValues: { theme: "" }
    // });
    const [errors, setErrors] = useState<{ theme?: { message: string } }>({}); // Manual error state

    const accentGradient = 'linear(to-r, #FF0080, #7928CA)';

    // Theme-specific colors
    const mainBg = useColorModeValue(
        "radial-gradient(circle at 50% 50%, #f7fafc 0%, #edf2f7 100%)",
        "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d0d15 100%)"
    );
    const centerPanelBg = useColorModeValue('whiteAlpha.900', 'rgba(10, 15, 25, 0.6)');
    const gridOpacity = useColorModeValue(0.1, 0.3);
    const gridLineColor = useColorModeValue('#00000011', '#ff008033');
    const sectionSublabelColor = useColorModeValue('gray.600', 'whiteAlpha.600');
    const inputBg = useColorModeValue('white', 'blackAlpha.600');
    const inputColor = useColorModeValue('gray.800', 'white');
    const verdictBg = useColorModeValue('white', 'rgba(10, 15, 25, 0.8)');
    const verdictTitleColor = useColorModeValue('gray.800', 'white');
    const verdictTextColor = useColorModeValue('gray.700', 'whiteAlpha.800');

    const agents = [
        { name: "Logic", role: "Analytical Critic", image: agentSummarizerImg, hue: "0deg" },
        { name: "Feel", role: "Emotional Critic", image: agentSummarizerImg, hue: "140deg" },
        { name: "Risk", role: "Experimental Critic", image: agentInvestmentImg, hue: "260deg" },
        { name: "Canon", role: "Classical Critic", image: agentResearcherImg, hue: "40deg" },
        { name: "Provoke", role: "Provocative Critic", image: agentSummarizerImg, hue: "320deg" },
        { name: "Sound", role: "Music Specialist", image: agentInvestmentImg, hue: "90deg" },
        { name: "Vision", role: "Cinema Specialist", image: agentSummarizerImg, hue: "200deg" },
        { name: "Word", role: "Literature Specialist", image: agentResearcherImg, hue: "30deg" },
        { name: "History", role: "Cultural Historian", image: agentResearcherImg, hue: "60deg" },
        { name: "Context", role: "Social Analyst", image: agentSummarizerImg, hue: "180deg" },
        { name: "Comp", role: "Comparator", image: agentInvestmentImg, hue: "120deg" },
        { name: "Voice", role: "Critic Writer", image: agentSummarizerImg, hue: "290deg" },
        { name: "Edit", role: "Editor", image: agentResearcherImg, hue: "220deg" },
        { name: "Judge", role: "Curator", image: agentInvestmentImg, hue: "160deg" },
        { name: "Meta", role: "Meta Critic", image: agentAnalystImg, hue: "0deg", filter: "grayscale(100%) brightness(1.5)" },
    ];

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setErrors({}); // Clear previous errors

        if (!theme.trim()) {
            setErrors({ theme: { message: "Theme is required" } });
            return;
        }

        const openai = localStorage.getItem('OPENAI_API_KEY');
        const missing: string[] = [];
        if (!openai) missing.push('OPENAI_API_KEY');

        if (missing.length > 0) {
            setMissingKeys(missing);
            onAlertOpen();
            return;
        }

        setIsLoading(true);
        setResult(null);
        setLogs([]); // Clear logs on new submission

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
            const response = await fetch('http://localhost:8000/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-openai-api-key': openai || ''
                },
                body: JSON.stringify({ theme }), // Use the theme state
            });

            if (!response.ok) throw new Error(`Server responded with ${response.status}`);

            const resultData = await response.json();
            if (resultData.result && resultData.result.startsWith("Error importing")) throw new Error(resultData.result);

            setResult(resultData.result);
            toast({ title: 'Consensus Reached', status: 'success', isClosable: true });

            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error: any) {
            toast({
                title: 'Interface Error',
                description: error.message || 'Failed to sync with Council',
                status: 'error',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
            eventSource.close(); // Close EventSource when request completes or errors
        }
    };

    return (
        <Box
            minH="100vh"
            p={0}
            background={mainBg}
            position="relative"
            overflow="hidden"
        >
            <ApiKeyAlert
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                onGoToSettings={handleGoToSettings}
                missingKeys={missingKeys}
            />

            {/* Background Effects */}
            <Box position="absolute" inset={0} zIndex={0} pointerEvents="none" opacity={gridOpacity}>
                <Box h="full" w="full" backgroundImage={`linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`} backgroundSize="50px 50px" />
                <Circle size="600px" position="absolute" top="-100px" right="-100px" filter="blur(150px)" bgGradient="radial(#7928CA 0%, transparent 70%)" />
                <Circle size="400px" position="absolute" bottom="-100px" left="-100px" filter="blur(100px)" bgGradient="radial(#FF0080 0%, transparent 70%)" />
            </Box>

            <Container maxW="container.xl" py={10} position="relative" zIndex={1}>
                <VStack spacing={12} align="stretch">

                    {/* Header Section */}
                    <VStack spacing={2} textAlign="center" pt={5}>
                        <Heading
                            as="h1"
                            size="3xl"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            bgGradient={accentGradient}
                            bgClip="text"
                            filter="drop-shadow(0 0 10px rgba(255, 0, 128, 0.4))"
                        >
                            Critical Council
                        </Heading>
                        <Divider w="100px" borderColor="pink.500" borderBottomWidth="2px" />
                        <HStack spacing={4} color={sectionSublabelColor}>
                            <Icon as={FiCpu} />
                            <Text fontSize="sm" letterSpacing="0.4em" fontWeight="bold">SYNCHRONIZED_MAINFRAME</Text>
                            <Icon as={FiShield} />
                        </HStack>
                    </VStack>

                    {/* The Council Command Center */}
                    <Box
                        bg={centerPanelBg}
                        p={10}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                        backdropFilter="blur(20px)"
                        boxShadow="0 0 40px rgba(0,0,0,0.1)"
                    >
                        <VStack spacing={10}>
                            {/* Council Members PODS Grid */}
                            <Box w="full">
                                <Heading size="xs" color="pink.500" mb={8} letterSpacing="0.3em" textTransform="uppercase" textAlign="center">
                                    Specialist Nodes Active
                                </Heading>
                                <Center>
                                    <SimpleGrid columns={{ base: 3, md: 5, lg: 8 }} spacing={4} px={4}>
                                        {agents.map((agent, i) => (
                                            <AgentPod key={agent.name} agent={agent} isLoading={isLoading} index={i} />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Box>

                            {/* Central Input / Summoning Area */}
                            <VStack w="full" maxW="600px" spacing={6} position="relative">
                                <Box
                                    position="absolute"
                                    inset={-4}
                                    border="1px solid"
                                    borderColor="pink.500"
                                    opacity={0.1}
                                    borderRadius="2xl"
                                    zIndex={-1}
                                />

                                <form style={{ width: '100%' }} onSubmit={onSubmit}> {/* Changed to manual onSubmit */}
                                    <VStack spacing={6}>
                                        <FormControl isInvalid={!!errors.theme}>
                                            <Flex justify="space-between" mb={2}>
                                                <FormLabel color={useColorModeValue('gray.600', 'whiteAlpha.800')} fontSize="xs" letterSpacing="widest" ml={2}>NEURAL_QUERY_SUBJECT</FormLabel>
                                                {errors.theme && <Text color="red.400" fontSize="xs">{errors.theme.message}</Text>}
                                            </Flex>
                                            <Input
                                                value={theme} // Controlled input
                                                onChange={(e) => setTheme(e.target.value)} // Update theme state
                                                bg={inputBg}
                                                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                                                color={inputColor}
                                                placeholder="Inject subject for deliberation (e.g. Blade Runner 2049, Jazz Revival...)"
                                                _placeholder={{ color: useColorModeValue('gray.400', 'whiteAlpha.300') }}
                                                size="lg"
                                                h="60px"
                                                borderRadius="xl"
                                                transition="all 0.3s"
                                                _focus={{
                                                    borderColor: 'pink.500',
                                                    boxShadow: '0 0 20px rgba(255, 0, 128, 0.2)',
                                                    bg: useColorModeValue('white', 'blackAlpha.800')
                                                }}
                                                isDisabled={isLoading}
                                            />
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            w="full"
                                            h="70px"
                                            isLoading={isLoading}
                                            variant="unstyled"
                                            isDisabled={isLoading}
                                            position="relative"
                                            overflow="hidden"
                                            _hover={{ transform: 'translateY(-2px)', filter: 'brightness(1.2)' }}
                                            _active={{ transform: 'scale(0.98)' }}
                                            transition="all 0.2s"
                                        >
                                            <Center
                                                w="full"
                                                h="full"
                                                bgGradient={accentGradient}
                                                borderRadius="xl"
                                                color="white"
                                            >
                                                <HStack spacing={4}>
                                                    <Icon as={FiActivity} />
                                                    <Text fontWeight="black" letterSpacing="0.3em" fontSize="lg">
                                                        {isLoading ? "DELIBERATING_CONSENSUS" : "SUMMON_COUNCIL"}
                                                    </Text>
                                                </HStack>
                                            </Center>
                                        </Button>
                                    </VStack>
                                </form>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Results / Verdict Reveal */}
                    <AnimatePresence>
                        {result && !isLoading && (
                            <MotionBox
                                ref={resultRef}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", damping: 20 }}
                                bg={verdictBg}
                                border="1px solid"
                                borderColor="pink.500"
                                p={10}
                                borderRadius="3xl"
                                backdropFilter="blur(30px)"
                                boxShadow="0 0 50px rgba(255, 0, 128, 0.1)"
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Futuristic UI accents for Verdict */}
                                <Box position="absolute" top={0} left={0} p={4}>
                                    <Icon as={FiHexagon} color="pink.500" opacity={0.5} />
                                </Box>
                                <Box position="absolute" bottom={0} right={0} p={4}>
                                    <Text fontSize="8px" color="pink.500" letterSpacing="widest" fontWeight="bold">ENCRYPTION: 128_BIT_SECURE</Text>
                                </Box>

                                <Flex justify="space-between" align="center" mb={10} borderBottom="2px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')} pb={6}>
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color="pink.500" fontWeight="black" letterSpacing="widest">COUNCIL_VERDICT</Text>
                                        <Heading size="lg" color={verdictTitleColor} letterSpacing="tight">The Final Consensus</Heading>
                                    </VStack>
                                    <Badge
                                        colorScheme="pink"
                                        variant="outline"
                                        fontSize="sm"
                                        px={4}
                                        py={2}
                                        borderRadius="full"
                                        borderWidth="2px"
                                        animation={`${pulse} 2s infinite`}
                                    >
                                        RELIABILITY: HIGH
                                    </Badge>
                                </Flex>

                                <Box
                                    className="markdown-body"
                                    sx={{
                                        'h1': { fontSize: '2xl', color: 'pink.500', mt: 8, mb: 4, fontWeight: 'black', textTransform: 'uppercase', letterSpacing: 'tight' },
                                        'h2': { fontSize: 'xl', color: 'purple.500', mt: 6, mb: 4, fontWeight: 'bold', borderBottom: '1px solid', borderColor: useColorModeValue('gray.100', 'whiteAlpha.100'), pb: 2 },
                                        'h3': { fontSize: 'lg', color: 'pink.400', mt: 5, mb: 3 },
                                        'p': { mb: 5, lineHeight: '1.8', color: verdictTextColor, fontSize: 'md' },
                                        'ul, ol': { mb: 5, pl: 5, listStyleType: 'square' },
                                        'li': { mb: 2, color: useColorModeValue('gray.600', 'whiteAlpha.700') },
                                        'strong': { color: 'pink.600', fontWeight: 'black' },
                                        'blockquote': {
                                            bg: useColorModeValue('gray.50', 'whiteAlpha.50'),
                                            borderLeft: '4px solid',
                                            borderColor: 'pink.500',
                                            p: 6,
                                            my: 6,
                                            borderRadius: 'r',
                                            fontStyle: 'italic',
                                            color: useColorModeValue('gray.700', 'whiteAlpha.900')
                                        },
                                        'code': { bg: useColorModeValue('gray.100', 'blackAlpha.700'), p: 1, borderRadius: 'md', color: useColorModeValue('purple.600', 'cyan.300'), fontSize: 'sm' }
                                    }}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {result}
                                    </ReactMarkdown>
                                </Box>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* Loading Overlay */}
                    {isLoading && (
                        <VStack spacing={4} py={10}>
                            {/* Loading Overlay with Live Logs */}
                            <NeuralLoading
                                isOpen={isLoading}
                                message="Neural Grid Deliberating..."
                                logs={logs} // Pass logs to NeuralLoading
                            />
                            <Text color="pink.400" fontSize="xs" letterSpacing="0.5em" animation={`${pulse} 1.5s infinite`}>ESTABLISHING_NEURAL_LINKS</Text>
                        </VStack>
                    )}

                </VStack>
            </Container>

            {/* Futuristic Grid Overlay */}
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                h="100vh"
                zIndex={9999}
                pointerEvents="none"
                opacity={0.05}
                backgroundImage="radial-gradient(#000 1px, transparent 1px)"
                backgroundSize="40px 40px"
            />
        </Box>
    );
};

// Internal utility component
const Circle = ({ size, ...props }: any) => <Box w={size} h={size} borderRadius="full" {...props} />;

export default ReviewSpecialistsForm;
