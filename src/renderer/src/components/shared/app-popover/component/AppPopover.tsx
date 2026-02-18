// React-related imports
import React from 'react';

// Chakra UI imports
import { Box } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'; // Moved here for consistency

// Chakra UI icons
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';

// Chakra UI Popover components (grouped)
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button
} from '@chakra-ui/react';

interface PopoverProps {
  currentStep: number;
  onClose: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  headerText: string;
  bodyText: string;
  totalPages: number;
}

const AppPopover: React.FC<PopoverProps> = ({
  currentStep,
  onClose,
  onPrevStep,
  onNextStep,
  headerText,
  bodyText,
  totalPages,
}) => {
  return (
    <Popover
      placement='bottom'
      closeOnBlur={false}
      onClose={onClose}
    >
      <PopoverTrigger>
      <Button
            leftIcon={<QuestionOutlineIcon />} // Add QuestionOutlineIcon to the button
            colorScheme="teal"
            variant="outline"
            rounded="full" // Set the button to be rounded
            ml={2} // Add some left margin
            >Help</Button>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          {headerText}
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
          {bodyText}
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <Box fontSize='sm'>{`Step ${currentStep} of ${totalPages}`}</Box>
          {currentStep > 1 && (
            <IconButton
              icon={<ChevronLeftIcon />}
              colorScheme='teal'
              variant='outline'
              aria-label='Call Sage'
              onClick={onPrevStep}
            />
          )}
          {currentStep < totalPages && (
            <IconButton
              icon={<ChevronRightIcon />}
              colorScheme='teal'
              variant='outline'
              aria-label='Call Sage'
              onClick={onNextStep}
            />
          )}
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default AppPopover; 
