import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiUser, HiArrowRight } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import TeamBadge from './TeamBadge';

export default function ProjectCard({ projeto }) {
  const { getEmpresa, usuario } = useApp();
  const navigate = useNavigate();
  const empresa = getEmpresa(projeto.empresa_id);

  const statusColors = {
    aberto: 'green',
    em_andamento: 'yellow',
    concluido: 'blue',
  };

  const statusLabels = {
    aberto: 'Aberto',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
  };

  const vagasRestantes = projeto.vagas - projeto.time.length;

  return (
    <Box
      bg="rgba(26, 32, 44, 0.5)"
      border="1px solid rgba(255, 255, 255, 0.06)"
      borderRadius="2xl"
      p={6}
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 128, 230, 0.15)',
        borderColor: 'rgba(0, 198, 255, 0.3)',
      }}
      onClick={() => navigate(`/projeto/${projeto.id}`)}
      position="relative"
      overflow="hidden"
    >
      {/* Glow accent */}
      <Box
        position="absolute"
        top="-50%"
        right="-50%"
        w="200px"
        h="200px"
        bg="radial-gradient(circle, rgba(0,198,255,0.05), transparent)"
        pointerEvents="none"
      />

      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2}>
              <Badge
                colorScheme={statusColors[projeto.status]}
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="xs"
              >
                {statusLabels[projeto.status]}
              </Badge>
              <TeamBadge vagas={projeto.vagas} />
            </HStack>
            <Text fontSize="lg" fontWeight="700" color="white" noOfLines={2}>
              {projeto.titulo}
            </Text>
          </VStack>
          <Text fontSize="2xl">{empresa?.avatar}</Text>
        </Flex>

        {/* Empresa */}
        <Text fontSize="sm" color="gray.400">
          {empresa?.avatar} {empresa?.nome} • {empresa?.cidade}
        </Text>

        {/* Descrição */}
        <Text fontSize="sm" color="gray.300" noOfLines={2}>
          {projeto.descricao}
        </Text>

        {/* Tags */}
        <HStack spacing={2} flexWrap="wrap">
          {projeto.tecnologias.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              bg="rgba(0, 198, 255, 0.1)"
              color="cyan.300"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
              fontWeight="500"
            >
              {tech}
            </Badge>
          ))}
        </HStack>

        {/* Footer */}
        <Flex justify="space-between" align="center" pt={2} borderTop="1px solid rgba(255,255,255,0.04)">
          <HStack spacing={4}>
            <HStack spacing={1}>
              {projeto.vagas > 1 ? <HiUsers /> : <HiUser />}
              <Text fontSize="xs" color="gray.400">
                {vagasRestantes > 0 ? `${vagasRestantes} vaga${vagasRestantes > 1 ? 's' : ''}` : 'Completo'}
              </Text>
            </HStack>
            <Badge variant="outline" colorScheme="gray" fontSize="xs" borderRadius="full">
              {projeto.nivel_requerido}
            </Badge>
          </HStack>
          <Button
            size="xs"
            variant="ghost"
            color="cyan.400"
            rightIcon={<HiArrowRight />}
            _hover={{ color: 'cyan.300' }}
          >
            Ver mais
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
