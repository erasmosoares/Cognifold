import { IconType } from 'react-icons';
import { BoxProps, FlexProps } from '@chakra-ui/react';

export interface LinkItemProps {
  name: string;
  icon: IconType;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export interface SidebarProps extends BoxProps {
  onClose: () => void;
  onLinkClick: (linkName: string) => void;
}

