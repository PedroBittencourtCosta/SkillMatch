import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  useToast,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';

const MotionBox = motion(Box);

// Usuários mockados para login
const MOCK_USERS = [
  {
    email: 'dev@email.com',
    senha: '123456',
    tipo: 'aluno',
    alunoId: 'alu1',
  },
  {
    email: 'empresa@email.com',
    senha: '123456',
    tipo: 'empresa',
    empresaId: 'emp1',
  },
];

const inputStyles = {
  bg: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'xl',
  _hover: { borderColor: 'rgba(0,198,255,0.3)' },
  _focus: { borderColor: 'cyan.500', boxShadow: 'none' },
  _placeholder: { color: 'gray.500' },
};

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [showLoginSenha, setShowLoginSenha] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Cadastro state
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadSenha, setCadSenha] = useState('');
  const [cadTipo, setCadTipo] = useState('aluno');
  const [showCadSenha, setShowCadSenha] = useState(false);
  const [cadLoading, setCadLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginEmail || !loginSenha) {
      toast({
        title: 'Preencha todos os campos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoginLoading(true);

    // Simula um delay de rede
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === loginEmail && u.senha === loginSenha
      );

      if (!user) {
        toast({
          title: 'Credenciais inválidas',
          description: 'E-mail ou senha incorretos.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoginLoading(false);
        return;
      }

      if (user.tipo === 'aluno') {
        login('aluno', user.alunoId);
        navigate('/projetos');
      } else {
        login('empresa', user.empresaId);
        navigate('/empresa/dashboard');
      }

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo de volta!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setLoginLoading(false);
    }, 600);
  };

  const handleCadastro = (e) => {
    e.preventDefault();

    if (!cadNome || !cadEmail || !cadSenha) {
      toast({
        title: 'Preencha todos os campos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (cadSenha.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCadLoading(true);

    // Simula cadastro (mockado)
    setTimeout(() => {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Use suas credenciais para fazer login.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCadLoading(false);
      setCadNome('');
      setCadEmail('');
      setCadSenha('');
    }, 800);
  };

  return (
    <Box minH="calc(100vh - 70px)" py={16}>
      <Container maxW="480px">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8}>
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Heading fontSize="2xl" fontWeight="800">
                Entrar no SkillMatch
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Conecte-se e encontre projetos incríveis
              </Text>
            </VStack>

            {/* Card do formulário */}
            <Box
              w="100%"
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <Tabs variant="soft-rounded" colorScheme="cyan" isFitted>
                <TabList
                  bg="rgba(255,255,255,0.04)"
                  borderRadius="xl"
                  p={1}
                  mb={6}
                >
                  <Tab
                    borderRadius="lg"
                    _selected={{ bg: 'rgba(0,198,255,0.2)', color: 'cyan.300' }}
                    fontWeight="600"
                    fontSize="sm"
                  >
                    Entrar
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    _selected={{ bg: 'rgba(0,198,255,0.2)', color: 'cyan.300' }}
                    fontWeight="600"
                    fontSize="sm"
                  >
                    Cadastrar
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* ===== TAB LOGIN ===== */}
                  <TabPanel px={0}>
                    <form onSubmit={handleLogin}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            E-mail
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <HiMail color="gray" />
                            </InputLeftElement>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              {...inputStyles}
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            Senha
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <HiLockClosed color="gray" />
                            </InputLeftElement>
                            <Input
                              type={showLoginSenha ? 'text' : 'password'}
                              placeholder="••••••"
                              value={loginSenha}
                              onChange={(e) => setLoginSenha(e.target.value)}
                              {...inputStyles}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                icon={showLoginSenha ? <HiEyeOff /> : <HiEye />}
                                onClick={() => setShowLoginSenha(!showLoginSenha)}
                                aria-label="Mostrar senha"
                                color="gray.500"
                                _hover={{ color: 'cyan.300' }}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <Button
                          type="submit"
                          w="100%"
                          bg="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                          color="white"
                          borderRadius="xl"
                          fontWeight="700"
                          fontSize="sm"
                          _hover={{
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                          }}
                          _active={{ transform: 'translateY(0)' }}
                          transition="all 0.2s ease"
                          isLoading={loginLoading}
                          loadingText="Entrando..."
                          mt={2}
                        >
                          Entrar
                        </Button>
                      </VStack>
                    </form>

                    {/* Credenciais de demonstração */}
                    <Box mt={6}>
                      <Divider borderColor="rgba(255,255,255,0.06)" mb={4} />
                      <Text fontSize="xs" color="gray.500" mb={3} textAlign="center">
                        Contas de demonstração
                      </Text>
                      <VStack spacing={2}>
                        <Box
                          w="100%"
                          bg="rgba(255,255,255,0.03)"
                          border="1px solid rgba(255,255,255,0.06)"
                          borderRadius="lg"
                          p={3}
                          cursor="pointer"
                          transition="all 0.2s ease"
                          _hover={{
                            bg: 'rgba(0,198,255,0.06)',
                            borderColor: 'rgba(0,198,255,0.2)',
                          }}
                          onClick={() => {
                            setLoginEmail('dev@email.com');
                            setLoginSenha('123456');
                          }}
                        >
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Text fontSize="lg">👩‍💻</Text>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" fontWeight="600">
                                  Desenvolvedor
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  dev@email.com
                                </Text>
                              </VStack>
                            </HStack>
                            <Badge
                              bg="rgba(0,198,255,0.1)"
                              color="cyan.300"
                              borderRadius="full"
                              px={2}
                              fontSize="9px"
                            >
                              Senha: 123456
                            </Badge>
                          </HStack>
                        </Box>

                        <Box
                          w="100%"
                          bg="rgba(255,255,255,0.03)"
                          border="1px solid rgba(255,255,255,0.06)"
                          borderRadius="lg"
                          p={3}
                          cursor="pointer"
                          transition="all 0.2s ease"
                          _hover={{
                            bg: 'rgba(0,198,255,0.06)',
                            borderColor: 'rgba(0,198,255,0.2)',
                          }}
                          onClick={() => {
                            setLoginEmail('empresa@email.com');
                            setLoginSenha('123456');
                          }}
                        >
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Text fontSize="lg">🏢</Text>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" fontWeight="600">
                                  Empresa
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  empresa@email.com
                                </Text>
                              </VStack>
                            </HStack>
                            <Badge
                              bg="rgba(0,198,255,0.1)"
                              color="cyan.300"
                              borderRadius="full"
                              px={2}
                              fontSize="9px"
                            >
                              Senha: 123456
                            </Badge>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </TabPanel>

                  {/* ===== TAB CADASTRO ===== */}
                  <TabPanel px={0}>
                    <form onSubmit={handleCadastro}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            Nome completo
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <HiUser color="gray" />
                            </InputLeftElement>
                            <Input
                              placeholder="Seu nome"
                              value={cadNome}
                              onChange={(e) => setCadNome(e.target.value)}
                              {...inputStyles}
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            E-mail
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <HiMail color="gray" />
                            </InputLeftElement>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              value={cadEmail}
                              onChange={(e) => setCadEmail(e.target.value)}
                              {...inputStyles}
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            Senha
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <HiLockClosed color="gray" />
                            </InputLeftElement>
                            <Input
                              type={showCadSenha ? 'text' : 'password'}
                              placeholder="Mínimo 6 caracteres"
                              value={cadSenha}
                              onChange={(e) => setCadSenha(e.target.value)}
                              {...inputStyles}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                icon={showCadSenha ? <HiEyeOff /> : <HiEye />}
                                onClick={() => setShowCadSenha(!showCadSenha)}
                                aria-label="Mostrar senha"
                                color="gray.500"
                                _hover={{ color: 'cyan.300' }}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs" color="gray.400" mb={1}>
                            Tipo de conta
                          </FormLabel>
                          <Select
                            value={cadTipo}
                            onChange={(e) => setCadTipo(e.target.value)}
                            {...inputStyles}
                          >
                            <option value="aluno">👩‍💻 Desenvolvedor</option>
                            <option value="empresa">🏢 Empresa</option>
                          </Select>
                        </FormControl>

                        <Button
                          type="submit"
                          w="100%"
                          bg="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                          color="white"
                          borderRadius="xl"
                          fontWeight="700"
                          fontSize="sm"
                          _hover={{
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                          }}
                          _active={{ transform: 'translateY(0)' }}
                          transition="all 0.2s ease"
                          isLoading={cadLoading}
                          loadingText="Criando conta..."
                          mt={2}
                        >
                          Criar conta
                        </Button>
                      </VStack>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            <Text fontSize="xs" color="gray.600" textAlign="center">
              ⚡ Protótipo — clique nas contas de demonstração para preencher automaticamente
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
