import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HiLightningBolt, HiUserGroup, HiBriefcase, HiArrowRight, HiStar, HiShieldCheck, HiTrendingUp } from 'react-icons/hi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function Landing() {
  const steps = [
    {
      icon: <HiUserGroup size={28} />,
      title: 'Cadastre-se',
      desc: 'Alunos montam seu perfil com skills. Empresas descrevem sua necessidade.',
      color: '#00c6ff',
    },
    {
      icon: <HiLightningBolt size={28} />,
      title: 'Match Inteligente',
      desc: 'Alunos encontram projetos alinhados com suas habilidades e interesses.',
      color: '#ff944d',
    },
    {
      icon: <HiBriefcase size={28} />,
      title: 'Entregue & Cresça',
      desc: 'Complete o projeto, ganhe experiência real e construa seu portfólio.',
      color: '#48bb78',
    },
  ];

  const stats = [
    { value: '500+', label: 'Alunos Ativos' },
    { value: '120+', label: 'Projetos Entregues' },
    { value: '85%', label: 'Taxa de Sucesso' },
    { value: '50+', label: 'Empresas Parceiras' },
  ];

  const benefits = [
    {
      icon: <HiStar size={24} />,
      title: 'Portfólio Real',
      desc: 'Projetos concluídos entram automaticamente no seu portfólio profissional.',
      color: '#ffd700',
    },
    {
      icon: <HiShieldCheck size={24} />,
      title: 'Ambiente Seguro',
      desc: 'Entregas validadas e comunicação estruturada entre aluno e empresa.',
      color: '#00c6ff',
    },
    {
      icon: <HiTrendingUp size={24} />,
      title: 'Crescimento Mútuo',
      desc: 'Micro-negócios digitalizam operações. Alunos ganham experiência prática.',
      color: '#48bb78',
    },
  ];

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box position="relative" overflow="hidden" py={{ base: 20, md: 32 }}>
        {/* Background effects */}
        <Box
          position="absolute"
          top="-200px"
          left="-200px"
          w="600px"
          h="600px"
          bg="radial-gradient(circle, rgba(0,128,230,0.15), transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-200px"
          right="-200px"
          w="500px"
          h="500px"
          bg="radial-gradient(circle, rgba(0,198,255,0.1), transparent 70%)"
          pointerEvents="none"
        />

        <Container maxW="1200px" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                colorScheme="cyan"
                borderRadius="full"
                px={4}
                py={1}
                fontSize="sm"
                mb={4}
              >
                🚀 Conectando Talento e Oportunidade
              </Badge>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Heading
                fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                fontWeight="900"
                lineHeight="1.1"
                maxW="800px"
              >
                Transforme{' '}
                <Text
                  as="span"
                  bgGradient="linear(to-r, #00c6ff, #0080e6)"
                  bgClip="text"
                >
                  habilidades
                </Text>{' '}
                em{' '}
                <Text
                  as="span"
                  bgGradient="linear(to-r, #ff944d, #e65c00)"
                  bgClip="text"
                >
                  resultados reais
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.400" maxW="600px">
                Marketplace que conecta estudantes de TI a projetos reais de micro e pequenas empresas.
                Experiência prática + impacto real.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  as={Link}
                  to="/login"
                  size="lg"
                  variant="brand"
                  rightIcon={<HiArrowRight />}
                  px={8}
                >
                  Começar Agora
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  size="lg"
                  variant="glass"
                  px={8}
                >
                  Sou Empresa
                </Button>
              </HStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats */}
      <Box py={12}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                textAlign="center"
              >
                <Text
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="800"
                  bgGradient="linear(to-r, #00c6ff, #0080e6)"
                  bgClip="text"
                >
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.500">{stat.label}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Como Funciona */}
      <Box py={20} position="relative">
        <Container maxW="1200px">
          <VStack spacing={16}>
            <VStack spacing={3} textAlign="center">
              <Badge colorScheme="purple" borderRadius="full" px={3} fontSize="xs">
                COMO FUNCIONA
              </Badge>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800">
                Simples como 1, 2, 3
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="100%">
              {steps.map((step, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <VStack
                    bg="rgba(26, 32, 44, 0.5)"
                    border="1px solid rgba(255,255,255,0.06)"
                    borderRadius="2xl"
                    p={8}
                    spacing={4}
                    align="center"
                    textAlign="center"
                    h="100%"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateY(-4px)',
                      borderColor: `${step.color}33`,
                      boxShadow: `0 8px 30px ${step.color}15`,
                    }}
                  >
                    <Flex
                      w="60px"
                      h="60px"
                      borderRadius="xl"
                      bg={`${step.color}15`}
                      color={step.color}
                      align="center"
                      justify="center"
                    >
                      {step.icon}
                    </Flex>
                    <Text fontWeight="700" fontSize="lg">{step.title}</Text>
                    <Text fontSize="sm" color="gray.400">{step.desc}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Benefícios */}
      <Box py={20}>
        <Container maxW="1200px">
          <VStack spacing={16}>
            <VStack spacing={3} textAlign="center">
              <Badge colorScheme="green" borderRadius="full" px={3} fontSize="xs">
                POR QUE SKILLMATCH?
              </Badge>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800">
                Benefícios para todos
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="100%">
              {benefits.map((b, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <HStack
                    bg="rgba(26, 32, 44, 0.5)"
                    border="1px solid rgba(255,255,255,0.06)"
                    borderRadius="2xl"
                    p={6}
                    spacing={4}
                    align="start"
                    transition="all 0.3s ease"
                    _hover={{
                      borderColor: `${b.color}33`,
                    }}
                  >
                    <Flex
                      minW="48px"
                      h="48px"
                      borderRadius="lg"
                      bg={`${b.color}15`}
                      color={b.color}
                      align="center"
                      justify="center"
                    >
                      {b.icon}
                    </Flex>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="700" fontSize="md">{b.title}</Text>
                      <Text fontSize="sm" color="gray.400">{b.desc}</Text>
                    </VStack>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box py={20}>
        <Container maxW="800px">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <VStack
              bg="linear-gradient(135deg, rgba(0,128,230,0.15), rgba(0,198,255,0.05))"
              border="1px solid rgba(0,198,255,0.2)"
              borderRadius="3xl"
              p={{ base: 8, md: 12 }}
              spacing={6}
              textAlign="center"
            >
              <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800">
                Pronto para transformar sua carreira?
              </Heading>
              <Text color="gray.400" maxW="500px">
                Junte-se a centenas de alunos que já estão construindo portfólios com projetos reais.
              </Text>
              <Button
                as={Link}
                to="/login"
                variant="brand"
                size="lg"
                rightIcon={<HiArrowRight />}
                px={10}
              >
                Criar Conta Grátis
              </Button>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
