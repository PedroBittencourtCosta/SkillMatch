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
  SimpleGrid,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function Login() {
  const { login, alunos, empresas } = useApp();
  const navigate = useNavigate();

  const handleLoginAluno = (alunoId) => {
    login('aluno', alunoId);
    navigate('/projetos');
  };

  const handleLoginEmpresa = (empresaId) => {
    login('empresa', empresaId);
    navigate('/empresa/dashboard');
  };

  return (
    <Box minH="calc(100vh - 70px)" py={16}>
      <Container maxW="700px">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8}>
            <VStack spacing={2} textAlign="center">
              <Heading fontSize="2xl" fontWeight="800">
                Entrar no SkillMatch
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Selecione um perfil para testar o protótipo
              </Text>
            </VStack>

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
                    👩‍💻 Sou Aluno
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    _selected={{ bg: 'rgba(0,198,255,0.2)', color: 'cyan.300' }}
                    fontWeight="600"
                    fontSize="sm"
                  >
                    🏢 Sou Empresa
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Alunos */}
                  <TabPanel px={0}>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                      {alunos.map((aluno) => (
                        <Flex
                          key={aluno.id}
                          bg="rgba(255,255,255,0.03)"
                          border="1px solid rgba(255,255,255,0.06)"
                          borderRadius="xl"
                          p={4}
                          cursor="pointer"
                          transition="all 0.2s ease"
                          _hover={{
                            bg: 'rgba(0,198,255,0.08)',
                            borderColor: 'rgba(0,198,255,0.3)',
                            transform: 'translateY(-2px)',
                          }}
                          onClick={() => handleLoginAluno(aluno.id)}
                          direction="column"
                          gap={2}
                        >
                          <HStack spacing={3}>
                            <Text fontSize="2xl">{aluno.avatar}</Text>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="700" fontSize="sm">{aluno.nome}</Text>
                              <Text fontSize="xs" color="gray.500">{aluno.nivel}</Text>
                            </VStack>
                          </HStack>
                          <HStack spacing={1} flexWrap="wrap">
                            {aluno.skills.slice(0, 3).map((s) => (
                              <Badge
                                key={s}
                                bg="rgba(0,198,255,0.1)"
                                color="cyan.300"
                                borderRadius="full"
                                px={2}
                                fontSize="9px"
                              >
                                {s}
                              </Badge>
                            ))}
                          </HStack>
                          {aluno.em_projeto && (
                            <Badge colorScheme="yellow" borderRadius="full" fontSize="9px" w="fit-content">
                              Em projeto ativo
                            </Badge>
                          )}
                        </Flex>
                      ))}
                    </SimpleGrid>
                  </TabPanel>

                  {/* Empresas */}
                  <TabPanel px={0}>
                    <SimpleGrid columns={1} spacing={3}>
                      {empresas.map((empresa) => (
                        <Flex
                          key={empresa.id}
                          bg="rgba(255,255,255,0.03)"
                          border="1px solid rgba(255,255,255,0.06)"
                          borderRadius="xl"
                          p={4}
                          cursor="pointer"
                          transition="all 0.2s ease"
                          _hover={{
                            bg: 'rgba(0,198,255,0.08)',
                            borderColor: 'rgba(0,198,255,0.3)',
                            transform: 'translateY(-2px)',
                          }}
                          onClick={() => handleLoginEmpresa(empresa.id)}
                          align="center"
                          gap={4}
                        >
                          <Text fontSize="3xl">{empresa.avatar}</Text>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="700" fontSize="sm">{empresa.nome}</Text>
                            <Text fontSize="xs" color="gray.500">{empresa.tipo} • {empresa.cidade}</Text>
                          </VStack>
                        </Flex>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            <Text fontSize="xs" color="gray.600" textAlign="center">
              ⚡ Protótipo sem autenticação real — selecione qualquer perfil para explorar
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
