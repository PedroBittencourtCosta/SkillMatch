import { Box, Heading, Text, HStack, Badge, Flex, Icon } from '@chakra-ui/react';
import { HiUsers, HiCurrencyDollar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ projeto }) {
    const navigate = useNavigate();

    return (
        <Box
            bg="rgba(26, 32, 44, 0.4)"
            border="1px solid rgba(255,255,255,0.06)"
            borderRadius="xl"
            p={5}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-4px)', bg: 'rgba(26, 32, 44, 0.6)', borderColor: 'cyan.500/30' }}
            onClick={() => navigate(`/projeto/${projeto.id}`)}
        >
            <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="start">
                    <Badge colorScheme="cyan" variant="subtle" borderRadius="full" px={2}>
                        {projeto.categoria}
                    </Badge>

                    <HStack color="green.300" spacing={1}>
                        <Icon as={HiCurrencyDollar} />
                        <Text fontSize="xs" fontWeight="bold">
                            {(projeto.capital_disponivel ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </HStack>
                </Flex>

                <Heading fontSize="md" noOfLines={1}>{projeto.titulo}</Heading>
                <Text fontSize="sm" color="gray.400" noOfLines={2}>
                    {projeto.descricao}
                </Text>

                <HStack justify="space-between" pt={2}>
                    <HStack spacing={1} color="gray.500" fontSize="xs">
                        <HiUsers />
                        <Text>{projeto.time.length}/{projeto.vagas} vagas ocupadas</Text>
                    </HStack>
                    <Badge variant="outline" colorScheme="gray" fontSize="10px">
                        {projeto.nivel_requerido}
                    </Badge>
                </HStack>
            </VStack>
        </Box>
    );
}