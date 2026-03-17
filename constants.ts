import { HistoricalHackathon } from './types';

export const MOCK_HISTORICAL_DATA: HistoricalHackathon[] = [
  {
    id: '1',
    name: 'Global Tech Jam',
    year: 2024,
    winner: 'EcoTrack',
    theme: 'Sustainability',
    projectDescription:
      'Real-time carbon footprint tracking using IoT sensors and machine learning to help individuals offset their daily emissions.',
    techStack: ['React', 'Python', 'TensorFlow', 'MQTT', 'Firebase'],
  },
  {
    id: '2',
    name: 'FinTech Future 2023',
    year: 2023,
    winner: 'ChainSecure',
    theme: 'Blockchain',
    projectDescription:
      'A decentralized identity management system for secure, passwordless banking transactions using zero-knowledge proofs.',
    techStack: ['Solidity', 'Next.js', 'Ethereum', 'Web3.js', 'IPFS'],
  },
  {
    id: '3',
    name: 'HackHealth 2024',
    year: 2024,
    winner: 'VitalPulse',
    theme: 'Healthcare',
    projectDescription:
      'Remote patient monitoring system with predictive diagnostics for early cardiac event detection using wearable data.',
    techStack: ['React Native', 'Node.js', 'TensorFlow', 'Firebase', 'HL7 FHIR'],
  },
  {
    id: '4',
    name: 'EduTech Innovate 2022',
    year: 2022,
    winner: 'LearnLoop',
    theme: 'Education',
    projectDescription:
      'Gamified adaptive learning platform for neurodivergent students using spaced repetition and visual progress tracking.',
    techStack: ['Unity', 'C#', 'PostgreSQL', 'Python', 'AWS'],
  },
  {
    id: '5',
    name: 'ClimateHack 2023',
    year: 2023,
    winner: 'FloodGuard',
    theme: 'Climate',
    projectDescription:
      'AI-powered flood prediction system for municipal authorities using satellite imagery and weather pattern analysis.',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Google Maps API'],
  },
  {
    id: '6',
    name: 'SmartCity Sprint',
    year: 2024,
    winner: 'ParkIQ',
    theme: 'Smart Cities',
    projectDescription:
      'Real-time parking availability prediction using computer vision on existing CCTV infrastructure, no new hardware needed.',
    techStack: ['Python', 'OpenCV', 'YOLO', 'React', 'Redis', 'WebSockets'],
  },
];
