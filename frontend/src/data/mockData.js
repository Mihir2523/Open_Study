export const mockUser = {
  id: '1',
  username: 'testuser',
  karma: 1247,
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
  cakeDay: new Date('2023-03-15')
};

export const mockCommunities = [
  {
    id: 'programming',
    name: 'programming',
    displayName: 'Programming',
    members: 2400000,
    description: 'Computer Programming',
    icon: '💻'
  },
  {
    id: 'webdev',
    name: 'webdev',
    displayName: 'Web Development',
    members: 890000,
    description: 'A community for web developers',
    icon: '🌐'
  },
  {
    id: 'technology',
    name: 'technology',
    displayName: 'Technology',
    members: 14200000,
    description: 'Subreddit for technology news and discussion',
    icon: '🔧'
  },
  {
    id: 'javascript',
    name: 'javascript',
    displayName: 'JavaScript',
    members: 2100000,
    description: 'The JavaScript programming language',
    icon: '⚡'
  },
  {
    id: 'react',
    name: 'react',
    displayName: 'React',
    members: 580000,
    description: 'A JavaScript library for building user interfaces',
    icon: '⚛️'
  }
];

export const mockPosts = [
  {
    id: '1',
    title: 'Just finished my first full-stack application! Any feedback?',
    content: 'After months of learning, I finally built a complete web application with React frontend and Node.js backend. It\'s a task management app with user authentication, real-time updates, and a clean UI. Would love to get some feedback from the community!',
    author: 'newdeveloper',
    community: 'webdev',
    score: 342,
    created: new Date('2025-01-08T10:30:00'),
    userVote: null,
    comments: [
      {
        id: 'c1',
        content: 'Looks great! The UI is really clean. Have you considered adding dark mode?',
        author: 'uiexpert',
        score: 23,
        created: new Date('2025-01-08T11:15:00'),
        parentId: null,
        userVote: null
      },
      {
        id: 'c2',
        content: 'Thanks! Dark mode is definitely on my roadmap.',
        author: 'newdeveloper',
        score: 8,
        created: new Date('2025-01-08T11:45:00'),
        parentId: 'c1',
        userVote: null
      }
    ]
  },
  {
    id: '2',
    title: 'What are the best practices for React performance optimization in 2025?',
    content: 'I\'ve been working on a large React application and starting to notice some performance issues. What are the current best practices for optimizing React apps? I\'m particularly interested in code splitting, memoization strategies, and bundle optimization.',
    author: 'reactdev',
    community: 'react',
    score: 156,
    created: new Date('2025-01-08T09:15:00'),
    userVote: 'up',
    comments: [
      {
        id: 'c3',
        content: 'React.memo and useMemo are your best friends for preventing unnecessary re-renders.',
        author: 'performanceguru',
        score: 45,
        created: new Date('2025-01-08T09:45:00'),
        parentId: null,
        userVote: null
      }
    ]
  },
  {
    id: '3',
    title: 'The future of JavaScript: What to expect in ES2025',
    content: 'JavaScript continues to evolve rapidly. Here are some exciting features coming in ES2025 including pattern matching, records and tuples, and improved async capabilities. The language is becoming more powerful while maintaining its accessibility.',
    author: 'jsgeek',
    community: 'javascript',
    score: 89,
    created: new Date('2025-01-08T08:00:00'),
    userVote: null,
    comments: []
  },
  {
    id: '4',
    title: 'AI is revolutionizing software development, but are we losing something?',
    content: 'While AI tools like Copilot and ChatGPT have made coding more efficient, I sometimes worry we\'re losing the deep understanding that comes from struggling through problems. What are your thoughts on balancing AI assistance with traditional learning?',
    author: 'thoughtfuldev',
    community: 'programming',
    score: 234,
    created: new Date('2025-01-07T16:20:00'),
    userVote: null,
    comments: [
      {
        id: 'c4',
        content: 'I think AI is a tool like any other. The key is knowing when to use it and when to figure things out yourself.',
        author: 'balancedcoder',
        score: 67,
        created: new Date('2025-01-07T17:00:00'),
        parentId: null,
        userVote: null
      }
    ]
  },
  {
    id: '5',
    title: 'New breakthrough in quantum computing could change everything',
    content: 'Researchers have achieved a new milestone in quantum error correction, bringing us closer to practical quantum computers. This could revolutionize cryptography, drug discovery, and complex optimization problems.',
    author: 'quantumfan',
    community: 'technology',
    score: 567,
    created: new Date('2025-01-07T14:30:00'),
    userVote: 'up',
    comments: []
  }
];