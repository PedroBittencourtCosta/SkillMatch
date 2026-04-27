import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiChevronDown, HiLogout, HiRefresh } from 'react-icons/hi';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { usuario, logout, resetData, getTotalNaoLidas } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const totalNaoLidas = getTotalNaoLidas();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLinks = ({ direction = 'row', onClickLink }) => (
    <>
      {usuario?.tipo === 'aluno' && (
        <>
          <Button as={Link} to="/projetos" variant="ghost" size="sm" onClick={onClickLink}>
            Projetos
          </Button>
          <Button as={Link} to="/meu-projeto" variant="ghost" size="sm" onClick={onClickLink}>
            Meu Projeto
          </Button>
          <Button as={Link} to="/portfolio" variant="ghost" size="sm" onClick={onClickLink}>
            Portfólio
          </Button>
          <Button as={Link} to="/chat" variant="ghost" size="sm" onClick={onClickLink} position="relative">
            Chat
            {totalNaoLidas > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="9px"
                minW="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {totalNaoLidas}
              </Badge>
            )}
          </Button>
        </>
      )}
      {usuario?.tipo === 'empresa' && (
        <>
          <Button as={Link} to="/empresa/dashboard" variant="ghost" size="sm" onClick={onClickLink}>
            Dashboard
          </Button>
          <Button as={Link} to="/projetos" variant="ghost" size="sm" onClick={onClickLink}>
            Projetos
          </Button>
          <Button as={Link} to="/freelancers" variant="ghost" size="sm" onClick={onClickLink}>
            Freelancers
          </Button>
          <Button as={Link} to="/chat" variant="ghost" size="sm" onClick={onClickLink} position="relative">
            Chat
            {totalNaoLidas > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="9px"
                minW="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {totalNaoLidas}
              </Badge>
            )}
          </Button>
        </>
      )}
      {!usuario && (
        <Button as={Link} to="/login" variant="brand" size="sm" onClick={onClickLink}>
          Entrar
        </Button>
      )}
    </>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="rgba(10, 14, 26, 0.85)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(255,255,255,0.06)"
      px={{ base: 4, md: 8 }}
      py={3}
    >
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        {/* Logo */}
        <HStack spacing={2} as={Link} to={usuario ? (usuario.tipo === 'aluno' ? '/projetos' : '/empresa/dashboard') : '/'} _hover={{ textDecoration: 'none' }}>
          <Text
            fontSize="xl"
            fontWeight="800"
            bgGradient="linear(to-r, #00c6ff, #0080e6)"
            bgClip="text"
            letterSpacing="-0.5px"
          >
            SkillMatch
          </Text>
          <Badge
            colorScheme="cyan"
            variant="subtle"
            fontSize="9px"
            borderRadius="full"
            px={2}
          >
            BETA
          </Badge>
        </HStack>

        {/* Desktop Links */}
        <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
          {usuario && (
            <Menu>
              <MenuButton as={Button} variant="glass" size="sm" rightIcon={<HiChevronDown />}>
                {usuario.avatar} {usuario.nome?.split(' ')[0]}
              </MenuButton>
              <MenuList bg="gray.800" borderColor="whiteAlpha.100">
                <MenuItem icon={<HiRefresh />} onClick={resetData} bg="transparent" _hover={{ bg: 'whiteAlpha.100' }}>
                  Resetar Dados
                </MenuItem>
                <MenuItem icon={<HiLogout />} onClick={handleLogout} bg="transparent" _hover={{ bg: 'whiteAlpha.100' }}>
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={<HiMenu />}
          variant="ghost"
          onClick={onOpen}
          aria-label="Menu"
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton />
          <DrawerBody pt={12}>
            <VStack spacing={4} align="stretch">
              <NavLinks direction="column" onClickLink={onClose} />
              {usuario && (
                <>
                  <Button variant="ghost" size="sm" leftIcon={<HiRefresh />} onClick={() => { resetData(); onClose(); }}>
                    Resetar Dados
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={<HiLogout />} onClick={() => { handleLogout(); onClose(); }}>
                    Sair
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
