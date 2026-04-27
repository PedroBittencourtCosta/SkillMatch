import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProjectFeed from './pages/ProjectFeed';
import ProjectDetail from './pages/ProjectDetail';
import ActiveProject from './pages/ActiveProject';
import Portfolio from './pages/Portfolio';
import CompanyDashboard from './pages/CompanyDashboard';
import ManageProject from './pages/ManageProject';
import FreelancerFeed from './pages/FreelancerFeed';
import FreelancerDetail from './pages/FreelancerDetail';
import CreateProject from './pages/CreateProject';
import Chat from './pages/Chat';

export default function App() {
  return (
    <Router>
      <Flex direction="column" minH="100vh">
        <Navbar />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projetos" element={<ProjectFeed />} />
            <Route path="/projeto/:id" element={<ProjectDetail />} />
            <Route path="/meu-projeto" element={<ActiveProject />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
            <Route path="/empresa/projeto/:id" element={<ManageProject />} />
            <Route path="/empresa/novo-projeto" element={<CreateProject />} />
            <Route path="/freelancers" element={<FreelancerFeed />} />
            <Route path="/freelancer/:id" element={<FreelancerDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:conversaId" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Footer />
      </Flex>
    </Router>
  );
}
