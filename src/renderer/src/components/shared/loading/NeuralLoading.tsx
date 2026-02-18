import {
    Box,
    Center,
    VStack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useColorModeValue
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.5; filter: blur(8px); }
  50% { opacity: 1; filter: blur(12px); }
`;

export const NeuralLoading = ({
    message = "Synthesizing Consensus...",
    isOpen = true,
    logs = [],
    showTerminal: showTerminalProp
}: {
    message?: string;
    isOpen?: boolean;
    logs?: string[];
    showTerminal?: boolean;
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showTerminal, setShowTerminal] = useState(showTerminalProp ?? false);

    useEffect(() => {
        if (showTerminalProp === undefined) {
            const saved = localStorage.getItem('SHOW_TERMINAL');
            setShowTerminal(saved === 'true'); // Default to false
        } else {
            setShowTerminal(showTerminalProp);
        }
    }, [showTerminalProp]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Neural activity intensity (fluctuates based on recent activity)
    const [neuralIntensity, setNeuralIntensity] = useState(0);
    const [lastLogCount, setLastLogCount] = useState(0);

    useEffect(() => {
        if (logs.length === 0) {
            setNeuralIntensity(20); // Base activity when starting
        } else if (logs.length > lastLogCount) {
            // Spike in activity when new logs arrive
            setNeuralIntensity(Math.min(100, 40 + (logs.length * 3)));
            setLastLogCount(logs.length);
        }
    }, [logs, lastLogCount]);

    // Gradually decay intensity to simulate neural pulse waves
    useEffect(() => {
        const interval = setInterval(() => {
            setNeuralIntensity(prev => {
                if (prev > 30) {
                    return Math.max(30, prev - 2); // Decay to baseline
                }
                // Pulse at baseline
                return 30 + Math.sin(Date.now() / 500) * 10;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const terminalBg = useColorModeValue('blackAlpha.300', 'blackAlpha.700');

    const content = (
        <VStack spacing={6} py={6} w="full">
            <Box
                position="relative"
                w="160px"
                h="160px"
                sx={{ perspective: '1000px' }}
            >
                {/* Neon Glow Background */}
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    w="120px"
                    h="120px"
                    bg="blue.500"
                    filter="blur(50px)"
                    opacity={0.3}
                    borderRadius="full"
                    animation={`${pulse} 3s ease-in-out infinite`}
                />

                {/* SVG Brain Mesh */}
                <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <svg
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(66, 153, 225, 0.8))' }}
                    >
                        <motion.path
                            d="M100 20C60 20 20 50 20 100C20 150 60 180 100 180C140 180 180 150 180 100C180 50 140 20 100 20Z"
                            stroke="url(#gradient)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4299E1" />
                                <stop offset="100%" stopColor="#9F7AEA" />
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="15" fill="url(#gradient)" opacity="0.8">
                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </motion.div>
            </Box>

            <VStack spacing={2}>
                <Text
                    fontSize="sm"
                    fontWeight="black"
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    bgClip="text"
                    letterSpacing="0.4em"
                    textTransform="uppercase"
                    textAlign="center"
                >
                    {message}
                </Text>
                <Box h="2px" w="40px" bgGradient="linear(to-r, blue.400, purple.500)" borderRadius="full" />
            </VStack>

            {/* Neural Pulse Visualizer */}
            <VStack spacing={3} w="full" maxW="600px">
                {/* Wave Bars Container */}
                <Box
                    w="full"
                    h="60px"
                    position="relative"
                    bg="blackAlpha.400"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    overflow="hidden"
                    backdropFilter="blur(10px)"
                >
                    {/* Glow background */}
                    <Box
                        position="absolute"
                        inset={0}
                        bgGradient="linear(to-r, blue.500, purple.500)"
                        opacity={neuralIntensity / 200}
                        animation={`${glow} 2s ease-in-out infinite`}
                    />

                    {/* Neural Wave Bars */}
                    <Box
                        position="absolute"
                        inset={0}
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="space-around"
                        px={2}
                        py={2}
                    >
                        {Array.from({ length: 40 }).map((_, i) => {
                            const delay = i * 0.05;
                            const heightMultiplier = (neuralIntensity / 100) * (0.5 + Math.sin(i * 0.3) * 0.5);
                            return (
                                <Box
                                    key={i}
                                    w="2px"
                                    h={`${20 + heightMultiplier * 60}%`}
                                    bgGradient="linear(to-t, blue.400, purple.500)"
                                    borderRadius="full"
                                    animation={`${wave} ${1 + (i % 3) * 0.2}s ease-in-out infinite`}
                                    style={{ animationDelay: `${delay}s` }}
                                    opacity={0.6 + (neuralIntensity / 200)}
                                    boxShadow={neuralIntensity > 60 ? "0 0 8px rgba(139, 92, 246, 0.6)" : "none"}
                                    transition="all 0.3s ease"
                                />
                            );
                        })}
                    </Box>

                    {/* Intensity indicator line */}
                    <Box
                        position="absolute"
                        left={0}
                        right={0}
                        bottom={`${neuralIntensity * 0.6}%`}
                        h="1px"
                        bg="cyan.400"
                        boxShadow="0 0 10px rgba(34, 211, 238, 0.8)"
                        transition="bottom 0.3s ease"
                    />
                </Box>

                {/* Status Text */}
                <Box
                    w="full"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                >
                    <Text fontSize="xs" color="whiteAlpha.600" fontFamily="monospace" letterSpacing="wider">
                        NEURAL_ACTIVITY: {neuralIntensity.toFixed(0)}%
                    </Text>
                    <Text fontSize="xs" color="blue.400" fontFamily="monospace" fontWeight="bold">
                        {logs.length} PULSES
                    </Text>
                </Box>
            </VStack>

            {/* Neural Log Terminal - Conditionally Rendered */}
            {showTerminal && (
                <Box
                    w="full"
                    maxW="900px"
                    h="300px"
                    bg={terminalBg}
                    backdropFilter="blur(10px)"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    position="relative"
                    overflow="hidden"
                    p={4}
                >
                    {/* Scanline Effect */}
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="2px"
                        bg="blue.500"
                        opacity={0.1}
                        animation={`${scanline} 4s linear infinite`}
                        zIndex={2}
                        pointerEvents="none"
                    />

                    <Box
                        ref={scrollRef}
                        h="full"
                        overflowY="auto"
                        fontSize="10px"
                        fontFamily="monospace"
                        color="blue.300"
                        sx={{
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { background: 'whiteAlpha.200', borderRadius: '2px' },
                        }}
                    >
                        <AnimatePresence>
                            {logs.length === 0 ? (
                                <Text opacity={0.5} fontStyle="italic">Waiting for neural linkage...</Text>
                            ) : (
                                logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Text mb={1} whiteSpace="pre-wrap">
                                            <Box as="span" color="purple.400" mr={2}>[NEURAL_PULSE]</Box>
                                            {log}
                                        </Text>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            )}
        </VStack>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }}
            isCentered
            closeOnOverlayClick={false}
            closeOnEsc={false}
            size="6xl"
        >
            <ModalOverlay backdropFilter="blur(15px)" />
            <ModalContent
                bg="transparent"
                boxShadow="none"
                border="none"
            >
                <ModalBody>
                    <Center>
                        {content}
                    </Center>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NeuralLoading;
