const initialNews = [
  {
    id: 'news-1',
    category: 'Department news',
    date: 'October 18, 2026',
    title: 'A new semester of ideas starts here',
    excerpt: 'Welcome back. Find your people, explore what we are building, and make this semester count.',
  },
  {
    id: 'news-2',
    category: 'Opportunity',
    date: 'October 12, 2026',
    title: 'Student innovation showcase: submissions are open',
    excerpt: 'Turn that side project into a story worth sharing. Applications close November 8.',
  },
  {
    id: 'news-3',
    category: 'Research',
    date: 'October 5, 2026',
    title: 'The lab making technology work for everyone',
    excerpt: 'Meet the students and staff exploring more accessible, human-centered digital tools.',
  },
];

const initialStaff = [
  { id: 'staff-1', name: 'Dr. Jordan Adeyemi', role: 'Head of Department', initials: 'JA', color: 'lavender', focus: 'Human-centered computing' },
  { id: 'staff-2', name: 'Prof. Amara Okafor', role: 'Professor', initials: 'AO', color: 'peach', focus: 'Intelligent systems' },
  { id: 'staff-3', name: 'Dr. Tunde Bello', role: 'Senior Lecturer', initials: 'TB', color: 'mint', focus: 'Networks & security' },
  { id: 'staff-4', name: 'Dr. Nia Mensah', role: 'Lecturer', initials: 'NM', color: 'yellow', focus: 'Software engineering' },
  { id: 'staff-5', name: 'Engr. David Obi', role: 'Lab Coordinator', initials: 'DO', color: 'mint', focus: 'Embedded systems' },
  { id: 'staff-6', name: 'Ms. Zara Yusuf', role: 'Department Administrator', initials: 'ZY', color: 'peach', focus: 'Student support' },
];

const initialExecutives = [
  { id: 'executive-1', name: 'Chidi Eze', role: 'President', initials: 'CE', color: 'lavender' },
  { id: 'executive-2', name: 'Maya Danjuma', role: 'Vice President', initials: 'MD', color: 'peach' },
  { id: 'executive-3', name: 'Femi Adebayo', role: 'General Secretary', initials: 'FA', color: 'mint' },
  { id: 'executive-4', name: 'Lola James', role: 'Welfare Director', initials: 'LJ', color: 'yellow' },
];

const defaultContent = {
  news: initialNews,
  projects: [],
  events: [],
  staff: initialStaff,
  executives: initialExecutives,
};
const storageKey = 'nexus-department-content';
const sampleProjectIds = new Set(['project-1', 'project-2', 'project-3']);
const sampleEventIds = new Set(['event-1', 'event-2', 'event-3']);

function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return window.localStorage;
}

// Replace this browser-storage adapter with database calls when the backend is ready.
export function loadContent() {
  const storage = getStorage();
  if (!storage) return defaultContent;

  try {
    const saved = JSON.parse(storage.getItem(storageKey));
    if (!saved || typeof saved !== 'object') return defaultContent;
    return {
      news: Array.isArray(saved.news) ? saved.news : initialNews,
      projects: Array.isArray(saved.projects) ? saved.projects.filter((item) => !sampleProjectIds.has(item?.id)) : [],
      events: Array.isArray(saved.events) ? saved.events.filter((item) => !sampleEventIds.has(item?.id)) : [],
      staff: Array.isArray(saved.staff) ? saved.staff : initialStaff,
      executives: Array.isArray(saved.executives) ? saved.executives : initialExecutives,
    };
  } catch {
    return defaultContent;
  }
}

export function saveContent(content) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(storageKey, JSON.stringify(content));
  } catch {
    // Ignore storage failures so the app remains usable when the browser blocks writes.
  }
}
