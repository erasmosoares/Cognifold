import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'rgba(0, 0, 0, 0.45)', // Softer backdrop
  },
  dialog: {
    bg: '#FFFFFF',
    backdropFilter: 'blur(10px)', // works in both light/dark
    _dark: {
      bg: 'rgba(18, 22, 31, 0.85)', // semi-transparent to match #12161F tone
      backdropFilter: 'blur(14px)', // slightly more blur in dark mode
      border: '1px solid rgba(255, 255, 255, 0.06)', // subtle frosted border
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    },
    borderRadius: 'md',
  },
})

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
})