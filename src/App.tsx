import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  GitBranch,
  KeyRound,
  Menu,
  Play,
  Radar,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
  TimerReset,
  Wand2,
  Workflow,
  Zap,
  BookOpen,
} from 'lucide-react'
import './App.css'

type Page = 'landing' | 'dashboard' | 'new' | 'investigation' | 'settings'

type Investigation = {
  id: string
  title: string
  repo: string
  branch: string
  commit: string
  failingTest: string
  status: string
  confidence: number
  risk: 'Low' | 'Medium' | 'High'
  source: string
  larkStatus: string
  updated: string
  classifier: string
}

type TimelineStep = {
  title: string
  detail: string
  event: string
  time: string
}

type Agent = {
  name: string
  status: string
  finding: string
  confidence: number
  evidence: string
  explanation: string
}

const investigations: Investigation[] = [
  {
    id: 'INV-1027',
    title: 'Auth middleware crashes on users without profiles',
    repo: 'github.com/demo-commerce/api',
    branch: 'main',
    commit: '8f4c91a',
    failingTest: 'auth.middleware.test.ts > returns display name for authenticated user',
    status: 'Verified fix',
    confidence: 93,
    risk: 'Medium',
    source: 'GitHub Actions',
    larkStatus: 'Replay ready',
    updated: '4 min ago',
    classifier: 'Deterministic code regression',
  },
  {
    id: 'INV-1026',
    title: 'Payment webhook idempotency failure',
    repo: 'github.com/ledgerly/payments',
    branch: 'release/2026.05',
    commit: 'ff09b32',
    failingTest: 'webhooks.stripe.test.ts > ignores duplicate charge events',
    status: 'Patch suggested',
    confidence: 88,
    risk: 'High',
    source: 'Linear issue',
    larkStatus: 'Workflow passed',
    updated: '19 min ago',
    classifier: 'Configuration issue',
  },
  {
    id: 'INV-1025',
    title: 'Flaky checkout timeout test',
    repo: 'github.com/demo-commerce/web',
    branch: 'feature/cart-sync',
    commit: '12ad7be',
    failingTest: 'checkout.spec.ts > completes order under load',
    status: 'Needs owner',
    confidence: 76,
    risk: 'Low',
    source: 'CI retry',
    larkStatus: 'Repair queued',
    updated: '42 min ago',
    classifier: 'Likely flaky test caused by timing sensitivity',
  },
  {
    id: 'INV-1024',
    title: 'Dependency update broke API schema validation',
    repo: 'github.com/atlas-core/gateway',
    branch: 'renovate/zod-4',
    commit: 'a71b0d9',
    failingTest: 'schema.contract.test.ts > rejects unknown enum values',
    status: 'Regression test generated',
    confidence: 84,
    risk: 'Medium',
    source: 'Dependabot PR',
    larkStatus: 'Replay ready',
    updated: '1 hr ago',
    classifier: 'Dependency regression',
  },
]

const timeline: TimelineStep[] = [
  {
    title: 'Failure received from CI',
    detail: 'GitHub Actions attached failing Jest output and commit metadata.',
    event: 'investigation.started',
    time: '09:41:12',
  },
  {
    title: 'Lark workflow initialized',
    detail: 'Created deterministic workflow larkops-auth-repro with event capture enabled.',
    event: 'lark.workflow.initialized',
    time: '09:41:16',
  },
  {
    title: 'Environment prepared',
    detail: 'Node 22.11, pnpm 9.12, Postgres fixture image, and CI env vars restored.',
    event: 'environment.prepared',
    time: '09:41:44',
  },
  {
    title: 'Dependencies restored',
    detail: 'Lockfile hash matched CI run; no dependency drift detected.',
    event: 'dependencies.restored',
    time: '09:42:03',
  },
  {
    title: 'Failing test reproduced',
    detail: 'Original failure reproduced in 2 of 2 Lark executions.',
    event: 'failure.reproduced',
    time: '09:42:31',
  },
  {
    title: 'Gemini/LarkOps agents started',
    detail: 'Six specialized agents analyzed logs, drift, test history, patch scope, and PR risk.',
    event: 'agents.started',
    time: '09:42:38',
  },
  {
    title: 'Root cause identified',
    detail: 'Null dereference mapped to display name helper reading user.profile.name.',
    event: 'root_cause.identified',
    time: '09:43:10',
  },
  {
    title: 'Patch generated',
    detail: 'Fallback display name added without changing authentication or authorization logic.',
    event: 'patch.generated',
    time: '09:43:29',
  },
  {
    title: 'Regression test generated',
    detail: 'Added profile-less authenticated user fixture to lock the edge case.',
    event: 'regression_test.generated',
    time: '09:43:50',
  },
  {
    title: 'Verification passed',
    detail: 'Target test, regression test, and auth middleware suite passed.',
    event: 'verification.passed',
    time: '09:44:24',
  },
  {
    title: 'PR summary prepared',
    detail: 'Review-ready summary includes Lark replay, verification, and blast radius.',
    event: 'pr.preview.generated',
    time: '09:44:39',
  },
]

const agents: Agent[] = [
  {
    name: 'Log Analyst',
    status: 'Complete',
    finding: 'Stack trace points directly to displayNameForUser.',
    confidence: 96,
    evidence: 'TypeError: Cannot read properties of null (reading name)',
    explanation: 'The failure signature is stable and maps to a single helper used by auth middleware.',
  },
  {
    name: 'Environment Drift Agent',
    status: 'Complete',
    finding: 'No runtime or dependency drift found.',
    confidence: 91,
    evidence: 'Lockfile hash, Node version, and fixture image match the failing CI run.',
    explanation: 'The reproduced failure does not depend on local machine differences.',
  },
  {
    name: 'Regression Hunter',
    status: 'Complete',
    finding: 'Fixture changed to allow valid users without profile records.',
    confidence: 89,
    evidence: 'createUser({ profile: null }) added in auth fixture refactor.',
    explanation: 'The test exposes a real production edge case when profile creation is delayed.',
  },
  {
    name: 'Test Synthesizer',
    status: 'Complete',
    finding: 'Generated coverage for profile-less authenticated users.',
    confidence: 94,
    evidence: 'New test asserts middleware returns UNKNOWN without throwing.',
    explanation: 'The regression test fails on main and passes with the proposed patch.',
  },
  {
    name: 'Fix Agent',
    status: 'Complete',
    finding: 'Optional chaining with fallback is the smallest safe patch.',
    confidence: 92,
    evidence: 'No token, session, authorization, or persistence code changes required.',
    explanation: 'The patch changes display formatting only and preserves existing profile behavior.',
  },
  {
    name: 'PR Reviewer',
    status: 'Complete',
    finding: 'Medium risk because code sits in auth-facing middleware.',
    confidence: 87,
    evidence: 'Touched helper runs on authenticated request path, but not security decisions.',
    explanation: 'Human review should focus on fallback semantics and product expectations.',
  },
]

const larkEvents = [
  ['evt_lrk_8T2A01', '09:41:12', 'larkops-auth-repro', 'INV-1027', 'investigation.started', 'accepted'],
  ['evt_lrk_8T2A16', '09:42:31', 'larkops-auth-repro', 'INV-1027', 'failure.reproduced', 'passed'],
  ['evt_lrk_8T2A37', '09:43:10', 'larkops-auth-repro', 'INV-1027', 'root_cause.identified', 'passed'],
  ['evt_lrk_8T2A52', '09:43:50', 'larkops-auth-repro', 'INV-1027', 'regression_test.generated', 'passed'],
  ['evt_lrk_8T2A74', '09:44:24', 'larkops-auth-repro', 'INV-1027', 'verification.passed', 'passed'],
  ['evt_lrk_8T2A81', '09:44:39', 'larkops-auth-repro', 'INV-1027', 'pr.preview.generated', 'passed'],
]

const terminalLog = `$ getlark workflows invoke --workflow-ids wf_larkops_auth_repro --wait --verbose
[lark] execution exe_91cd started for workflow larkops-auth-repro
[lark] restoring environment: node=22.11.0 pnpm=9.12.3 postgres=16-ci
[lark] event evt_lrk_8T2A16 failure.reproduced

$ pnpm test auth.middleware.test.ts -t "returns display name for authenticated user"

 FAIL  src/auth/auth.middleware.test.ts
  auth middleware
    x returns display name for authenticated user (42 ms)

  TypeError: Cannot read properties of null (reading 'name')

    18 | export function displayNameForUser(user: AuthenticatedUser) {
    19 |   // Existing behavior assumed profile was always attached.
  > 20 |   return user.profile.name.toUpperCase();
       |                       ^
    21 | }
    22 |
    23 | export function attachAuthContext(req, user) {

  at displayNameForUser (src/auth/display-name.ts:20:23)
  at attachAuthContext (src/auth/auth.middleware.ts:44:19)
  at Object.<anonymous> (src/auth/auth.middleware.test.ts:87:12)

[lark] deterministic reproduction confirmed: 2/2 executions failed with same stack
[lark] logs uploaded: lark://executions/exe_91cd/logs
[larkops] Log Analyst: stack trace maps to display-name.ts:20
[larkops] Environment Drift Agent: lockfile and runtime match CI
[larkops] Fix Agent: proposed fallback display name for missing profile

$ git apply .larkops/patches/INV-1027-auth-display-name.patch
$ pnpm test auth.middleware.test.ts src/auth/display-name.test.ts

 PASS  src/auth/display-name.test.ts
 PASS  src/auth/auth.middleware.test.ts

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Time:        3.84 s

[lark] event evt_lrk_8T2A74 verification.passed
[lark] replay ready: https://dashboard.getlark.ai/replays/exe_91cd`

const patch = `diff --git a/src/auth/display-name.ts b/src/auth/display-name.ts
index 92d71ab..4f31c80 100644
--- a/src/auth/display-name.ts
+++ b/src/auth/display-name.ts
@@ -17,7 +17,7 @@ export type AuthenticatedUser = {
 }

 export function displayNameForUser(user: AuthenticatedUser) {
-  return user.profile.name.toUpperCase();
+  return user.profile?.name?.toUpperCase() ?? "UNKNOWN";
 }`

const regressionTest = `it("does not crash when an authenticated user has no profile", async () => {
  const user = createAuthenticatedUser({
    id: "usr_profile_pending",
    email: "pending@example.com",
    profile: null,
  });

  const response = await request(app)
    .get("/account")
    .set("Authorization", bearerTokenFor(user))
    .expect(200);

  expect(response.body.viewer.displayName).toBe("UNKNOWN");
});`

const prPreview = `## Summary
- Handle authenticated users whose profile record has not been created yet.
- Return the fallback display name "UNKNOWN" instead of throwing in auth middleware.
- Add a regression test for profile-less authenticated users.

## Root cause
The display name helper assumed every authenticated user had a profile object. A new fixture created a valid authenticated user with profile: null, which exposed a null dereference at user.profile.name.

## Fix
Use optional chaining and an explicit fallback:
\`user.profile?.name?.toUpperCase() ?? "UNKNOWN"\`

## Verification
- Reproduced original CI failure with Lark deterministic workflow wf_larkops_auth_repro.
- Applied patch and added regression coverage.
- Re-ran auth middleware and display-name suites: 18 tests passed.

## Risk analysis
Medium risk. The code runs in auth-adjacent request context, but the patch only changes display-name formatting. It does not modify token verification, authorization checks, session state, or database writes.

## Lark replay
https://dashboard.getlark.ai/replays/exe_91cd`

const postmortem = `Incident INV-1027: Auth middleware profile null dereference

Summary:
An auth middleware test failed because displayNameForUser assumed user.profile was always present. Lark reproduced the failure deterministically and verified a minimal fallback patch.

Timeline:
09:41 Failure received from GitHub Actions.
09:42 Lark deterministic workflow reproduced the failing test.
09:43 Root cause identified and regression test generated.
09:44 Patch verified and PR summary prepared.

Root cause:
The user fixture model now permits authenticated users without profile records. Display formatting code did not handle that valid state.

Fix:
Use optional chaining and return UNKNOWN when profile name is unavailable.

Prevention:
Keep the generated regression test, add fixture contract notes, and monitor future auth display helper changes through Lark workflow events.

Owner follow-up:
Auth platform owner should confirm UNKNOWN is the desired product fallback.`

function App() {
  const [page, setPage] = useState<Page>('landing')
  const [runKey, setRunKey] = useState(0)
  const [activeStep, setActiveStep] = useState(timeline.length - 1)
  const [formStatus, setFormStatus] = useState('Draft')
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  const geminiModel = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? 'gemini-2.0-flash'
  const larkWorkflowId =
    (import.meta.env.VITE_LARK_WORKFLOW_ID as string | undefined) ?? 'wf_larkops_auth_repro'
  const larkWorkflowStatus =
    (import.meta.env.VITE_LARK_WORKFLOW_STATUS as string | undefined) ?? 'demo replay'
  const larkExecutionId =
    (import.meta.env.VITE_LARK_EXECUTION_ID as string | undefined) ?? 'exe_91cd'
  const larkCliVerified = import.meta.env.VITE_LARK_CLI_VERIFIED === 'true'

  const isRunning = activeStep < timeline.length - 1
  const providerMode = geminiApiKey ? 'Gemini mode' : 'Demo/mock mode'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [page])

  useEffect(() => {
    if (!isRunning) return undefined
    const timer = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, timeline.length - 1))
    }, 850)
    return () => window.clearInterval(timer)
  }, [isRunning, runKey])

  const launchDemo = () => {
    setPage('investigation')
    setActiveStep(0)
    setRunKey((key) => key + 1)
  }

  const navItems: [Page, string][] = [
    ['dashboard', 'Dashboard'],
    ['new', 'New investigation'],
    ['investigation', 'Demo investigation'],
    ['settings', 'Settings'],
  ]

  return (
    <div className={`app-shell ${page === 'landing' ? 'landing-mode' : ''}`}>
      <header className="topbar">
        <button className="brand" onClick={() => setPage('landing')} type="button">
          <span className="brand-mark">LO</span>
          <span>
            <strong>LarkOps AI</strong>
            <small>Reproducible failure ops</small>
          </span>
        </button>
        <nav>
          {navItems.map(([target, label]) => (
            <button
              className={page === target ? 'nav-active' : ''}
              key={target}
              onClick={() => setPage(target)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="mode-pill">
          <Sparkles size={15} />
          {providerMode}
        </div>
      </header>

      {page === 'landing' && <Landing launchDemo={launchDemo} setPage={setPage} />}
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'new' && (
        <NewInvestigation
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          setPage={setPage}
          launchDemo={launchDemo}
        />
      )}
      {page === 'investigation' && (
        <InvestigationDetail
          activeStep={activeStep}
          isRunning={isRunning}
          launchDemo={launchDemo}
          providerMode={providerMode}
          larkWorkflowId={larkWorkflowId}
          larkExecutionId={larkExecutionId}
        />
      )}
      {page === 'settings' && (
        <SettingsPage
          providerMode={providerMode}
          geminiApiKey={geminiApiKey}
          geminiModel={geminiModel}
          larkWorkflowId={larkWorkflowId}
          larkWorkflowStatus={larkWorkflowStatus}
          larkExecutionId={larkExecutionId}
          larkCliVerified={larkCliVerified}
        />
      )}
    </div>
  )
}

function Landing({ launchDemo, setPage }: { launchDemo: () => void; setPage: (page: Page) => void }) {
  return (
    <main className="landing">
      <section className="landing-video-hero">
        <video
          className="landing-video"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="video-scrim" aria-hidden="true" />

        <div className="landing-split">
          <section className="landing-left">
            <div className="liquid-glass-strong left-glass" />
            <div className="landing-left-content">
              <div className="landing-nav">
                <button className="landing-logo" onClick={() => setPage('landing')} type="button">
                  <span className="landing-logo-mark">LO</span>
                  <span>LarkOps</span>
                </button>
                <button className="glass-pill" onClick={() => setPage('dashboard')} type="button">
                  <Menu size={17} />
                  Console
                </button>
              </div>

              <div className="landing-center">
                <div className="hero-orbit liquid-glass">
                  <Workflow size={38} />
                </div>
                <p className="glass-kicker">Lark CLI/MCP failure operations</p>
                <h1>
                  Turn broken CI into <em>verified</em> fixes.
                </h1>
                <p className="landing-copy">
                  LarkOps AI reproduces failures, explains root causes, generates regression tests,
                  verifies patches, and prepares review-ready PRs with Lark as the replayable workflow layer.
                </p>
                <div className="landing-actions">
                  <button className="glass-cta" onClick={launchDemo} type="button">
                    Launch Demo Investigation
                    <span>
                      <Download size={17} />
                    </span>
                  </button>
                  <button className="glass-secondary" onClick={() => setPage('dashboard')} type="button">
                    View command center
                    <ArrowRight size={17} />
                  </button>
                </div>
                <div className="landing-pills">
                  <span className="liquid-glass">Real Lark execution</span>
                  <span className="liquid-glass">Gemini analysis</span>
                  <span className="liquid-glass">Regression gates</span>
                </div>
              </div>

              <div className="landing-quote">
                <span>REPRODUCIBLE INVESTIGATION</span>
                <p>
                  Every failure should leave behind a <em>replayable</em> engineering record.
                </p>
                <div>
                  <i />
                  <strong>LARKOPS AI</strong>
                  <i />
                </div>
              </div>
            </div>
          </section>

          <aside className="landing-right">
            <div className="landing-right-top">
              <button className="account-glass liquid-glass" onClick={() => setPage('settings')} type="button">
                <Sparkles size={17} />
                Live integrations
              </button>
            </div>

            <div className="ecosystem-card liquid-glass">
              <h3>Enter the failure room</h3>
              <p>
                Route CI logs, failing tests, and issue reports into one replayable Lark workflow.
              </p>
            </div>

            <div className="landing-feature-stack liquid-glass-strong">
              <div className="mini-card-row">
                <article className="mini-card liquid-glass">
                  <span>
                    <Wand2 size={18} />
                  </span>
                  <h3>Processing</h3>
                  <p>Agents classify logs, drift, blast radius, and patch confidence.</p>
                </article>
                <article className="mini-card liquid-glass">
                  <span>
                    <BookOpen size={18} />
                  </span>
                  <h3>Failure memory</h3>
                  <p>Similar incidents are linked before the PR is drafted.</p>
                </article>
              </div>
              <article className="wide-card liquid-glass">
                <div className="video-thumb">
                  <Terminal size={22} />
                </div>
                <div>
                  <h3>Lark replay generated</h3>
                  <p>Workflow ID, execution ID, terminal logs, timeline, and PR context stay attached.</p>
                </div>
                <button onClick={launchDemo} type="button" aria-label="Open demo investigation">
                  +
                </button>
              </article>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function Dashboard({ setPage }: { setPage: (page: Page) => void }) {
  const metrics = [
    ['Total investigations', '128', <Search />],
    ['Failures reproduced', '94', <Terminal />],
    ['Fixes verified', '61', <BadgeCheck />],
    ['Regression tests generated', '73', <FileCode />],
    ['Lark workflow events', '1,842', <Workflow />],
    ['Engineering hours saved', '386', <TimerReset />],
  ]

  return (
    <main className="page">
      <PageHeader
        kicker="Command center"
        title="Failure investigations"
        description="Recent CI, issue, and dependency failures routed through LarkOps workflows."
        action={
          <button className="primary" onClick={() => setPage('new')} type="button">
            <Zap size={17} />
            New investigation
          </button>
        }
      />
      <section className="metric-grid">
        {metrics.map(([label, value, icon]) => (
          <article className="metric-card" key={label as string}>
            <span>{icon}</span>
            <strong>{value as string}</strong>
            <small>{label as string}</small>
          </article>
        ))}
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent investigations</h2>
            <p>Sorted by active engineering impact and Lark replay readiness.</p>
          </div>
          <button className="ghost-button" onClick={() => setPage('investigation')} type="button">
            Open featured case
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="investigation-list">
          {investigations.map((item) => (
            <button className="investigation-row" key={item.id} onClick={() => setPage('investigation')} type="button">
              <div className="row-main">
                <span className="id-pill">{item.id}</span>
                <h3>{item.title}</h3>
                <p>{item.failingTest}</p>
                <small>
                  <GitBranch size={14} />
                  {item.repo} · {item.branch} · {item.commit}
                </small>
              </div>
              <div className="row-meta">
                <Status label={item.status} tone={item.status.includes('Verified') ? 'good' : 'warn'} />
                <span>{item.confidence}% confidence</span>
                <RiskLabel risk={item.risk} />
                <span>{item.source}</span>
                <span className="lark-mini">
                  <Workflow size={14} />
                  {item.larkStatus}
                </span>
                <span>{item.updated}</span>
              </div>
              <div className="classifier">
                <Radar size={14} />
                {item.classifier}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

function NewInvestigation({
  formStatus,
  setFormStatus,
  setPage,
  launchDemo,
}: {
  formStatus: string
  setFormStatus: (status: string) => void
  setPage: (page: Page) => void
  launchDemo: () => void
}) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus('Queued through Lark workflow')
    launchDemo()
  }

  return (
    <main className="page">
      <PageHeader
        kicker="New investigation"
        title="Create a replayable failure workflow"
        description="Paste a failing test, CI log, or issue description. LarkOps will create the workflow envelope and start the investigation."
      />
      <form className="new-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            GitHub repository URL
            <input defaultValue="https://github.com/demo-commerce/api" />
          </label>
          <label>
            Branch
            <input defaultValue="main" />
          </label>
          <label>
            Commit SHA
            <input defaultValue="8f4c91a" />
          </label>
          <label>
            Failing test name
            <input defaultValue="auth.middleware.test.ts > returns display name for authenticated user" />
          </label>
        </div>
        <label>
          CI log
          <textarea defaultValue={'TypeError: Cannot read properties of null (reading "name")\n  at displayNameForUser src/auth/display-name.ts:20:23'} />
        </label>
        <label>
          Issue description
          <textarea defaultValue="Authenticated requests fail for users created before profile backfill completes. Repro appears tied to auth middleware display name resolution." />
        </label>
        <div className="toggle-grid">
          <label className="check-row">
            <input type="checkbox" defaultChecked />
            Generate regression tests
          </label>
          <label className="check-row">
            <input type="checkbox" defaultChecked />
            Create PR preview
          </label>
          <label className="check-row">
            <input type="checkbox" defaultChecked />
            Use Lark MCP workflow mode
          </label>
        </div>
        <div className="form-footer">
          <span>
            <Circle size={12} />
            {formStatus}
          </span>
          <div>
            <button className="secondary" onClick={() => setPage('dashboard')} type="button">
              Cancel
            </button>
            <button className="primary" type="submit">
              <Play size={17} />
              Start Lark investigation
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}

function InvestigationDetail({
  activeStep,
  isRunning,
  launchDemo,
  providerMode,
  larkWorkflowId,
  larkExecutionId,
}: {
  activeStep: number
  isRunning: boolean
  launchDemo: () => void
  providerMode: string
  larkWorkflowId: string
  larkExecutionId: string
}) {
  const visibleEvents = useMemo(() => larkEvents.slice(0, Math.max(1, activeStep - 3)), [activeStep])
  const current = investigations[0]

  return (
    <main className="page investigation-page">
      <section className="investigation-header">
        <div>
          <span className="section-kicker">Investigation {current.id}</span>
          <h1>{current.title}</h1>
          <div className="header-meta">
            <span>
              <GitBranch size={15} />
              {current.repo}
            </span>
            <span>
              <GitBranch size={15} />
              {current.branch}
            </span>
            <span>
              <Code2 size={15} />
              {current.commit}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Status label={isRunning ? 'Investigating' : current.status} tone={isRunning ? 'info' : 'good'} />
          <div className="score-ring">{isRunning ? Math.min(93, 45 + activeStep * 5) : 93}%</div>
          <RiskLabel risk={current.risk} />
          <button className="secondary" type="button">
            Create PR
          </button>
          <button className="primary" onClick={launchDemo} type="button">
            <RefreshCw size={17} />
            Run investigation
          </button>
        </div>
      </section>

      <section className="summary-strip">
        <InfoChip label="Failing test" value={current.failingTest} />
        <InfoChip label="Failure class" value="Deterministic code regression" />
        <InfoChip label="Lark workflow" value={larkWorkflowId} />
        <InfoChip label="Lark execution" value={larkExecutionId} />
        <InfoChip label="AI provider" value={providerMode} />
      </section>

      <div className="detail-grid">
        <WorkflowTimeline activeStep={activeStep} />
        <TerminalPanel />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Multi-agent investigation</h2>
            <p>Specialized agents convert noisy logs into evidence-backed engineering decisions.</p>
          </div>
          <Status label="All agents complete" tone="good" />
        </div>
        <div className="agent-grid">
          {agents.map((agent) => (
            <article className="agent-card" key={agent.name}>
              <div className="agent-top">
                <span>
                  <Bot size={17} />
                  {agent.name}
                </span>
                <strong>{agent.confidence}%</strong>
              </div>
              <Status label={agent.status} tone="good" />
              <h3>{agent.finding}</h3>
              <p>{agent.explanation}</p>
              <small>{agent.evidence}</small>
            </article>
          ))}
        </div>
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>Root cause explanation</h2>
          <p className="root-copy">
            The failure is caused by a null dereference in the display name helper. The function
            assumes <code>user.profile</code> is always present, but the new fixture creates
            authenticated users without profile records. The test exposes a real edge case that
            could occur in production when profile creation fails or is delayed.
          </p>
          <div className="memory-panel">
            <h3>Failure memory</h3>
            <p>Similar to Failure #014: null profile fixture caused auth helper crash.</p>
            <p>Similar to Failure #077: delayed account provisioning left profile relation empty.</p>
          </div>
        </section>
        <section className="panel">
          <h2>Blast radius analysis</h2>
          <RiskTable />
        </section>
      </div>

      <div className="two-column code-columns">
        <CodePanel title="Proposed patch" code={patch} note="Safe because it changes display formatting only; token verification, authorization, session handling, and database writes are untouched." />
        <CodePanel title="Regression test" code={regressionTest} note="Prevents the crash from returning by covering authenticated users without profile records." />
      </div>

      <div className="two-column">
        <VerificationPanel />
        <ConfidenceGate />
      </div>

      <div className="two-column">
        <LarkUsageEvents events={visibleEvents} />
        <PostmortemPanel />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>PR preview</h2>
            <p>Generated summary for a review-ready pull request.</p>
          </div>
          <button className="ghost-button" type="button">
            <ExternalLink size={16} />
            Open draft
          </button>
        </div>
        <pre className="pr-preview">{prPreview}</pre>
      </section>
    </main>
  )
}

function WorkflowTimeline({ activeStep }: { activeStep: number }) {
  return (
    <section className="panel timeline-panel">
      <div className="panel-head">
        <div>
          <h2>Workflow timeline</h2>
          <p>Lark execution timeline with workflow events and investigation checkpoints.</p>
        </div>
        <Status label="Lark MCP active" tone="info" />
      </div>
      <div className="timeline">
        {timeline.map((step, index) => {
          const state = index < activeStep ? 'done' : index === activeStep ? 'active' : 'pending'
          return (
            <article className={`timeline-step ${state}`} key={step.event}>
              <div className="timeline-marker">{state === 'done' ? <CheckCircle2 size={15} /> : <Circle size={12} />}</div>
              <div>
                <span>{step.time}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
                <small>{step.event}</small>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function TerminalPanel() {
  return (
    <section className="panel terminal-panel">
      <div className="panel-head">
        <div>
          <h2>Terminal logs</h2>
          <p>Reproduction, Lark workflow messages, stack trace, and verification output.</p>
        </div>
        <span className="terminal-led">live</span>
      </div>
      <pre>{terminalLog}</pre>
    </section>
  )
}

function VerificationPanel() {
  const items = [
    ['Original failure reproduced', '2 of 2 Lark executions failed with identical stack trace'],
    ['Patch applied', 'displayNameForUser uses optional chaining and fallback'],
    ['Regression test added', 'Profile-less authenticated user path covered'],
    ['Test suite rerun', 'auth.middleware.test.ts and display-name.test.ts passed'],
    ['Confidence updated', 'Raised from 71% to 93% after verification'],
  ]
  return (
    <section className="panel">
      <h2>Verification</h2>
      <div className="checklist">
        {items.map(([title, detail]) => (
          <div className="check-item" key={title}>
            <CheckCircle2 size={18} />
            <div>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ConfidenceGate() {
  const reasons = [
    'failure reproduced deterministically',
    'stack trace maps directly to changed line',
    'regression test covers the edge case',
    'fix passes verification',
    'no security-critical behavior changed',
  ]
  return (
    <section className="panel confidence-panel">
      <h2>Confidence gate</h2>
      <div className="confidence-number">93%</div>
      <div className="reason-list">
        {reasons.map((reason) => (
          <span key={reason}>
            <CheckCircle2 size={15} />
            {reason}
          </span>
        ))}
      </div>
      <div className="decision">Safe to create review-ready PR.</div>
    </section>
  )
}

function LarkUsageEvents({ events }: { events: string[][] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Lark usage events</h2>
          <p>Workflow events recorded for replay, audit, and PR context.</p>
        </div>
        <Workflow size={20} />
      </div>
      <div className="event-table">
        {events.map(([id, time, workflowName, investigationId, eventName, status]) => (
          <div className="event-row" key={id}>
            <span>{id}</span>
            <span>{time}</span>
            <span>{workflowName}</span>
            <span>{investigationId}</span>
            <span>{eventName}</span>
            <Status label={status} tone="good" />
          </div>
        ))}
      </div>
    </section>
  )
}

function PostmortemPanel() {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Postmortem export</h2>
          <p>Incident summary generated from the replayable investigation record.</p>
        </div>
        <FileText size={20} />
      </div>
      <pre className="postmortem">{postmortem}</pre>
    </section>
  )
}

function SettingsPage({
  providerMode,
  geminiApiKey,
  geminiModel,
  larkWorkflowId,
  larkWorkflowStatus,
  larkExecutionId,
  larkCliVerified,
}: {
  providerMode: string
  geminiApiKey?: string
  geminiModel: string
  larkWorkflowId: string
  larkWorkflowStatus: string
  larkExecutionId: string
  larkCliVerified: boolean
}) {
  const [geminiStatus, setGeminiStatus] = useState(
    geminiApiKey ? 'Ready to test Gemini connection.' : 'Add VITE_GEMINI_API_KEY to use Gemini mode.',
  )
  const [geminiTestState, setGeminiTestState] = useState<'idle' | 'testing' | 'passed' | 'failed'>('idle')

  const testGemini = async () => {
    if (!geminiApiKey) {
      setGeminiTestState('failed')
      setGeminiStatus('No Gemini API key is configured. Demo mode remains available.')
      return
    }

    setGeminiTestState('testing')
    setGeminiStatus('Calling Gemini generateContent with a compact investigation prompt...')

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      'You are validating LarkOps AI. In one concise sentence, classify this failure: TypeError reading user.profile.name when an authenticated user has no profile.',
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 80,
              temperature: 0.2,
            },
          }),
        },
      )

      if (!response.ok) {
        let detail = ''
        try {
          const errorBody = await response.json()
          detail = errorBody?.error?.message ? ` ${errorBody.error.message}` : ''
        } catch {
          detail = ''
        }

        if (response.status === 429) {
          throw new Error(
            'Gemini is reachable, but this key is currently quota or rate limited. LarkOps will keep using deterministic demo outputs.',
          )
        }

        if (response.status === 403) {
          throw new Error('Gemini rejected this key or project access. Check that the API key is enabled for Gemini API.')
        }

        throw new Error(`Gemini returned HTTP ${response.status}.${detail}`)
      }

      const data = await response.json()
      const text =
        data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).join(' ') ??
        'Gemini responded successfully.'

      setGeminiTestState('passed')
      setGeminiStatus(text.trim())
    } catch (error) {
      setGeminiTestState('failed')
      setGeminiStatus(error instanceof Error ? error.message : 'Gemini connection test failed.')
    }
  }

  return (
    <main className="page">
      <PageHeader
        kicker="Settings"
        title="Integration status"
        description="Real credentials are optional for the hackathon demo. Demo mode stays deterministic and complete."
      />
      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="settings-title">
            <Workflow size={24} />
            <div>
              <h2>Lark</h2>
              <p>Workflow and execution layer for reproducible investigations.</p>
            </div>
          </div>
          <ConfigRow label="Lark CLI status" value="Detected through getlark/npx workflow commands" tone="good" />
          <ConfigRow
            label="Lark authentication"
            value={larkCliVerified ? 'GETLARK_API_KEY verified by CLI' : 'Demo replay mode'}
            tone={larkCliVerified ? 'good' : 'warn'}
          />
          <ConfigRow label="Live workflow ID" value={larkWorkflowId} tone="info" />
          <ConfigRow label="Workflow generation" value={larkWorkflowStatus} tone={larkWorkflowStatus === 'generating' ? 'warn' : 'good'} />
          <ConfigRow label="Last execution ID" value={larkExecutionId} tone="good" />
          <ConfigRow label="Lark MCP status" value="Workflow mode enabled for investigation envelopes" tone="good" />
          <ConfigRow label="Workflow event status" value="Capturing investigation.started through pr.preview.generated" tone="good" />
          <button className="secondary" type="button">
            <Activity size={17} />
            Test Lark connection
          </button>
        </section>
        <section className="panel settings-panel">
          <div className="settings-title">
            <BrainCircuit size={24} />
            <div>
              <h2>Gemini</h2>
              <p>Default AI provider for analysis and engineering output generation.</p>
            </div>
          </div>
          <ConfigRow label="Gemini API status" value={providerMode === 'Gemini mode' ? 'Connected' : 'Missing API key'} tone={providerMode === 'Gemini mode' ? 'good' : 'warn'} />
          <ConfigRow label="Model name" value={geminiModel} tone="info" />
          <ConfigRow label="Fallback behavior" value="Deterministic demo mode produces complete outputs without an API key" tone="good" />
          <ConfigRow label="Environment variable" value="VITE_GEMINI_API_KEY" tone="info" />
          <div className={`connection-result ${geminiTestState}`}>
            <strong>Connection test</strong>
            <p>{geminiStatus}</p>
          </div>
          <button className="secondary" onClick={testGemini} type="button">
            <KeyRound size={17} />
            {geminiTestState === 'testing' ? 'Testing Gemini...' : 'Test Gemini connection'}
          </button>
        </section>
      </div>
    </main>
  )
}

function RiskTable() {
  const rows = [
    ['Touched modules', 'src/auth/display-name.ts, auth middleware tests'],
    ['Affected routes', 'Authenticated account and viewer routes'],
    ['Possible side effects', 'Fallback display name may appear for pending profiles'],
    ['Security risk', 'Low: no auth decision logic changed'],
    ['Data risk', 'Low: no writes or migrations'],
    ['Regression risk', 'Medium: auth-adjacent display behavior'],
    ['Recommended review level', 'Auth platform owner approval'],
  ]
  return (
    <div className="risk-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function CodePanel({ title, code, note }: { title: string; code: string; note: string }) {
  return (
    <section className="panel code-panel">
      <h2>{title}</h2>
      <pre>{code}</pre>
      <p>{note}</p>
    </section>
  )
}

function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <section className="page-header">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </section>
  )
}

function Status({ label, tone }: { label: string; tone: 'good' | 'warn' | 'info' }) {
  return <span className={`status ${tone}`}>{label}</span>
}

function RiskLabel({ risk }: { risk: 'Low' | 'Medium' | 'High' }) {
  return <span className={`risk risk-${risk.toLowerCase()}`}>{risk} risk</span>
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ConfigRow({ label, value, tone }: { label: string; value: string; tone: 'good' | 'warn' | 'info' }) {
  return (
    <div className="config-row">
      <span>{label}</span>
      <strong>{value}</strong>
      <Status label={tone === 'good' ? 'ready' : tone === 'warn' ? 'demo' : 'info'} tone={tone} />
    </div>
  )
}

export default App
