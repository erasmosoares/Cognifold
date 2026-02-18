import { drawerTheme } from './components/themes/drawerTheme';
import { extendTheme, ThemeConfig } from "@chakra-ui/react";


const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false
};

const theme = extendTheme({
  config,
  // Use semantic tokens for body bg/text; switch by color mode
  semanticTokens: {
    colors: {
      'chakra-body-bg': {
        default: '#FFFFFF',
        _dark: '#0F1115' // softer dark
      },
      'chakra-body-text': {
        default: '#1A202C',
        _dark: '#E5E7EB'
      }
    }
  },
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      'html, body, #root': {
        backgroundColor: props.colorMode === 'dark' ? '#0F1115' : '#FFFFFF',
        color: props.colorMode === 'dark' ? '#E5E7EB' : '#1A202C'
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px'
      },
      '::-webkit-scrollbar-thumb': {
        background: props.colorMode === 'dark' ? '#3A3F4A' : '#CFCFCF',
        borderRadius: '8px'
      }
    })
  },
  // Component-level dark mode tweaks
  components: {
    Drawer: drawerTheme,
    Box: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        backgroundColor: 'transparent',
        borderColor: props.colorMode === 'dark' ? '#222632' : '#E2E8F0',
        boxShadow: 'none'
      })
    },
    Card: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        container: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          boxShadow: 'none'
        }
      })
    },
    Modal: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        dialog: {
          backgroundColor: props.colorMode === 'dark' ? '#12161F' : '#FFFFFF'
        }
      })
    },
    Tabs: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        tabpanel: {
          backgroundColor: 'transparent'
        },
        tabpanels: {
          backgroundColor: 'transparent'
        },
        tab: {
          _selected: {
            backgroundColor: 'transparent',
            borderBottomWidth: '2px',
            borderBottomColor: props.colorMode === 'dark' ? '#3A3F4A' : '#3182CE',
          }
        }
      })
    },
    Input: {
      variants: {
        outline: (props: { colorMode: 'light' | 'dark' }) => ({
          field: {
            backgroundColor: 'transparent',
            borderColor: props.colorMode === 'dark' ? '#222632' : '#E2E8F0',
            _hover: {
              borderColor: props.colorMode === 'dark' ? '#3A3F4A' : '#CBD5E0'
            },
            _focusVisible: {
              borderColor: props.colorMode === 'dark' ? '#6B7280' : '#3182CE',
              boxShadow: 'none'
            },
            _disabled: {
              opacity: 0.6
            }
          }
        }),
        filled: {
          field: {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    Textarea: {
      variants: {
        outline: (props: { colorMode: 'light' | 'dark' }) => ({
          bg: 'transparent',
          borderColor: props.colorMode === 'dark' ? '#222632' : '#E2E8F0',
          _hover: {
            borderColor: props.colorMode === 'dark' ? '#3A3F4A' : '#CBD5E0'
          },
          _focusVisible: {
            borderColor: props.colorMode === 'dark' ? '#6B7280' : '#3182CE',
            boxShadow: 'none'
          }
        })
      }
    },
    Select: {
      variants: {
        outline: (props: { colorMode: 'light' | 'dark' }) => ({
          field: {
            backgroundColor: 'transparent',
            borderColor: props.colorMode === 'dark' ? '#222632' : '#E2E8F0',
            _hover: {
              borderColor: props.colorMode === 'dark' ? '#3A3F4A' : '#CBD5E0'
            },
            _focusVisible: {
              borderColor: props.colorMode === 'dark' ? '#6B7280' : '#3182CE',
              boxShadow: 'none'
            }
          }
        })
      }
    }
  }
});


export default theme;