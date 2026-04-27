import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80c8ff',
      300: '#4db1ff',
      400: '#1a99ff',
      500: '#0080e6',
      600: '#0064b3',
      700: '#004880',
      800: '#002c4d',
      900: '#00101a',
    },
    accent: {
      50: '#fff0e6',
      100: '#ffd1b3',
      200: '#ffb380',
      300: '#ff944d',
      400: '#ff751a',
      500: '#e65c00',
      600: '#b34700',
      700: '#803300',
      800: '#4d1f00',
      900: '#1a0a00',
    },
    glass: {
      bg: 'rgba(26, 32, 44, 0.7)',
      border: 'rgba(255, 255, 255, 0.08)',
      hover: 'rgba(255, 255, 255, 0.04)',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#0a0e1a',
        color: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      variants: {
        brand: {
          bg: 'linear-gradient(135deg, #0080e6, #00c6ff)',
          color: 'white',
          fontWeight: '600',
          borderRadius: 'xl',
          _hover: {
            bg: 'linear-gradient(135deg, #0064b3, #0080e6)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 128, 230, 0.4)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.06)',
          color: 'gray.100',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.12)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'rgba(26, 32, 44, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2xl',
        },
      },
    },
  },
});

export default theme;
