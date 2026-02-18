import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    Icon,
    Box,
    useColorModeValue,
    Heading
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

interface ApiKeyAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToSettings: () => void;
    missingKeys: string[];
}

const ApiKeyAlert = ({ isOpen, onClose, onGoToSettings, missingKeys }: ApiKeyAlertProps) => {
    const bgColor = useColorModeValue('gray.900', 'black');
    const accentColor = 'red.400';

    const glowStyle = {
        boxShadow: '0 0 20px rgba(245, 101, 101, 0.4)',
        border: '1px solid',
        borderColor: 'red.500'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
            <ModalOverlay backdropFilter="blur(10px) brightness(0.4)" />
            <ModalContent
                bg={bgColor}
                borderRadius="xl"
                {...glowStyle}
                p={4}
            >
                <ModalHeader textAlign="center">
                    <VStack spacing={4}>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Icon as={WarningIcon} w={12} h={12} color={accentColor} />
                        </motion.div>
                        <Heading size="md" color="white" letterSpacing="widest">
                            INTELLIGENCE OFFLINE
                        </Heading>
                    </VStack>
                </ModalHeader>
                <ModalBody>
                    <VStack spacing={6}>
                        <Text color="gray.300" textAlign="center" fontSize="sm" lineHeight="tall">
                            Agent deliberation cannot proceed. The following neural conduits are missing their security keys:
                        </Text>
                        <Box w="full" bg="rgba(255,0,0,0.1)" p={3} borderRadius="md" borderLeft="4px solid" borderColor="red.400">
                            {missingKeys.map((key) => (
                                <Text key={key} color="red.200" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                    • {key.replace('_', ' ')}
                                </Text>
                            ))}
                        </Box>
                        <Text color="gray.400" fontSize="xs" textAlign="center" as="i">
                            Please configure your API keys in the system settings to restore cognitive functions.
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter justifyContent="center" gap={4}>
                    <Button
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                        onClick={onClose}
                    >
                        Dismiss
                    </Button>
                    <Button
                        bgGradient="linear(to-r, red.500, orange.600)"
                        color="white"
                        _hover={{ bgGradient: 'linear(to-r, red.600, orange.700)', boxShadow: '0 0 15px rgba(245, 101, 101, 0.6)' }}
                        onClick={onGoToSettings}
                    >
                        Initialize Settings
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ApiKeyAlert;
