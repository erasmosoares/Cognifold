import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    VStack,
    HStack,
    Input,
    IconButton,
    Text,
    Flex,
    Image,
    useColorModeValue,
    Container,
    useDisclosure,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import CognifoldFace from '@renderer/assets/cognifold_face.png';
import MarkdownRenderer from '@renderer/components/shared/markdown/MarkdownRenderer';
import ApiKeyAlert from '@renderer/components/shared/alerts/ApiKeyAlert';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationalAgentsProps {
    agentName: string;
    endpoint: string;
    accentColor: string;
    systemLabel: string;
    placeholder?: string;
}

const scanLine = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const ConversationalAgents: React.FC<ConversationalAgentsProps> = ({
    agentName,
    endpoint,
    accentColor = "blue.500",
    systemLabel,
    placeholder = "Enter query for deliberations..."
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const bgColor = useColorModeValue('whiteAlpha.800', 'rgba(10, 15, 25, 0.4)');
    const panelBg = useColorModeValue('white', 'rgba(10, 15, 25, 0.7)');
    const userMsgColor = useColorModeValue('blue.50', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const systemTextColor = useColorModeValue('gray.500', 'whiteAlpha.500');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleGoToSettings = () => {
        onAlertClose();
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'Settings' }));
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Check for API key before sending
        const openaiKey = localStorage.getItem('OPENAI_API_KEY');
        if (!openaiKey) {
            setMissingKeys(['OPENAI_API_KEY']);
            onAlertOpen();
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const openaiKey = localStorage.getItem('OPENAI_API_KEY');
            const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-openai-api-key': openaiKey || '',
                },
                body: JSON.stringify({
                    message: input,
                    history: messages.slice(-10),
                }),
            });

            const data = await response.json();
            if (data.response) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'SYSTEM_ERROR: Neural bridge collapsed. Check API uplink.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="full" h="calc(100vh - 220px)" p={0}>
            <ApiKeyAlert
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                onGoToSettings={handleGoToSettings}
                missingKeys={missingKeys}
            />
            <Flex h="full" direction={{ base: "column", lg: "row" }} align="stretch" gap={6}>
                {/* LEFT COLUMN: Neural Interface Component */}
                <Flex
                    flex={{ base: "none", lg: "0 0 350px" }}
                    direction="column"
                    align="center"
                    justify="center"
                    bg={panelBg}
                    borderRadius="3xl"
                    p={8}
                    border="1px solid"
                    borderColor={borderColor}
                    backdropFilter="blur(20px)"
                    position="relative"
                    overflow="hidden"
                >
                    {/* Decorative Hexagon Frame */}
                    <Box
                        position="relative"
                        w="280px"
                        h="300px"
                        bg="blackAlpha.800"
                        clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                        border="2px solid"
                        borderColor={accentColor}
                        transition="all 0.3s"
                    >
                        <motion.div
                            animate={{
                                scale: isLoading ? [1, 1.05, 1] : [1, 1.02, 1],
                                opacity: isLoading ? [0.8, 1, 0.8] : [0.9, 1, 0.9],
                            }}
                            transition={{
                                duration: isLoading ? 2 : 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <Image
                                src={CognifoldFace}
                                alt={`${agentName} Mesh`}
                                w="full"
                                h="full"
                                objectFit="contain"
                                filter={useColorModeValue('invert(0.8) brightness(1.2)', 'brightness(1.5)')}
                                style={{ filter: `drop-shadow(0 0 30px ${accentColor === 'blue.500' ? 'rgba(66, 153, 225, 0.3)' : 'rgba(237, 100, 166, 0.3)'})` }}
                            />
                        </motion.div>

                        {/* Scanning Line */}
                        {isLoading && (
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                h="2px"
                                bg={accentColor}
                                boxShadow={`0 0 15px ${accentColor}`}
                                animation={`${scanLine} 2s linear infinite`}
                            />
                        )}
                    </Box>

                    <VStack mt={8} spacing={2} textAlign="center">
                        <Text
                            fontSize="lg"
                            fontWeight="black"
                            letterSpacing="0.4em"
                            bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
                            bgClip="text"
                            textTransform="uppercase"
                        >
                            {isLoading ? "PROCESSING" : agentName}
                        </Text>
                        <Text fontSize="xs" color={systemTextColor} letterSpacing="widest" fontWeight="bold">
                            {systemLabel}
                        </Text>
                    </VStack>

                    {/* Corner accents */}
                    <Box position="absolute" top={0} left={0} p={3}>
                        <Box w="10px" h="10px" borderTop="2px solid" borderLeft="2px solid" borderColor={accentColor} opacity={0.5} />
                    </Box>
                    <Box position="absolute" bottom={0} right={0} p={3}>
                        <Box w="10px" h="10px" borderBottom="2px solid" borderRight="2px solid" borderColor={accentColor} opacity={0.5} />
                    </Box>
                </Flex>

                {/* RIGHT COLUMN: Data Fragment Stream */}
                <VStack flex={1} spacing={4} align="stretch" h="full">
                    <Box
                        flex={1}
                        overflowY="auto"
                        p={6}
                        bg={bgColor}
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor={borderColor}
                        backdropFilter="blur(20px)"
                        css={{
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { background: borderColor, borderRadius: '10px' },
                        }}
                    >
                        {messages.length === 0 && (
                            <Flex h="full" align="center" justify="center" direction="column" opacity={0.3}>
                                <Text fontSize="xs" letterSpacing="0.4em" fontWeight="black" color={accentColor}>NEURAL_LINK_IDLE</Text>
                                <Text fontSize="2xs" mt={2} letterSpacing="widest">AWAITING_INPUT_FRAGMENT</Text>
                            </Flex>
                        )}
                        <VStack spacing={8} align="stretch">
                            <AnimatePresence>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Box
                                            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                                            bg={msg.role === 'user' ? userMsgColor : "transparent"}
                                            p={msg.role === 'user' ? 4 : 0}
                                            borderRadius="2xl"
                                            maxW={msg.role === 'user' ? '85%' : '100%'}
                                            border={msg.role === 'user' ? '1px solid' : 'none'}
                                            borderColor={borderColor}
                                            position="relative"
                                        >
                                            <HStack spacing={2} mb={msg.role === 'user' ? 3 : 4}>
                                                <Box boxSize="4px" borderRadius="full" bg={accentColor} animation={`${pulse} 2s infinite`} />
                                                <Text fontSize="10px" fontWeight="black" color={accentColor} letterSpacing="0.2em">
                                                    {msg.role === 'user' ? 'USER_CORE' : `${agentName.toUpperCase()}_RESPONSE`}
                                                </Text>
                                                <Box h="1px" flex={1} bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')} />
                                                <Text fontSize="8px" color={systemTextColor} fontWeight="bold">T-{idx + 1}</Text>
                                            </HStack>

                                            {msg.role === 'user' ? (
                                                <Text fontSize="sm" lineHeight="tall" whiteSpace="pre-wrap">
                                                    {msg.content}
                                                </Text>
                                            ) : (
                                                <Box borderLeft="1px solid" borderColor={borderColor} pl={6} py={1}>
                                                    <MarkdownRenderer content={msg.content} />
                                                </Box>
                                            )}
                                        </Box>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isLoading && (
                                <Box alignSelf="flex-start" pl={6}>
                                    <HStack spacing={4}>
                                        <Box
                                            w="12px"
                                            h="12px"
                                            border="2px solid"
                                            borderColor={accentColor}
                                            borderRadius="2px"
                                            animation={`${pulse} 1s infinite`}
                                        />
                                        <Text fontSize="xs" fontWeight="black" letterSpacing="widest" opacity={0.6} color={accentColor}>
                                            DECRYPTING_STREAM...
                                        </Text>
                                    </HStack>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </VStack>
                    </Box>

                    {/* Input Hub */}
                    <HStack spacing={4}>
                        <Input
                            placeholder={placeholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            size="lg"
                            bg={panelBg}
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor={borderColor}
                            backdropFilter="blur(20px)"
                            _focus={{
                                borderColor: accentColor,
                                boxShadow: `0 0 20px rgba(66, 153, 225, 0.1)`,
                                transform: 'translateY(-1px)'
                            }}
                            transition="all 0.3s"
                            fontSize="sm"
                            fontWeight="medium"
                            letterSpacing="wide"
                        />
                        <IconButton
                            icon={<FiSend />}
                            aria-label="Send message"
                            size="lg"
                            borderRadius="2xl"
                            onClick={handleSendMessage}
                            isLoading={isLoading}
                            bgGradient={`linear(to-r, ${accentColor}, purple.600)`}
                            color="white"
                            _hover={{ transform: 'scale(1.05)', filter: 'brightness(1.2)' }}
                            _active={{ transform: 'scale(0.95)' }}
                            px={8}
                        />
                    </HStack>
                </VStack>
            </Flex>
        </Container>
    );
};

export default ConversationalAgents;
