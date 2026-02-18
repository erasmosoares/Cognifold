// Chakra UI imports
import { Box, HStack } from "@chakra-ui/react";

// Lottie animation import
import Lottie from 'lottie-react';
import animationNoDataFound from '../../../assets/animations/Animation - Home.json';


const NoDataFoundHome = () => {
    
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
        </HStack>
    )
}

export default NoDataFoundHome