import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  FileText,
  HardHat,
  Home,
  Lightbulb,
  MapPin,
  MessageSquareText,
  Menu,
  PlusCircle,
  Search,
  ShieldCheck,
  Snowflake,
  Tag,
  User,
  Wifi,
} from 'lucide-react'
import undipCrest from './assets/undip-crest.png'
import avatarBudi from './assets/avatar-budi.png'
import './App.css'

type Role = 'pelapor' | 'pimpinan' | 'pekerja'
type View = 'home' | 'create' | 'issues' | 'my-work' | 'profile'
type IssueStatus = 'Open' | 'Assigned' | 'In Progress' | 'Done'
type Priority = 'Low' | 'Medium' | 'High'
type Category = 'ac' | 'lampu' | 'wifi' | 'fasilitas'
type IssueSource = 'laporan' | 'manual'

type Person = {
  id: string
  name: string
  role: Role
  unit: string
}

type TimelineItem = {
  id: string
  type: 'comment' | 'activity'
  author: string
  time: string
  body: string
}

type Issue = {
  id: string
  title: string
  category: Category
  description: string
  location: string
  reporterId?: string
  assigneeId?: string
  createdById: string
  source: IssueSource
  status: IssueStatus
  priority: Priority
  createdAt: string
  deadline: string
  labels: string[]
  timeline: TimelineItem[]
}

const people: Person[] = [
  { id: 'budi', name: 'Budi Santoso', role: 'pelapor', unit: 'Fakultas Teknik' },
  { id: 'raka', name: 'Dr. Raka Wibawa', role: 'pimpinan', unit: 'Pimpinan Fakultas' },
  { id: 'andi', name: 'Andi Prakoso', role: 'pekerja', unit: 'Tim Sarpras' },
  { id: 'sinta', name: 'Sinta Maharani', role: 'pekerja', unit: 'Tim IT' },
  { id: 'maya', name: 'Maya Safitri', role: 'pekerja', unit: 'Tata Usaha' },
]

const roleMeta: Record<
  Role,
  { label: string; description: string; icon: LucideIcon; personId: string }
> = {
  pelapor: {
    label: 'Pelapor',
    description: 'Membuat laporan dan melihat My Laporan',
    icon: User,
    personId: 'budi',
  },
  pimpinan: {
    label: 'Pimpinan',
    description: 'Melihat semua issue, membuat issue, dan assign pekerjaan',
    icon: BriefcaseBusiness,
    personId: 'raka',
  },
  pekerja: {
    label: 'Pekerja',
    description: 'Mengerjakan issue yang sudah di-assign',
    icon: HardHat,
    personId: 'andi',
  },
}

const categoryMeta: Record<
  Category,
  { label: string; icon: LucideIcon; tone: 'blue' | 'gold' | 'green' | 'slate' }
> = {
  ac: { label: 'AC', icon: Snowflake, tone: 'blue' },
  lampu: { label: 'Lampu', icon: Lightbulb, tone: 'gold' },
  wifi: { label: 'Wi-Fi', icon: Wifi, tone: 'green' },
  fasilitas: { label: 'Fasilitas', icon: ClipboardCheck, tone: 'slate' },
}

const workerPeople = people.filter((person) => person.role === 'pekerja')

const initialIssues: Issue[] = [
  {
    id: 'ISS-2026-014',
    title: 'Lampu koridor mati',
    category: 'lampu',
    description: 'Lampu koridor dekat ruang seminar mati sejak pagi.',
    location: 'Gedung A, Lt. 1',
    reporterId: 'budi',
    assigneeId: 'andi',
    createdById: 'budi',
    source: 'laporan',
    status: 'Assigned',
    priority: 'High',
    createdAt: '21 Mei 2026 09:15',
    deadline: '22 Mei 2026',
    labels: ['sarpras', 'laporan'],
    timeline: [
      {
        id: 'tl-1',
        type: 'activity',
        author: 'Budi Santoso',
        time: '09:15',
        body: 'membuat laporan baru.',
      },
      {
        id: 'tl-2',
        type: 'activity',
        author: 'Dr. Raka Wibawa',
        time: '09:25',
        body: 'assign issue ke Andi Prakoso.',
      },
      {
        id: 'tl-3',
        type: 'comment',
        author: 'Andi Prakoso',
        time: '09:40',
        body: 'Saya cek stok lampu dulu, lalu menuju Gedung A.',
      },
    ],
  },
  {
    id: 'ISS-2026-013',
    title: 'AC ruang rapat panas',
    category: 'ac',
    description: 'AC menyala tetapi ruangan tetap panas saat rapat fakultas.',
    location: 'Rektorat Lt. 2',
    reporterId: 'budi',
    assigneeId: 'andi',
    createdById: 'budi',
    source: 'laporan',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '20 Mei 2026 14:30',
    deadline: '22 Mei 2026',
    labels: ['sarpras', 'pending sparepart'],
    timeline: [
      {
        id: 'tl-4',
        type: 'activity',
        author: 'Budi Santoso',
        time: '20 Mei 14:30',
        body: 'membuat laporan baru.',
      },
      {
        id: 'tl-5',
        type: 'activity',
        author: 'Andi Prakoso',
        time: '21 Mei 08:10',
        body: 'mengubah status menjadi In Progress.',
      },
    ],
  },
  {
    id: 'ISS-2026-012',
    title: 'Wi-Fi lantai 2 lambat',
    category: 'wifi',
    description: 'Koneksi sering putus saat digunakan kelas pagi.',
    location: 'Fakultas Ekonomi',
    reporterId: 'budi',
    assigneeId: 'sinta',
    createdById: 'budi',
    source: 'laporan',
    status: 'Done',
    priority: 'Low',
    createdAt: '19 Mei 2026 10:05',
    deadline: '20 Mei 2026',
    labels: ['it', 'selesai'],
    timeline: [
      {
        id: 'tl-6',
        type: 'activity',
        author: 'Sinta Maharani',
        time: '20 Mei 11:40',
        body: 'menandai issue sebagai Done.',
      },
    ],
  },
  {
    id: 'ISS-2026-011',
    title: 'Siapkan ruang sidang dekanat',
    category: 'fasilitas',
    description: 'Pastikan proyektor, kursi, dan mikrofon siap untuk agenda pimpinan.',
    location: 'Aula Dekanat',
    assigneeId: 'maya',
    createdById: 'raka',
    source: 'manual',
    status: 'Assigned',
    priority: 'High',
    createdAt: '21 Mei 2026 08:20',
    deadline: '21 Mei 2026',
    labels: ['manual', 'pimpinan'],
    timeline: [
      {
        id: 'tl-7',
        type: 'activity',
        author: 'Dr. Raka Wibawa',
        time: '08:20',
        body: 'membuat issue manual dan assign ke Maya Safitri.',
      },
    ],
  },
]

const navItems: { view: View; label: string; icon: LucideIcon }[] = [
  { view: 'home', label: 'Home', icon: Home },
  { view: 'create', label: 'Buat Laporan', icon: FilePlus2 },
  { view: 'issues', label: 'All Issues', icon: FileText },
  { view: 'my-work', label: 'Tugas Saya', icon: ClipboardCheck },
  { view: 'profile', label: 'Profil', icon: User },
]

const statuses: IssueStatus[] = ['Open', 'Assigned', 'In Progress', 'Done']
const priorities: Priority[] = ['Low', 'Medium', 'High']

const currentTime = () =>
  new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

function getPerson(id?: string) {
  return people.find((person) => person.id === id)
}

function statusClass(status: IssueStatus) {
  return `status status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

function priorityClass(priority: Priority) {
  return `priority priority-${priority.toLowerCase()}`
}

function CategoryIcon({ category }: { category: Category }) {
  const meta = categoryMeta[category]
  const Icon = meta.icon
  return (
    <span className={`category-icon tone-${meta.tone}`}>
      <Icon size={27} strokeWidth={2.4} />
    </span>
  )
}

function App() {
  const [activeView, setActiveView] = useState<View>('home')
  const [role, setRole] = useState<Role>('pelapor')
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [selectedIssueId, setSelectedIssueId] = useState(initialIssues[0].id)
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [commentDraft, setCommentDraft] = useState('')
  const [issueDraft, setIssueDraft] = useState({
    title: '',
    category: 'lampu' as Category,
    location: '',
    description: '',
    priority: 'Medium' as Priority,
    deadline: '24 Mei 2026',
    assigneeId: workerPeople[0].id,
  })

  const activePerson = getPerson(roleMeta[role].personId) ?? people[0]
  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) ?? issues[0]

  const visibleIssues = useMemo(() => {
    const owned =
      role === 'pimpinan'
        ? issues
        : role === 'pelapor'
          ? issues.filter((issue) => issue.reporterId === activePerson.id)
          : issues.filter((issue) => issue.assigneeId === activePerson.id)

    return owned.filter((issue) => {
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter
      const haystack = `${issue.id} ${issue.title} ${issue.location} ${issue.labels.join(' ')}`.toLowerCase()
      return matchesStatus && haystack.includes(searchTerm.toLowerCase())
    })
  }, [activePerson.id, issues, role, searchTerm, statusFilter])

  const roleCounts = useMemo(
    () => ({
      open: visibleIssues.filter((issue) => issue.status === 'Open').length,
      active: visibleIssues.filter((issue) => issue.status === 'Assigned' || issue.status === 'In Progress').length,
      done: visibleIssues.filter((issue) => issue.status === 'Done').length,
    }),
    [visibleIssues],
  )

  const changeRole = (nextRole: Role) => {
    setRole(nextRole)
    setStatusFilter('All')
    setSearchTerm('')
    setActiveView(nextRole === 'pimpinan' ? 'issues' : nextRole === 'pekerja' ? 'my-work' : 'home')
  }

  const selectIssue = (id: string) => {
    setSelectedIssueId(id)
    setCommentDraft('')
  }

  const createIssue = () => {
    if (!issueDraft.title.trim() || !issueDraft.location.trim()) return

    const isManual = role === 'pimpinan'
    const nextNumber = String(issues.length + 15).padStart(3, '0')
    const assigneeId = isManual ? issueDraft.assigneeId : undefined
    const newIssue: Issue = {
      id: `ISS-2026-${nextNumber}`,
      title: issueDraft.title.trim(),
      category: issueDraft.category,
      description: issueDraft.description.trim() || 'Detail tambahan belum diisi.',
      location: issueDraft.location.trim(),
      reporterId: isManual ? undefined : activePerson.id,
      assigneeId,
      createdById: activePerson.id,
      source: isManual ? 'manual' : 'laporan',
      status: assigneeId ? 'Assigned' : 'Open',
      priority: issueDraft.priority,
      createdAt: '21 Mei 2026 10:45',
      deadline: issueDraft.deadline,
      labels: [isManual ? 'manual' : 'laporan', categoryMeta[issueDraft.category].label.toLowerCase()],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          type: 'activity',
          author: activePerson.name,
          time: currentTime(),
          body: isManual
            ? `membuat issue manual${assigneeId ? ` dan assign ke ${getPerson(assigneeId)?.name}` : ''}.`
            : 'membuat laporan baru.',
        },
      ],
    }

    setIssues((current) => [newIssue, ...current])
    setSelectedIssueId(newIssue.id)
    setIssueDraft({
      title: '',
      category: 'lampu',
      location: '',
      description: '',
      priority: 'Medium',
      deadline: '24 Mei 2026',
      assigneeId: workerPeople[0].id,
    })
    setActiveView(role === 'pimpinan' ? 'issues' : 'home')
  }

  const updateIssue = (id: string, updates: Partial<Issue>, activity?: string) => {
    setIssues((current) =>
      current.map((issue) => {
        if (issue.id !== id) return issue
        return {
          ...issue,
          ...updates,
          timeline: activity
            ? [
                ...issue.timeline,
                {
                  id: `tl-${Date.now()}`,
                  type: 'activity',
                  author: activePerson.name,
                  time: currentTime(),
                  body: activity,
                },
              ]
            : issue.timeline,
        }
      }),
    )
  }

  const assignIssue = (issueId: string, assigneeId: string) => {
    const assignee = getPerson(assigneeId)
    updateIssue(
      issueId,
      { assigneeId, status: 'Assigned' },
      `assign issue ke ${assignee?.name ?? 'pekerja'}.`,
    )
  }

  const changeStatus = (issueId: string, status: IssueStatus) => {
    updateIssue(issueId, { status }, `mengubah status menjadi ${status}.`)
  }

  const addComment = () => {
    if (!commentDraft.trim()) return
    setIssues((current) =>
      current.map((issue) =>
        issue.id === selectedIssue.id
          ? {
              ...issue,
              timeline: [
                ...issue.timeline,
                {
                  id: `tl-${Date.now()}`,
                  type: 'comment',
                  author: activePerson.name,
                  time: currentTime(),
                  body: commentDraft.trim(),
                },
              ],
            }
          : issue,
      ),
    )
    setCommentDraft('')
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} role={role} />

      <main className="main-panel">
        <Topbar role={role} activePerson={activePerson} onRoleChange={changeRole} />

        <section className="mobile-hero">
          <div>
            <p className="eyebrow">{roleMeta[role].label}</p>
            <h1>{mobileTitle(activeView, role)}</h1>
          </div>
          <img src={avatarBudi} alt="Profil demo" />
        </section>

        <div className="content-wrap">
          {activeView === 'home' && (
            <Dashboard
              role={role}
              activePerson={activePerson}
              issues={visibleIssues}
              counts={roleCounts}
              onNavigate={setActiveView}
              onSelectIssue={selectIssue}
            />
          )}
          {activeView === 'create' && (
            <IssueForm
              role={role}
              draft={issueDraft}
              setDraft={setIssueDraft}
              onSubmit={createIssue}
            />
          )}
          {(activeView === 'issues' || activeView === 'my-work') && (
            <IssueWorkspace
              role={role}
              issues={visibleIssues}
              selectedIssue={selectedIssue}
              selectedIssueId={selectedIssueId}
              statusFilter={statusFilter}
              searchTerm={searchTerm}
              commentDraft={commentDraft}
              setStatusFilter={setStatusFilter}
              setSearchTerm={setSearchTerm}
              setCommentDraft={setCommentDraft}
              onSelectIssue={selectIssue}
              onAssign={assignIssue}
              onStatusChange={changeStatus}
              onComment={addComment}
            />
          )}
          {activeView === 'profile' && (
            <ProfilePanel
              role={role}
              activePerson={activePerson}
              issues={issues}
              onRoleChange={changeRole}
            />
          )}
        </div>
      </main>

      <BottomNav activeView={activeView} role={role} setActiveView={setActiveView} />
    </div>
  )
}

function mobileTitle(view: View, role: Role) {
  if (view === 'home') return role === 'pimpinan' ? 'All Issues' : role === 'pekerja' ? 'Tugas Saya' : 'My Laporan'
  return navItems.find((item) => item.view === view)?.label ?? 'Dashboard'
}

function Sidebar({
  activeView,
  setActiveView,
  role,
}: {
  activeView: View
  setActiveView: (view: View) => void
  role: Role
}) {
  const items = navItems.filter((item) => {
    if (item.view === 'issues') return role === 'pimpinan'
    if (item.view === 'my-work') return role === 'pekerja'
    return true
  })

  return (
    <aside className="sidebar">
      <div className="brand-lockup vertical">
        <img src={undipCrest} alt="Logo UNDIP" />
        <div>
          <strong>UNDIP ReportFlow</strong>
          <span>Issue & Penugasan</span>
        </div>
      </div>

      <nav className="side-nav" aria-label="Navigasi utama">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.view}
              className={activeView === item.view ? 'active' : ''}
              onClick={() => setActiveView(item.view)}
              type="button"
            >
              <Icon size={21} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="leader-card">
        <ShieldCheck size={25} />
        <strong>Alur sederhana</strong>
        <p>Pelapor membuat laporan, pimpinan assign issue, pekerja update progres.</p>
        <button type="button" onClick={() => setActiveView(role === 'pimpinan' ? 'issues' : 'home')}>
          Lihat issue <ChevronRight size={17} />
        </button>
      </div>
    </aside>
  )
}

function Topbar({
  role,
  activePerson,
  onRoleChange,
}: {
  role: Role
  activePerson: Person
  onRoleChange: (role: Role) => void
}) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <Menu size={26} />
        <img src={undipCrest} alt="Logo UNDIP" />
        <div>
          <strong>UNDIP ReportFlow</strong>
          <span>Issue & Penugasan</span>
        </div>
      </div>
      <div className="top-actions">
        <button className="icon-button" type="button" aria-label="Notifikasi">
          <Bell size={23} />
          <span />
        </button>
        <label className="role-select">
          <img src={avatarBudi} alt="" />
          <select value={role} onChange={(event) => onRoleChange(event.target.value as Role)}>
            {(Object.keys(roleMeta) as Role[]).map((value) => (
              <option key={value} value={value}>
                {getPerson(roleMeta[value].personId)?.name} - {roleMeta[value].label}
              </option>
            ))}
          </select>
        </label>
        <span className="unit-chip">{activePerson.unit}</span>
      </div>
    </header>
  )
}

function Dashboard({
  role,
  activePerson,
  issues,
  counts,
  onNavigate,
  onSelectIssue,
}: {
  role: Role
  activePerson: Person
  issues: Issue[]
  counts: { open: number; active: number; done: number }
  onNavigate: (view: View) => void
  onSelectIssue: (id: string) => void
}) {
  const heading =
    role === 'pimpinan'
      ? 'All Issues'
      : role === 'pekerja'
        ? 'Tugas Saya'
        : 'My Laporan'

  return (
    <div className="screen-stack">
      <div className="page-heading">
        <p className="eyebrow">{roleMeta[role].label}</p>
        <h1>Halo, {activePerson.name.split(' ')[0]}</h1>
        <span>{roleMeta[role].description}</span>
      </div>

      <div className="quick-grid">
        <button className="quick-action" type="button" onClick={() => onNavigate('create')}>
          <CategoryIcon category="fasilitas" />
          <div>
            <strong>{role === 'pimpinan' ? 'Create Issue' : 'Buat Laporan'}</strong>
            <span>{role === 'pimpinan' ? 'Buat issue manual dan assign pekerja' : 'Laporkan kendala ke sistem'}</span>
          </div>
          <ChevronRight />
        </button>
        <button
          className="quick-action gold"
          type="button"
          onClick={() => onNavigate(role === 'pekerja' ? 'my-work' : role === 'pimpinan' ? 'issues' : 'home')}
        >
          <CategoryIcon category="lampu" />
          <div>
            <strong>{heading}</strong>
            <span>{role === 'pimpinan' ? 'Lihat semua issue aktif' : 'Pantau status pekerjaan'}</span>
          </div>
          <ChevronRight />
        </button>
      </div>

      <div className="metric-row">
        <Metric label="Open" value={counts.open} tone="gold" />
        <Metric label="Active" value={counts.active} tone="blue" />
        <Metric label="Done" value={counts.done} tone="green" />
      </div>

      <section className="panel">
        <div className="section-title">
          <h2>{heading}</h2>
          <button type="button" onClick={() => onNavigate(role === 'pimpinan' ? 'issues' : role === 'pekerja' ? 'my-work' : 'create')}>
            {role === 'pelapor' ? 'Tambah' : 'Lihat semua'}
          </button>
        </div>
        <IssueList issues={issues.slice(0, 4)} selectedIssueId="" onSelectIssue={onSelectIssue} />
      </section>
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'blue' | 'gold' | 'green'
}) {
  return (
    <article className={`metric tone-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

function IssueForm({
  role,
  draft,
  setDraft,
  onSubmit,
}: {
  role: Role
  draft: {
    title: string
    category: Category
    location: string
    description: string
    priority: Priority
    deadline: string
    assigneeId: string
  }
  setDraft: (draft: {
    title: string
    category: Category
    location: string
    description: string
    priority: Priority
    deadline: string
    assigneeId: string
  }) => void
  onSubmit: () => void
}) {
  const isManual = role === 'pimpinan'

  return (
    <div className="screen-stack narrow">
      <div className="page-heading">
        <p className="eyebrow">{isManual ? 'Pimpinan' : 'Pelapor'}</p>
        <h1>{isManual ? 'Create Issue Manual' : 'Buat Laporan'}</h1>
        <span>{isManual ? 'Buat pekerjaan langsung dan assign ke pekerja.' : 'Laporan masuk sebagai issue Open.'}</span>
      </div>
      <section className="panel form-panel">
        <label>
          Kategori
          <select
            value={draft.category}
            onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })}
          >
            {Object.entries(categoryMeta).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Judul issue
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="Contoh: Lampu koridor mati"
          />
        </label>
        <label>
          Lokasi
          <input
            value={draft.location}
            onChange={(event) => setDraft({ ...draft, location: event.target.value })}
            placeholder="Contoh: Gedung A, Lt. 1"
          />
        </label>
        <div className="form-grid">
          <label>
            Priority
            <select
              value={draft.priority}
              onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })}
            >
              {priorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
          <label>
            Deadline
            <input value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
          </label>
        </div>
        {isManual && (
          <label>
            Assign ke pekerja
            <select value={draft.assigneeId} onChange={(event) => setDraft({ ...draft, assigneeId: event.target.value })}>
              {workerPeople.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} - {worker.unit}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Deskripsi
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Tuliskan detail singkat issue"
          />
        </label>
        <div className="upload-placeholder">
          <PlusCircle size={22} />
          <span>Attachment opsional</span>
        </div>
        <button className="primary-action" type="button" onClick={onSubmit}>
          {isManual ? 'Create & Assign' : 'Kirim Laporan'}
        </button>
      </section>
    </div>
  )
}

function IssueWorkspace({
  role,
  issues,
  selectedIssue,
  selectedIssueId,
  statusFilter,
  searchTerm,
  commentDraft,
  setStatusFilter,
  setSearchTerm,
  setCommentDraft,
  onSelectIssue,
  onAssign,
  onStatusChange,
  onComment,
}: {
  role: Role
  issues: Issue[]
  selectedIssue: Issue
  selectedIssueId: string
  statusFilter: IssueStatus | 'All'
  searchTerm: string
  commentDraft: string
  setStatusFilter: (status: IssueStatus | 'All') => void
  setSearchTerm: (value: string) => void
  setCommentDraft: (value: string) => void
  onSelectIssue: (id: string) => void
  onAssign: (issueId: string, assigneeId: string) => void
  onStatusChange: (issueId: string, status: IssueStatus) => void
  onComment: () => void
}) {
  const title = role === 'pimpinan' ? 'All Issues' : 'Tugas Saya'

  return (
    <div className="screen-stack">
      <div className="page-heading inline-heading">
        <div>
          <p className="eyebrow">{roleMeta[role].label}</p>
          <h1>{title}</h1>
        </div>
        <span className="role-chip">
          <FileText size={17} /> GitHub-style issue
        </span>
      </div>

      <section className="issue-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search issue, lokasi, label"
          />
        </label>
        <div className="segmented compact">
          {(['All', ...statuses] as (IssueStatus | 'All')[]).map((status) => (
            <button
              key={status}
              className={statusFilter === status ? 'active' : ''}
              type="button"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <div className="issue-layout">
        <section className="panel issue-list-panel">
          <IssueList issues={issues} selectedIssueId={selectedIssueId} onSelectIssue={onSelectIssue} />
        </section>
        <IssueDetail
          role={role}
          issue={selectedIssue}
          commentDraft={commentDraft}
          setCommentDraft={setCommentDraft}
          onAssign={onAssign}
          onStatusChange={onStatusChange}
          onComment={onComment}
        />
      </div>
    </div>
  )
}

function IssueList({
  issues,
  selectedIssueId,
  onSelectIssue,
}: {
  issues: Issue[]
  selectedIssueId: string
  onSelectIssue: (id: string) => void
}) {
  if (!issues.length) {
    return <div className="empty-state">Belum ada issue untuk filter ini.</div>
  }

  return (
    <div className="issue-list">
      {issues.map((issue) => {
        const assignee = getPerson(issue.assigneeId)
        return (
          <button
            key={issue.id}
            type="button"
            className={selectedIssueId === issue.id ? 'selected' : ''}
            onClick={() => onSelectIssue(issue.id)}
          >
            <CategoryIcon category={issue.category} />
            <div className="issue-row-main">
              <span className="issue-id">{issue.id}</span>
              <strong>{issue.title}</strong>
              <small>
                <MapPin size={15} /> {issue.location}
              </small>
              <div className="issue-labels">
                {issue.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
            <div className="issue-row-meta">
              <span className={statusClass(issue.status)}>{issue.status}</span>
              <span className={priorityClass(issue.priority)}>{issue.priority}</span>
              <small>{assignee?.name ?? 'Unassigned'}</small>
            </div>
            <ChevronRight size={20} />
          </button>
        )
      })}
    </div>
  )
}

function IssueDetail({
  role,
  issue,
  commentDraft,
  setCommentDraft,
  onAssign,
  onStatusChange,
  onComment,
}: {
  role: Role
  issue: Issue
  commentDraft: string
  setCommentDraft: (value: string) => void
  onAssign: (issueId: string, assigneeId: string) => void
  onStatusChange: (issueId: string, status: IssueStatus) => void
  onComment: () => void
}) {
  const canAssign = role === 'pimpinan'
  const canWork = role === 'pekerja'
  const assignee = getPerson(issue.assigneeId)
  const reporter = getPerson(issue.reporterId)
  const creator = getPerson(issue.createdById)

  return (
    <section className="panel issue-detail">
      <div className="detail-head issue-detail-head">
        <CategoryIcon category={issue.category} />
        <div>
          <span>{issue.id}</span>
          <h2>{issue.title}</h2>
          <p>{issue.description}</p>
        </div>
        <span className={statusClass(issue.status)}>{issue.status}</span>
      </div>

      <div className="issue-fields">
        <InfoPill icon={User} label="Reporter" value={reporter?.name ?? 'Manual issue'} />
        <InfoPill icon={BriefcaseBusiness} label="Created by" value={creator?.name ?? '-'} />
        <InfoPill icon={HardHat} label="Assignee" value={assignee?.name ?? 'Unassigned'} />
        <InfoPill icon={Calendar} label="Deadline" value={issue.deadline} />
        <InfoPill icon={Tag} label="Priority" value={issue.priority} />
        <InfoPill icon={MapPin} label="Lokasi" value={issue.location} />
      </div>

      {canAssign && (
        <div className="control-grid">
          <label>
            Assign pekerja
            <select value={issue.assigneeId ?? ''} onChange={(event) => onAssign(issue.id, event.target.value)}>
              <option value="" disabled>
                Pilih pekerja
              </option>
              {workerPeople.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} - {worker.unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={issue.status} onChange={(event) => onStatusChange(issue.id, event.target.value as IssueStatus)}>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {canWork && (
        <div className="action-row">
          <button
            type="button"
            className="secondary-action"
            onClick={() => onStatusChange(issue.id, 'In Progress')}
            disabled={issue.status === 'Done'}
          >
            <Clock3 size={19} /> Mulai
          </button>
          <button
            type="button"
            className="primary-action gold-action"
            onClick={() => onStatusChange(issue.id, 'Done')}
            disabled={issue.status === 'Done'}
          >
            <CheckCircle2 size={19} /> Selesai
          </button>
        </div>
      )}

      <div className="timeline">
        <h3>Comments & activity</h3>
        {issue.timeline.map((item) => (
          <article key={item.id} className={item.type}>
            <span className="timeline-icon">
              {item.type === 'comment' ? <MessageSquareText size={17} /> : <Clock3 size={17} />}
            </span>
            <div>
              <strong>
                {item.author} <small>{item.time}</small>
              </strong>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="comment-box">
        <textarea
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.target.value)}
          placeholder="Tambahkan komentar atau progress..."
        />
        <button type="button" className="primary-action" onClick={onComment}>
          Comment
        </button>
      </div>
    </section>
  )
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="info-pill">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ProfilePanel({
  role,
  activePerson,
  issues,
  onRoleChange,
}: {
  role: Role
  activePerson: Person
  issues: Issue[]
  onRoleChange: (role: Role) => void
}) {
  return (
    <div className="screen-stack narrow">
      <div className="page-heading">
        <p className="eyebrow">Demo switcher</p>
        <h1>Profil Demo</h1>
        <span>Pilih peran untuk mencoba Pelapor, Pimpinan, atau Pekerja.</span>
      </div>
      <section className="panel profile-card">
        <img src={avatarBudi} alt="Profil demo" />
        <div>
          <strong>{activePerson.name}</strong>
          <span>
            {roleMeta[role].label} - {activePerson.unit}
          </span>
        </div>
        <select value={role} onChange={(event) => onRoleChange(event.target.value as Role)}>
          {(Object.keys(roleMeta) as Role[]).map((value) => (
            <option key={value} value={value}>
              {roleMeta[value].label}
            </option>
          ))}
        </select>
      </section>
      <div className="metric-row">
        <Metric label="All issues" value={issues.length} tone="blue" />
        <Metric label="Active" value={issues.filter((issue) => issue.status !== 'Done').length} tone="gold" />
        <Metric label="Done" value={issues.filter((issue) => issue.status === 'Done').length} tone="green" />
      </div>
    </div>
  )
}

function BottomNav({
  activeView,
  role,
  setActiveView,
}: {
  activeView: View
  role: Role
  setActiveView: (view: View) => void
}) {
  const items = navItems.filter((item) => {
    if (item.view === 'issues') return role === 'pimpinan'
    if (item.view === 'my-work') return role === 'pekerja'
    return ['home', 'create', 'profile'].includes(item.view)
  })

  return (
    <nav className="bottom-nav" aria-label="Navigasi bawah">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.view}
            type="button"
            className={activeView === item.view ? 'active' : ''}
            onClick={() => setActiveView(item.view)}
          >
            <Icon size={23} />
            <span>{item.view === 'create' ? 'Lapor' : item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default App
