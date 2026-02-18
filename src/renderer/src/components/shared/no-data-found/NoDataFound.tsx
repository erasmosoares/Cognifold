// Chakra UI imports
import { HStack, Box, Text } from "@chakra-ui/react";

// Lottie animation import
import Lottie from 'lottie-react';
import animationNoDataFound from '../../../assets/animations/Animation - NothingHere.json';


const NoDataFound = () => {
    
    return (
        <HStack>
            <Box>
                <Lottie
                animationData={animationNoDataFound}
                loop={true} // Set to true if you want the animation to loop
                autoplay={true} // Set to true if you want the animation to play automatically
                style={{ width: '500px', height: '380px' }}
                />
            </Box>
            <Box>
                <Text fontSize='md'> Oups, it's kind of empty around here!</Text> 
               
            </Box>            
        </HStack>
    )
}

export default NoDataFound