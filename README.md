# LarkOps AI

LarkOps AI turns broken CI into verified fixes.

It is a polished hackathon demo for the Lark sponsor challenge at DevNetwork AI + ML Hackathon 2026. The product presents an autonomous debugging workflow where Lark CLI/MCP acts as the execution and replay layer for failure investigations.

## What It Shows

- Landing page with the product story and "Launch Demo Investigation" path
- Command-center dashboard for recent software failures
- New investigation flow for CI logs, failing tests, branches, commits, and issue context
- Detailed investigation page with Lark workflow timeline, terminal logs, agents, patch, regression test, verification, confidence gate, PR preview, failure memory, Lark events, and postmortem export
- Settings page for Lark CLI/MCP status and Gemini status
- Deterministic demo mode when no API keys are configured

## Sponsor Fit

Lark is central to the product story. The UI exposes:

- Lark workflow status
- Lark MCP workflow mode
- Lark replay link
- Lark event IDs
- Lark execution timeline
- Lark-powered reproduction step
- Lark usage events
- Lark investigation metadata
- Real Lark CLI workflow creation and invocation through `GETLARK_API_KEY`

The verified real workflow is:

```bash
npx -y @getlark/cli workflows invoke --workflow-ids wflw_sEkzdOqOLAutmd5dXsbxUkua --wait --verbose
```

The app still has deterministic demo outputs so judges can experience the product without credentials, but this workspace has also been verified against a real Lark CLI workflow.

## AI Provider

Gemini is the default AI provider. If `VITE_GEMINI_API_KEY` is present, the app labels itself as Gemini mode. Without it, the app runs in deterministic demo/mock mode and still produces high-quality investigation outputs.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually:

```text
http://127.0.0.1:5173/
```

If that port is busy, Vite will print the next available port.

## Build

```bash
npm run build
npm run lint
```

## Optional Environment

Create `.env.local` if you want the UI to show Gemini mode:

```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_GEMINI_MODEL=gemini-2.0-flash
VITE_LARK_WORKFLOW_ID=wflw_sEkzdOqOLAutmd5dXsbxUkua
VITE_LARK_WORKFLOW_STATUS=success
VITE_LARK_EXECUTION_ID=wflw_exec_i8dNNfBsn0p1gvgkIgA8wwdp
VITE_LARK_CLI_VERIFIED=true
GETLARK_API_KEY=your_lark_key_here
```

Real Lark credentials are not required for the demo path, but `GETLARK_API_KEY` enables CLI-backed workflow verification.

## Lark Verification

The current demo workflow was created, generated, and invoked with the real Lark CLI.

```text
Workflow ID: wflw_sEkzdOqOLAutmd5dXsbxUkua
Last execution ID: wflw_exec_i8dNNfBsn0p1gvgkIgA8wwdp
Last execution result: success
```
