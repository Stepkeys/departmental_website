import { useEffect, useRef, useState } from 'react';
import Navbar from './component/Navbar.jsx';
import { loadContent, saveContent } from './data/contentRepository.js';
import './App.css';
const adminPath = '/nadss-admin-2026';
const adminDashboardPath = `${adminPath}/dashboard`;
const routePaths = ['/', '/staff-exco', '/people', '/project', '/events', '/more-info', adminPath, adminDashboardPath];
const maxEventUploadSize = 1024 * 1024;
const maxMediaStorageSize = 2 * 1024 * 1024;
const eventImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

function readUpload(file, { allowPdf = false, label = 'image' } = {}) {
  if (!eventImageTypes.includes(file.type) && !(allowPdf && file.type === 'application/pdf')) {
    return Promise.reject(new Error(allowPdf ? 'Choose a JPG, PNG, WebP, or PDF flyer.' : `Choose a JPG, PNG, or WebP ${label}.`));
  }
  if (file.size > maxEventUploadSize) {
    return Promise.reject(new Error('Each event upload must be 1 MB or smaller.'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({ data: reader.result, name: file.name, type: file.type });
      } else {
        reject(new Error('The selected file could not be read.'));
      }
    };
    reader.onerror = () => reject(new Error('The selected file could not be read.'));
    reader.readAsDataURL(file);
  });
}

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

        <section className="content-section business-ads-section">
          <SectionHeading
            eyebrow="Business spotlight"
            title="Make your business global with us."
            description="Share what you do with a growing community of curious minds, creators, and future leaders."
          />
          {content.ads.length > 0 ? (
            <div className="business-ad-grid">
              {content.ads.map((ad) => (
                <article className="business-ad-card" key={ad.id}>
                  <div className="business-ad-image">
                    {ad.image ? <img src={ad.image} alt={`${ad.title} business`} /> : <span aria-hidden="true">✳</span>}
                    <span className="business-ad-badge">Featured business</span>
                  </div>
                  <div className="business-ad-content">
                    <span className="business-ad-category">{ad.category}</span>
                    <h3>{ad.title}</h3>
                    <p>{ad.description}</p>
                    <a href={ad.website} target="_blank" rel="noopener noreferrer">Visit {ad.title} <Arrow diagonal /></a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="business-ad-empty">
              <p>Your business could be featured here. Connect with us to reach the next generation of innovators.</p>
              <a className="button button-primary" href="/more-info" onClick={(event) => onNavigate(event, '/more-info')}>Let’s work together <Arrow /></a>
            </div>
          )}
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
      <div className="empty-state">
        <p>No projects have been added yet. Check back soon.</p>
      </div>
    );
  }
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.id}>
          <div className={`project-visual ${project.color || 'lavender'}`}>
            {project.image && <img className="project-image" src={project.image} alt={`Picture for ${project.title}`} />}
            {!project.image && <span className="project-initials">{project.initials || 'P'}</span>}
            <span className="project-visual-mark">✳</span><span className="project-open"><Arrow diagonal /></span>
          </div>
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
      <div className={`person-photo ${person.color}`}>
        {person.image ? <img className="person-image" src={person.image} alt={`Portrait of ${person.name}`} /> : <span>{person.initials}</span>}
        <span className="person-photo-symbol" aria-hidden="true">✳</span>
      </div>
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
              <div className={`event-image-slot${event.image ? '' : ' event-image-empty'}`}>
                {event.image ? <img className="event-image" src={event.image} alt={`Picture for ${event.title}`} /> : <span>Event image</span>}
              </div>
              <div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div>
              <div className="event-details">
                <span className="event-category">{event.category}</span><h3>{event.title}</h3><p>{event.time}<span>·</span>{event.location}</p>
                {event.flyer && <a className="event-flyer" href={event.flyer} download={event.flyerName || `${event.title}-flyer`}>View event flyer <Arrow diagonal /></a>}
              </div>
              <a className="event-arrow" href="/more-info" aria-label={`Ask about ${event.title}`}><Arrow diagonal /></a>
            </article>
          ))}
          {events.length === 0 && <div className="empty-state"><p>No events have been announced yet. Check back soon.</p></div>}
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

function AdminLoginPage({ onLogin }) {
  return (
    <main className="page-main admin-page">
      <PageIntro eyebrow="Administration" title={<>Welcome back<br /><span>to your workspace.</span></>} description="Sign in to manage department news, projects, events, business ads, staff, and student executives." />
      <section className="admin-login-panel">
        <div className="admin-notice"><span aria-hidden="true">ⓘ</span><p><strong>Temporary frontend sign-in:</strong> Backend authentication is not connected yet. Any non-empty email and password will open this local preview; this does not protect the dashboard.</p></div>
        <form className="admin-login-form" onSubmit={onLogin}>
          <div className="admin-login-heading"><Eyebrow>Admin area</Eyebrow><h2>Sign in</h2></div>
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@department.edu" required />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
          <button className="button button-primary admin-login-submit" type="submit">Continue to dashboard <Arrow /></button>
        </form>
      </section>
    </main>
  );
}

function AdminPage({ content, setContent, onLogout }) {
  const [kind, setKind] = useState('news');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [imageUpload, setImageUpload] = useState(undefined);
  const [flyerUpload, setFlyerUpload] = useState(undefined);
  const imageInputRef = useRef(null);
  const flyerInputRef = useRef(null);
  const entries = content[kind];
  const isPerson = kind === 'staff' || kind === 'executives';
  const isAd = kind === 'ads';
  const itemLabel = kind === 'news' ? 'a news update' : kind === 'projects' ? 'a project' : kind === 'events' ? 'an event' : isAd ? 'a business ad' : kind === 'staff' ? 'a staff member' : 'a student executive';

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || (!isPerson && !description.trim()) || (isPerson && !category.trim())) {
      setNotice(isPerson ? 'Add a name and role before saving.' : 'Add a title and description before publishing.');
      return;
    }
    let website = '';
    if (isAd) {
      try {
        const parsedWebsite = new URL(websiteUrl.trim());
        if (!['http:', 'https:'].includes(parsedWebsite.protocol)) throw new Error('Unsupported website protocol.');
        website = parsedWebsite.href;
      } catch {
        setNotice('Enter a valid business website beginning with https:// or http://.');
        return;
      }
    }
    const id = editingId || `${kind}-${Date.now()}`;
    const existingItem = entries.find((item) => item.id === editingId);
    const newItem = isPerson
      ? { id, name: title.trim(), role: category.trim(), initials: title.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), color: ['lavender', 'mint', 'peach', 'yellow'][entries.length % 4], ...(kind === 'staff' ? { focus: description.trim() } : {}) }
      : kind === 'events'
        ? { id, day: existingItem?.day || new Date().getDate().toString().padStart(2, '0'), month: existingItem?.month || new Date().toLocaleString('en', { month: 'short' }).toUpperCase(), category: category.trim() || 'Department event', title: title.trim(), time: existingItem?.time || 'Time to be announced', location: description.trim() }
        : kind === 'projects'
          ? { id, category: category.trim() || 'Student project', title: title.trim(), description: description.trim(), initials: title.trim().slice(0, 2).toUpperCase(), color: existingItem?.color || ['lavender', 'mint', 'peach'][content.projects.length % 3], team: existingItem?.team || 'Department community' }
          : isAd
            ? { id, category: category.trim() || 'Featured business', title: title.trim(), description: description.trim(), website }
            : { id, category: category.trim() || 'Department news', date: new Date().toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }), title: title.trim(), excerpt: description.trim() };
    if (kind === 'events') {
      const image = imageUpload === undefined ? existingItem?.image : imageUpload?.data;
      const flyer = flyerUpload === undefined ? existingItem?.flyer : flyerUpload?.data;
      newItem.image = image || null;
      newItem.imageName = image ? (imageUpload === undefined ? existingItem?.imageName : imageUpload.name) : null;
      newItem.imageType = image ? (imageUpload === undefined ? existingItem?.imageType : imageUpload.type) : null;
      newItem.flyer = flyer || null;
      newItem.flyerName = flyer ? (flyerUpload === undefined ? existingItem?.flyerName : flyerUpload.name) : null;
      newItem.flyerType = flyer ? (flyerUpload === undefined ? existingItem?.flyerType : flyerUpload.type) : null;
    }
    if (kind === 'projects' || isAd) {
      const image = imageUpload === undefined ? existingItem?.image : imageUpload?.data;
      newItem.image = image || null;
      newItem.imageName = image ? (imageUpload === undefined ? existingItem?.imageName : imageUpload.name) : null;
      newItem.imageType = image ? (imageUpload === undefined ? existingItem?.imageType : imageUpload.type) : null;
    }
    if (isPerson) {
      const image = imageUpload === undefined ? existingItem?.image : imageUpload?.data;
      newItem.image = image || null;
      newItem.imageName = image ? (imageUpload === undefined ? existingItem?.imageName : imageUpload.name) : null;
      newItem.imageType = image ? (imageUpload === undefined ? existingItem?.imageType : imageUpload.type) : null;
    }
    if (kind === 'events' || kind === 'projects' || isAd || isPerson) {
      const updatedItems = editingId
        ? entries.map((item) => item.id === editingId ? newItem : item)
        : [newItem, ...entries];
      const mediaContent = { ...content, [kind]: updatedItems };
      const mediaItems = [...mediaContent.events, ...mediaContent.projects, ...mediaContent.ads, ...mediaContent.staff, ...mediaContent.executives];
      const uploadSize = mediaItems.reduce((total, item) => total
        + Math.ceil((item.image?.length || 0) * 0.75)
        + Math.ceil((item.flyer?.length || 0) * 0.75), 0);
      if (uploadSize > maxMediaStorageSize) {
        setNotice('Event, project, business ad, staff, and exco images and flyers can use up to 2 MB combined in this browser. Remove an existing upload or choose smaller files.');
        return;
      }
    }
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
    setWebsiteUrl('');
    setEditingId(null);
    setImageUpload(undefined);
    setFlyerUpload(undefined);
    setNotice(wasEditing ? 'Your changes have been saved in this browser.' : isPerson ? 'The directory has been updated in this browser.' : 'Your update has been saved in this browser.');
  }

  function editItem(item) {
    setEditingId(item.id);
    setTitle(item.name || item.title);
    setCategory(item.role || item.category || '');
    setDescription(item.focus || item.location || item.excerpt || item.description || '');
    setWebsiteUrl(item.website || '');
    setImageUpload(item.image ? { data: item.image, name: item.imageName || (kind === 'events' ? 'Event picture' : isAd ? 'Business image' : 'Project image'), type: item.imageType || 'image/jpeg' } : null);
    setFlyerUpload(item.flyer ? { data: item.flyer, name: item.flyerName || 'Event flyer', type: item.flyerType || 'application/pdf' } : null);
    setNotice('');
  }

  async function handleImageUpload(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const label = kind === 'events' ? 'event picture' : kind === 'projects' ? 'project image' : isAd ? 'business image' : 'profile picture';
      setImageUpload(await readUpload(file, { label }));
      setNotice('');
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function handleFlyerUpload(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      setFlyerUpload(await readUpload(file, { allowPdf: true }));
      setNotice('');
    } catch (error) {
      setNotice(error.message);
    }
  }

  function removeItem(id) {
    setContent((current) => ({ ...current, [kind]: current[kind].filter((item) => item.id !== id) }));
    if (editingId === id) {
      setEditingId(null);
      setTitle('');
      setCategory('');
      setDescription('');
      setWebsiteUrl('');
      setImageUpload(undefined);
      setFlyerUpload(undefined);
    }
    setNotice('The item has been removed.');
  }

  return (
    <main className="page-main admin-page">
      <PageIntro eyebrow="Frontend demo · database integration ready" title={<>Keep the good<br /><span>things moving.</span></>} description="Manage department news, projects, events, business ads, staff, and student executives." />
      <section className="admin-panel">
        <div className="admin-notice"><span>ⓘ</span><p><strong>Frontend demo only:</strong> Updates are saved in this browser and are not shared with other users. The content repository is isolated in <code>src/data/contentRepository.js</code>, ready to connect to the database when the backend is available.</p></div>
        <div className="admin-toolbar"><div><Eyebrow>Content studio</Eyebrow><h2>Manage your content</h2></div><div className="admin-dashboard-actions"><div className="admin-tabs" role="tablist" aria-label="Content type">{[['news', 'News'], ['projects', 'Projects'], ['events', 'Events'], ['ads', 'Business ads'], ['staff', 'Staff'], ['executives', 'Excos']].map(([value, label]) => <button type="button" role="tab" aria-selected={kind === value} className={kind === value ? 'admin-tab active' : 'admin-tab'} onClick={() => { setKind(value); setEditingId(null); setTitle(''); setDescription(''); setCategory(''); setWebsiteUrl(''); setImageUpload(undefined); setFlyerUpload(undefined); setNotice(''); }} key={value}>{label}<span>{content[value].length}</span></button>)}</div><button className="admin-logout" type="button" onClick={onLogout}>Sign out</button></div></div>
        <div className="admin-layout">
          <form className="admin-form" onSubmit={handleSubmit}>
            <span className="admin-form-label">{editingId ? 'EDIT' : 'CREATE'} {itemLabel.toUpperCase()}</span>
            <label htmlFor="content-title">{isPerson ? 'Name' : isAd ? 'Business name' : 'Title'}</label><input id="content-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={isPerson ? 'Add their name' : isAd ? 'Enter the business name' : 'Give it a good name'} maxLength={90} required />
            <label htmlFor="content-category">{isPerson ? 'Role' : isAd ? 'Business category' : 'Category'}{kind !== 'staff' && kind !== 'executives' && <span> (optional)</span>}</label><input id="content-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder={isPerson ? 'e.g. Lecturer or President' : isAd ? 'e.g. Fashion, food, or technology' : kind === 'events' ? 'e.g. Workshop' : 'e.g. Department news'} maxLength={40} required={isPerson} />
            <label htmlFor="content-description">{kind === 'events' ? 'Location' : isAd ? 'Business description' : kind === 'staff' ? 'Focus area' : kind === 'executives' ? 'Short bio' : 'Description'}{isPerson && <span> (optional)</span>}</label><textarea id="content-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={kind === 'events' ? 'Where will it happen?' : isAd ? 'Describe the business and what it offers' : isPerson ? 'Add a little more information' : 'What should people know?'} rows="4" maxLength={240} required={!isPerson} />
            {isAd && <>
              <label htmlFor="business-website">Business website</label>
              <input id="business-website" type="url" inputMode="url" value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} placeholder="https://example.com" pattern="https?://.+" title="Enter a website beginning with http:// or https://" maxLength={200} required />
            </>}
            {(kind === 'events' || kind === 'projects' || isAd || isPerson) && <>
              <label htmlFor={`${kind}-picture`}>{kind === 'events' ? 'Event picture' : kind === 'projects' ? 'Project image' : isAd ? 'Business image' : 'Profile picture'} <span>(optional, JPG/PNG/WebP, max 1 MB)</span></label>
              <input ref={imageInputRef} className="event-file-input" id={`${kind}-picture`} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
              <div className="media-upload-controls">
                <button className="media-upload-button" type="button" onClick={() => imageInputRef.current?.click()}>{imageUpload?.data ? 'Change image' : isPerson ? 'Upload profile picture' : isAd ? 'Upload business image' : 'Upload image'}</button>
                {imageUpload?.data && <><span className="media-upload-name">{imageUpload.name}</span><img className="media-upload-thumbnail" src={imageUpload.data} alt="Selected image preview" /><button className="remove-upload" type="button" onClick={() => setImageUpload(null)}>Remove</button></>}
              </div>
              {kind === 'events' && <>
              <label htmlFor="event-flyer">Event flyer <span>(optional, JPG/PNG/WebP/PDF, max 1 MB)</span></label>
              <input ref={flyerInputRef} className="event-file-input" id="event-flyer" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFlyerUpload} />
              <div className="media-upload-controls">
                <button className="media-upload-button" type="button" onClick={() => flyerInputRef.current?.click()}>{flyerUpload?.data ? 'Change flyer' : 'Upload flyer'}</button>
                {flyerUpload?.data && <><span className="media-upload-name">{flyerUpload.name}</span><button className="remove-upload" type="button" onClick={() => setFlyerUpload(null)}>Remove</button></>}
              </div>
              </>}
              <p className="upload-hint">Images and flyers are saved in this browser, with a 2 MB total limit across events, projects, business ads, staff, and excos.</p>
            </>}
            <div className="admin-form-actions"><button className="button button-primary admin-submit" type="submit">{editingId ? 'Save changes' : isPerson ? 'Add to directory' : isAd ? 'Publish business ad' : 'Publish update'} <Arrow /></button>{editingId && <button className="cancel-edit" type="button" onClick={() => { setEditingId(null); setTitle(''); setCategory(''); setDescription(''); setWebsiteUrl(''); setImageUpload(undefined); setFlyerUpload(undefined); setNotice(''); }}>Cancel</button>}</div>
            {notice && <p className="admin-feedback" role="status">{notice}</p>}
          </form>
          <div className="admin-items"><div className="admin-items-heading"><span>{isAd ? 'EXISTING BUSINESS ADS' : `EXISTING ${kind.toUpperCase()}`}</span><span>{entries.length} ITEMS</span></div>{entries.length ? entries.map((item) => <article className="admin-item" key={item.id}><div><span>{item.role || item.category}</span><h3>{item.name || item.title}</h3></div><div className="admin-item-actions"><button type="button" className="edit-button" onClick={() => editItem(item)} aria-label={`Edit ${item.name || item.title}`}>Edit</button><button type="button" className="remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name || item.title}`}>Remove</button></div></article>) : <p className="empty-state admin-empty">No {kind} yet. Create your first update.</p>}</div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));
  const [content, setContent] = useState(loadContent);
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const currentPath = path === adminDashboardPath && !isAdminAuthenticated
    ? adminPath
    : routePaths.includes(path) ? path : '/';

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (path === adminDashboardPath && !isAdminAuthenticated) {
      window.history.replaceState({}, '', adminPath);
    }
  }, [path, isAdminAuthenticated]);

  useEffect(() => {
    saveContent(content);
  }, [content]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const titles = {
      '/': 'NADSS | Nigeria Association of Data Science Students @ OSUN STATE UNIVERSITY',
      '/staff-exco': 'Staff & Exco | NADSS',
      '/people': 'Staff & Exco | NADSS',
      '/project': 'Projects | NADSS',
      '/events': 'Events | NADSS',
      '/more-info': 'More information | NADSS',
      [adminPath]: 'Admin | NADSS',
      [adminDashboardPath]: 'Admin dashboard | NADSS',
    };
    document.title = titles[currentPath];
  }, [currentPath]);

  function navigate(event, destination) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateTo(destination);
  }

  function navigateTo(destination) {
    if (typeof window === 'undefined') return;
    if (destination !== window.location.pathname) {
      window.history.pushState({}, '', destination);
      setPath(destination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAdminLogin(event) {
    event.preventDefault();
    setAdminAuthenticated(true);
    navigateTo(adminDashboardPath);
  }

  function handleAdminLogout() {
    setAdminAuthenticated(false);
    navigateTo(adminPath);
  }

  let page;
  switch (currentPath) {
    case '/staff-exco':
    case '/people': page = <StaffExcoPage staff={content.staff} executives={content.executives} />; break;
    case '/project': page = <ProjectsPage projects={content.projects} />; break;
    case '/events': page = <EventsPage events={content.events} />; break;
    case '/more-info': page = <MoreInfoPage />; break;
    case adminPath: page = <AdminLoginPage onLogin={handleAdminLogin} />; break;
    case adminDashboardPath: page = <AdminPage content={content} setContent={setContent} onLogout={handleAdminLogout} />; break;
    default: page = <HomePage content={content} onNavigate={navigate} />;
  }

  function handleInternalLink(event) {
    if (event.defaultPrevented || typeof Element === 'undefined' || !(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href^="/"]');
    if (anchor) navigate(event, anchor.pathname);
  }

  return <div className="site-shell" onClick={handleInternalLink}><Navbar activePath={currentPath} onNavigate={navigate} />{page}<Footer onNavigate={navigate} /></div>;
}
