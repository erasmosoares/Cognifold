import React, { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaFlag } from 'react-icons/fa';

interface CustomAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  bodyText: string;
  leastDestructiveRef: React.RefObject<any>;
  icon?: ReactNode;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  isOpen,
  onClose,
  headerText,
  bodyText,
  leastDestructiveRef,
  icon = <Icon as={FaFlag} color="red.500" ml={2} />,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={leastDestructiveRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {headerText} {icon}
          </AlertDialogHeader>
          <AlertDialogBody>
            {bodyText}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={leastDestructiveRef} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CustomAlertDialog;