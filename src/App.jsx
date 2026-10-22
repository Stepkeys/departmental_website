import { useEffect, useState } from 'react';
import Navbar from './component/Navbar.jsx';
import { loadContent, saveContent } from './data/contentRepository.js';
import './App.css';
const routePaths = ['/', '/staff-exco', '/people', '/project', '/events', '/more-info', '/admin'];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function Eyebrow({ children }) {
  return <p className="eyebrow"><span className="eyebrow-dot" />{children}</p>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="brand footer-brand" href="/" onClick={(event) => onNavigate(event, '/')}>
          <img className="brand-logo" src="/nadss-logo.png" alt="" />
          <span className="brand-copy"><strong>NADSS</strong><small>Nigeria Association of Data Science Students @ OSUN STATE UNIVERSITY</small></span>
        </a>
        <p>Curious minds. Practical ideas.<br />A better future, built together.</p>
        <div className="footer-links">
          <a href="/staff-exco" onClick={(event) => onNavigate(event, '/staff-exco')}>Staff & Exco</a>
          <a href="/project" onClick={(event) => onNavigate(event, '/project')}>Projects</a>
          <a href="/events" onClick={(event) => onNavigate(event, '/events')}>Events</a>
          <a href="/more-info" onClick={(event) => onNavigate(event, '/more-info')}>Get in touch</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nigeria Association of Data Science Students @ OSUN STATE UNIVERSITY</span>
        <span>Made for the next big idea.</span>
      </div>
    </footer>
  );
}

function HomePage({ content, onNavigate }) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <Eyebrow>A place to make what matters</Eyebrow>
            <h1>Technology is better<br />when <span>we build it together.</span></h1>
            <p className="hero-description">A home for curious minds, big questions, and ideas that make a difference. Come see what we’re working on.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/project" onClick={(event) => onNavigate(event, '/project')}>Explore our projects <Arrow /></a>
              <a className="text-link" href="/staff-exco" onClick={(event) => onNavigate(event, '/staff-exco')}>Meet the people <Arrow /></a>
            </div>
            <div className="hero-note"><span className="avatar-stack"><i>J</i><i>A</i><i>M</i></span><span>Built by people who care<br /><strong>Students, staff & collaborators</strong></span></div>
          </div>
          <div className="hero-art" role="img" aria-label="Students collaborating around a computer">
            <div className="art-note art-note-top"><span className="note-spark">✳</span><span>Curiosity<br />looks good on you.</span></div>
            <div className="art-caption"><span className="caption-line" /> Room to think. Space to make.</div>
            <div className="art-stamp">IDEAS<br />IN<br />MOTION</div>
          </div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="hero-bottom-line" /><span>01 — 06</span></div>
        </section>

        <section className="welcome-strip">
          <div className="welcome-label"><span className="welcome-icon">✳</span><span>A NOTE FROM<br />OUR HOD</span></div>
          <p>“The most exciting thing about technology isn’t the technology. It’s what people like you choose to do with it.”</p>
          <div className="hod-signature"><strong>Dr. Jordan Adeyemi</strong><span>Head of Department</span></div>
        </section>

        <section className="content-section news-section">
          <SectionHeading eyebrow="Fresh from the department" title="A little news, a lot to look forward to." action={<a className="text-link" href="/events" onClick={(event) => onNavigate(event, '/events')}>All announcements <Arrow /></a>} />
          <div className="news-grid">
            {content.news.slice(0, 3).map((item, index) => (
              <article className={`news-card news-card-${index + 1}`} key={item.id}>
                <div className="news-meta"><span>{item.category}</span><span>{item.date}</span></div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <a className="card-link" href="/events" onClick={(event) => onNavigate(event, '/events')} aria-label={`Read ${item.title}`}>Read the story <Arrow /></a>
              </article>
            ))}
            {content.news.length === 0 && <p className="empty-state">There’s no news to share just yet. Check back soon.</p>}
          </div>
        </section>

        <section className="content-section projects-section">
          <SectionHeading eyebrow="Made around here" title="Small teams. Big what-ifs." description="A few things our community has been dreaming up, designing, and bringing to life." action={<a className="text-link" href="/project" onClick={(event) => onNavigate(event, '/project')}>See all projects <Arrow /></a>} />
          <ProjectGrid projects={content.projects.slice(0, 3)} />
        </section>

        <section className="home-cta">
          <span className="cta-star">✳</span>
          <div><Eyebrow>Your next chapter</Eyebrow><h2>There’s room for your idea here.</h2><p>Meet the people, find an event, or just come say hello.</p></div>
          <a className="button button-light" href="/more-info" onClick={(event) => onNavigate(event, '/more-info')}>Find your way in <Arrow /></a>
        </section>
      </main>
    </>
  );
}

function ProjectGrid({ projects }) {
  if (!projects.length) {
    return (
      <div className="empty-state empty-state-with-action">
        <p>No projects have been added yet. Check back soon.</p>
        <a className="text-link" href="/admin">Add a project in admin <Arrow /></a>
      </div>
    );
  }
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.id}>
          <div className={`project-visual ${project.color || 'lavender'}`}><span className="project-initials">{project.initials || 'P'}</span><span className="project-visual-mark">✳</span><span className="project-open"><Arrow diagonal /></span></div>
          <div className="project-card-content"><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><span className="project-team">{project.team || 'Student project'}</span></div>
        </article>
      ))}
    </div>
  );
}

function StaffExcoPage({ staff, executives }) {
  return (
    <main className="page-main">
      <PageIntro eyebrow="The people behind the possibilities" title={<>Good work starts<br />with <span>good people.</span></>} description="Meet the staff who guide us, the student executives who bring us together, and the community we’re building." />
      <section className="content-section directory-section">
        <SectionHeading eyebrow="Here to help you grow" title="Our staff" description="Teachers, mentors, researchers, and the people who keep everything moving." />
        <div className="people-grid">{staff.map((person) => <PersonCard key={person.name} person={person} />)}</div>
      </section>
      <section className="content-section exec-section">
        <SectionHeading eyebrow="Student-powered" title="Your student executives" description="Your voice, your ideas, your people. Say hello to this year’s student leadership team." />
        <div className="people-grid exec-grid">{executives.map((person) => <PersonCard key={person.name} person={person} executive />)}</div>
      </section>
      <section className="people-note"><span>✳</span><p>Looking for a supervisor, a collaborator, or just a friendly face? <a href="/more-info">We’d love to help you find the right person.</a></p></section>
    </main>
  );
}

function PersonCard({ person, executive = false }) {
  return (
    <article className="person-card">
      <div className={`person-photo ${person.color}`}><span>{person.initials}</span><span className="person-photo-symbol" aria-hidden="true">✳</span></div>
      <div className="person-details"><h3>{person.name}</h3><p>{person.role}</p>{!executive && <span className="person-focus">{person.focus}</span>}</div>
      <span className="person-arrow" aria-hidden="true">↗</span>
    </article>
  );
}

function ProjectsPage({ projects }) {
  return (
    <main className="page-main">
      <PageIntro eyebrow="A work in progress (in the best way)" title={<>From “what if?”<br />to <span>“we did that.”</span></>} description="Meet the student teams turning thoughtful questions into useful, surprising, and sometimes world-changing projects." />
      <section className="content-section directory-section">
        <SectionHeading eyebrow={`${projects.length} ideas and counting`} title="The project shelf" description="Each project starts with a question. Every one of them is better with a team." />
        <ProjectGrid projects={projects} />
      </section>
      <section className="home-cta project-cta"><span className="cta-star">✳</span><div><Eyebrow>Have a what-if?</Eyebrow><h2>Bring the half-formed idea.</h2><p>We’ll help you find the people and tools to make it real.</p></div><a className="button button-light" href="/more-info">Start a conversation <Arrow /></a></section>
    </main>
  );
}

function EventsPage({ events }) {
  return (
    <main className="page-main">
      <PageIntro eyebrow="Put it in your calendar" title={<>Good things happen<br /><span>when we show up.</span></>} description="Workshops, conversations, deadlines, and the occasional excuse to eat together. Here’s what’s coming up." />
      <section className="content-section directory-section">
        <SectionHeading eyebrow="The department noticeboard" title="Coming up" description="Make a little room in your week. There’s something for everyone." />
        <div className="event-list">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div>
              <div className="event-details"><span className="event-category">{event.category}</span><h3>{event.title}</h3><p>{event.time}<span>·</span>{event.location}</p></div>
              <a className="event-arrow" href="/more-info" aria-label={`Ask about ${event.title}`}><Arrow diagonal /></a>
            </article>
          ))}
          {events.length === 0 && <div className="empty-state empty-state-with-action"><p>No events have been announced yet. Check back soon.</p><a className="text-link" href="/admin">Add an event in admin <Arrow /></a></div>}
        </div>
      </section>
      <section className="notice-panel"><span className="notice-icon">✳</span><div><h2>Have an announcement to share?</h2><p>Department members can send event and news submissions to the department office.</p></div><a className="text-link" href="/more-info">Get in touch <Arrow /></a></section>
    </main>
  );
}

function MoreInfoPage() {
  return (
    <main className="page-main">
      <PageIntro eyebrow="The practical bits" title={<>Everything you need<br />to <span>feel at home.</span></>} description="Your go-to place for finding the department, getting support, and taking that next step." />
      <section className="content-section directory-section info-section">
        <SectionHeading eyebrow="Find your way around" title="A few useful things" description="Start here for the details that make your department experience a little easier." />
        <div className="info-grid">
          <article className="info-card"><span className="info-icon">⌖</span><span className="info-index">01 / FIND US</span><h3>Come on in.</h3><p>Department of Technology<br />Faculty Building, Block B<br />Main Campus</p><a href="mailto:department@university.edu">Get directions <Arrow diagonal /></a></article>
          <article className="info-card"><span className="info-icon">✉</span><span className="info-index">02 / SAY HELLO</span><h3>Talk to a human.</h3><p>Questions about a course, a project, or where to start? We’re happy to point you in the right direction.</p><a href="mailto:department@university.edu">department@university.edu <Arrow diagonal /></a></article>
          <article className="info-card"><span className="info-icon">↗</span><span className="info-index">03 / STUDENT SUPPORT</span><h3>You don’t have to figure it out alone.</h3><p>For academic guidance, wellbeing support, and help finding the right person to talk to.</p><a href="/staff-exco">Meet the team <Arrow diagonal /></a></article>
          <article className="info-card"><span className="info-icon">▤</span><span className="info-index">04 / RESOURCES</span><h3>Good to know.</h3><p>Explore the department, discover student projects, and find your next opportunity to get involved.</p><a href="/project">Browse projects <Arrow diagonal /></a></article>
        </div>
      </section>
      <section className="contact-band"><div><Eyebrow>Can’t find what you need?</Eyebrow><h2>That’s what we’re here for.</h2></div><a className="button button-primary" href="mailto:department@university.edu">Email the department <Arrow diagonal /></a></section>
    </main>
  );
}

function PageIntro({ eyebrow, title, description }) {
  return <header className="page-intro"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div><span className="page-intro-star" aria-hidden="true">✳</span></header>;
}

function AdminPage({ content, setContent }) {
  const [kind, setKind] = useState('news');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const entries = content[kind];
  const isPerson = kind === 'staff' || kind === 'executives';
  const itemLabel = kind === 'news' ? 'a news update' : kind === 'projects' ? 'a project' : kind === 'events' ? 'an event' : kind === 'staff' ? 'a staff member' : 'a student executive';

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || (!isPerson && !description.trim()) || (isPerson && !category.trim())) {
      setNotice(isPerson ? 'Add a name and role before saving.' : 'Add a title and description before publishing.');
      return;
    }
    const id = editingId || `${kind}-${Date.now()}`;
    const existingItem = entries.find((item) => item.id === editingId);
    const newItem = isPerson
      ? { id, name: title.trim(), role: category.trim(), initials: title.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), color: ['lavender', 'mint', 'peach', 'yellow'][entries.length % 4], ...(kind === 'staff' ? { focus: description.trim() } : {}) }
      : kind === 'events'
        ? { id, day: existingItem?.day || new Date().getDate().toString().padStart(2, '0'), month: existingItem?.month || new Date().toLocaleString('en', { month: 'short' }).toUpperCase(), category: category.trim() || 'Department event', title: title.trim(), time: existingItem?.time || 'Time to be announced', location: description.trim() }
        : kind === 'projects'
          ? { id, category: category.trim() || 'Student project', title: title.trim(), description: description.trim(), initials: title.trim().slice(0, 2).toUpperCase(), color: existingItem?.color || ['lavender', 'mint', 'peach'][content.projects.length % 3], team: existingItem?.team || 'Department community' }
          : { id, category: category.trim() || 'Department news', date: new Date().toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }), title: title.trim(), excerpt: description.trim() };
    const wasEditing = Boolean(editingId);
    setContent((current) => ({
      ...current,
      [kind]: wasEditing
        ? current[kind].map((item) => item.id === editingId ? { ...item, ...newItem } : item)
        : [newItem, ...current[kind]],
    }));
    setTitle('');
    setDescription('');
    setCategory('');
    setEditingId(null);
    setNotice(wasEditing ? 'Your changes have been saved in this browser.' : isPerson ? 'The directory has been updated in this browser.' : 'Your update has been saved in this browser.');
  }

  function editItem(item) {
    setEditingId(item.id);
    setTitle(item.name || item.title);
    setCategory(item.role || item.category || '');
    setDescription(item.focus || item.location || item.excerpt || item.description || '');
    setNotice('');
  }

  function removeItem(id) {
    setContent((current) => ({ ...current, [kind]: current[kind].filter((item) => item.id !== id) }));
    if (editingId === id) {
      setEditingId(null);
      setTitle('');
      setCategory('');
      setDescription('');
    }
    setNotice('The item has been removed.');
  }

  return (
    <main className="page-main admin-page">
      <PageIntro eyebrow="Frontend demo · database integration ready" title={<>Keep the good<br /><span>things moving.</span></>} description="Manage department news, projects, events, staff, and student executives." />
      <section className="admin-panel">
        <div className="admin-notice"><span>ⓘ</span><p><strong>Frontend demo only:</strong> Updates are saved in this browser and are not shared with other users. The content repository is isolated in <code>src/data/contentRepository.js</code>, ready to connect to the database when the backend is available.</p></div>
        <div className="admin-toolbar"><div><Eyebrow>Content studio</Eyebrow><h2>Manage your content</h2></div><div className="admin-tabs" role="tablist" aria-label="Content type">{[['news', 'News'], ['projects', 'Projects'], ['events', 'Events'], ['staff', 'Staff'], ['executives', 'Excos']].map(([value, label]) => <button type="button" role="tab" aria-selected={kind === value} className={kind === value ? 'admin-tab active' : 'admin-tab'} onClick={() => { setKind(value); setNotice(''); }} key={value}>{label}<span>{content[value].length}</span></button>)}</div></div>
        <div className="admin-layout">
          <form className="admin-form" onSubmit={handleSubmit}>
            <span className="admin-form-label">{editingId ? 'EDIT' : 'CREATE'} {itemLabel.toUpperCase()}</span>
            <label htmlFor="content-title">{isPerson ? 'Name' : 'Title'}</label><input id="content-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={isPerson ? 'Add their name' : 'Give it a good name'} maxLength={90} required />
            <label htmlFor="content-category">{isPerson ? 'Role' : 'Category'}{kind !== 'staff' && kind !== 'executives' && <span> (optional)</span>}</label><input id="content-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder={isPerson ? 'e.g. Lecturer or President' : kind === 'events' ? 'e.g. Workshop' : 'e.g. Department news'} maxLength={40} required={isPerson} />
            <label htmlFor="content-description">{kind === 'events' ? 'Location' : kind === 'staff' ? 'Focus area' : kind === 'executives' ? 'Short bio' : 'Description'}{isPerson && <span> (optional)</span>}</label><textarea id="content-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={kind === 'events' ? 'Where will it happen?' : isPerson ? 'Add a little more information' : 'What should people know?'} rows="4" maxLength={240} required={!isPerson} />
            <div className="admin-form-actions"><button className="button button-primary admin-submit" type="submit">{editingId ? 'Save changes' : isPerson ? 'Add to directory' : 'Publish update'} <Arrow /></button>{editingId && <button className="cancel-edit" type="button" onClick={() => { setEditingId(null); setTitle(''); setCategory(''); setDescription(''); setNotice(''); }}>Cancel</button>}</div>
            {notice && <p className="admin-feedback" role="status">{notice}</p>}
          </form>
          <div className="admin-items"><div className="admin-items-heading"><span>EXISTING {kind.toUpperCase()}</span><span>{entries.length} ITEMS</span></div>{entries.length ? entries.map((item) => <article className="admin-item" key={item.id}><div><span>{item.role || item.category}</span><h3>{item.name || item.title}</h3></div><div className="admin-item-actions"><button type="button" className="edit-button" onClick={() => editItem(item)} aria-label={`Edit ${item.name || item.title}`}>Edit</button><button type="button" className="remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name || item.title}`}>Remove</button></div></article>) : <p className="empty-state admin-empty">No {kind} yet. Create your first update.</p>}</div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [content, setContent] = useState(loadContent);
  const currentPath = routePaths.includes(path) ? path : '/';

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    saveContent(content);
  }, [content]);

  useEffect(() => {
    const titles = {
      '/': 'NADSS | Nigeria Association of Data Science Students @ OSUN STATE UNIVERSITY',
      '/staff-exco': 'Staff & Exco | NADSS',
      '/people': 'Staff & Exco | NADSS',
      '/project': 'Projects | NADSS',
      '/events': 'Events | NADSS',
      '/more-info': 'More information | NADSS',
      '/admin': 'Content studio | NADSS',
    };
    document.title = titles[currentPath];
  }, [currentPath]);

  function navigate(event, destination) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (destination !== window.location.pathname) {
      window.history.pushState({}, '', destination);
      setPath(destination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  let page;
  switch (currentPath) {
    case '/staff-exco':
    case '/people': page = <StaffExcoPage staff={content.staff} executives={content.executives} />; break;
    case '/project': page = <ProjectsPage projects={content.projects} />; break;
    case '/events': page = <EventsPage events={content.events} />; break;
    case '/more-info': page = <MoreInfoPage />; break;
    case '/admin': page = <AdminPage content={content} setContent={setContent} />; break;
    default: page = <HomePage content={content} onNavigate={navigate} />;
  }

  function handleInternalLink(event) {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href^="/"]');
    if (anchor) navigate(event, anchor.pathname);
  }

  return <div className="site-shell" onClick={handleInternalLink}><Navbar activePath={currentPath} onNavigate={navigate} />{page}<Footer onNavigate={navigate} /></div>;
}
