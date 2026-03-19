#!/usr/bin/env bash

# Deployment and run entrypoint for OBX.
# Replaces all root package.json scripts:
#   npm run test   -> pytest
#   npm run server -> python -m server.app
#   npm run start  -> server + client dev server (concurrently)
#   npm run build  -> pytest + frontend build
#
# Usage: ./deploy.sh [--deploy | --start | --test] [options]

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="${ROOT_DIR}/client"

MODE="deploy"      # deploy | start | test
RUN_BACKEND=true
RUN_FRONTEND=true
SKIP_TESTS=false

usage() {
	cat <<'EOF'
Usage: ./deploy.sh [mode] [options]

Modes (default: --deploy):
  --deploy          Run tests, build frontend, then run deploy commands
  --start           Start backend server and frontend dev server concurrently
                    (replaces: npm run start)
  --test            Run backend tests only
                    (replaces: npm run test)

Options:
  --backend-only    Limit to backend steps only (valid with --deploy)
  --frontend-only   Limit to frontend steps only (valid with --deploy)
  --skip-tests      Skip pytest step (valid with --deploy)
  -h, --help        Show this help message

Environment variables (used with --deploy):
  BACKEND_DEPLOY_CMD   Shell command to deploy the backend  (optional)
  FRONTEND_DEPLOY_CMD  Shell command to deploy the frontend (optional)

Examples:
  ./deploy.sh
  ./deploy.sh --test
  ./deploy.sh --start
  ./deploy.sh --deploy --skip-tests
  ./deploy.sh --deploy --frontend-only
  BACKEND_DEPLOY_CMD="scp -r server user@host:/app" ./deploy.sh --deploy
EOF
}

while [[ $# -gt 0 ]]; do
	case "$1" in
		--deploy)     MODE="deploy"   ;;
		--start)      MODE="start"    ;;
		--test)       MODE="test"     ;;
		--backend-only)
			RUN_BACKEND=true
			RUN_FRONTEND=false
			;;
		--frontend-only)
			RUN_BACKEND=false
			RUN_FRONTEND=true
			;;
		--skip-tests) SKIP_TESTS=true ;;
		-h|--help)    usage; exit 0   ;;
		*)
			echo "Unknown option: $1" >&2
			usage
			exit 1
			;;
	esac
	shift
done

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

run_step() {
	local label="$1"
	shift
	echo ""
	echo "==> ${label}"
	"$@"
}

run_optional_deploy() {
	local label="$1"
	local command="${2:-}"
	echo ""
	echo "==> ${label}"
	if [[ -n "${command}" ]]; then
		bash -lc "${command}"
	else
		echo "No deploy command configured. Set the corresponding environment variable to enable this step."
	fi
}

# ---------------------------------------------------------------------------
# Mode: test  (npm run test)
# ---------------------------------------------------------------------------

run_tests() {
	run_step "Backend tests (pytest)" \
		bash -lc "cd '${ROOT_DIR}' && pytest"
}

# ---------------------------------------------------------------------------
# Mode: start  (npm run start — replaces concurrently)
# ---------------------------------------------------------------------------

run_start() {
	echo ""
	echo "==> Starting backend and frontend development servers"

	# Manually activate venv by prepending its directory to PATH.
	# Avoids sourcing activate directly, which fails on Windows Git Bash
	# when cygpath is unavailable and corrupts PATH.
	if [[ -d "${ROOT_DIR}/.venv/Scripts" ]]; then
		export VIRTUAL_ENV="${ROOT_DIR}/.venv"
		export PATH="${ROOT_DIR}/.venv/Scripts:${PATH}"
	elif [[ -d "${ROOT_DIR}/.venv/bin" ]]; then
		export VIRTUAL_ENV="${ROOT_DIR}/.venv"
		export PATH="${ROOT_DIR}/.venv/bin:${PATH}"
	fi

	# Trap SIGINT/SIGTERM to cleanly kill both child processes
	trap 'echo ""; echo "Stopping servers..."; kill "${server_pid}" "${client_pid}" 2>/dev/null; wait; exit 0' INT TERM

	echo "--> Backend (python -m server.app)"
	(cd "${ROOT_DIR}" && python -m server.app) &
	server_pid=$!

	if [[ ! -d "${CLIENT_DIR}" ]]; then
		echo "Client directory not found at ${CLIENT_DIR}" >&2
		kill "${server_pid}" 2>/dev/null
		exit 1
	fi

	echo "--> Frontend dev server (npm run dev)"
	(cd "${CLIENT_DIR}" && npm run dev) &
	client_pid=$!

	echo ""
	echo "Both servers running. Press Ctrl+C to stop."
	wait "${server_pid}" "${client_pid}"
}

# ---------------------------------------------------------------------------
# Mode: deploy  (npm run build — tests + build + optional push)
# ---------------------------------------------------------------------------

run_deploy() {
	echo "Starting deployment workflow from ${ROOT_DIR}"

	if [[ "${RUN_BACKEND}" == true ]]; then
		if [[ "${SKIP_TESTS}" == false ]]; then
			run_tests
		else
			echo ""
			echo "==> Backend tests"
			echo "Skipped (--skip-tests)"
		fi

		run_optional_deploy "Backend deploy" "${BACKEND_DEPLOY_CMD:-}"
	fi

	if [[ "${RUN_FRONTEND}" == true ]]; then
		if [[ ! -d "${CLIENT_DIR}" ]]; then
			echo "Client directory not found at ${CLIENT_DIR}" >&2
			exit 1
		fi

		run_step "Frontend install (npm ci)" \
			bash -lc "cd '${CLIENT_DIR}' && npm ci"
		run_step "Frontend build (npm run build)" \
			bash -lc "cd '${CLIENT_DIR}' && npm run build"

		run_optional_deploy "Frontend deploy" "${FRONTEND_DEPLOY_CMD:-}"
	fi

	echo ""
	echo "Deployment workflow completed successfully."
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------

case "${MODE}" in
	test)   run_tests  ;;
	start)  run_start  ;;
	deploy) run_deploy ;;
esac
