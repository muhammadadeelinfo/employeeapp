#!/usr/bin/env bash
set -u

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

if [ "${1:-}" != "" ]; then
  TEST_URL="$1"
else
  TEST_URL="exp://127.0.0.1:8081"
fi

pass() {
  echo "[PASS] $1"
  PASS_COUNT=$((PASS_COUNT + 1))
}

warn() {
  echo "[WARN] $1"
  WARN_COUNT=$((WARN_COUNT + 1))
}

fail() {
  echo "[FAIL] $1"
  FAIL_COUNT=$((FAIL_COUNT + 1))
}

echo "iOS Simulator + Expo health check"
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Test URL: ${TEST_URL}"
echo

if ! command -v xcrun >/dev/null 2>&1; then
  fail "xcrun is not available. Install Xcode command line tools."
  echo
  echo "Summary: ${PASS_COUNT} pass, ${WARN_COUNT} warn, ${FAIL_COUNT} fail"
  exit 1
fi

if ! command -v lsof >/dev/null 2>&1; then
  warn "lsof is not available; skipping Metro port check."
fi

DEVELOPER_DIR="$(xcode-select -p 2>/dev/null || true)"
if [ -n "${DEVELOPER_DIR}" ]; then
  pass "xcode-select points to ${DEVELOPER_DIR}"
else
  fail "xcode-select has no active developer directory."
fi

BOOTED_UDID="$(xcrun simctl list devices available | sed -n 's/.*(\([0-9A-Fa-f-]*\)) (Booted).*/\1/p' | head -n 1)"
if [ -z "${BOOTED_UDID}" ]; then
  CANDIDATE_UDID="$(xcrun simctl list devices available | sed -n 's/.*iPhone.*(\([0-9A-Fa-f-]*\)) (Shutdown).*/\1/p' | head -n 1)"
  if [ -n "${CANDIDATE_UDID}" ]; then
    if xcrun simctl boot "${CANDIDATE_UDID}" >/dev/null 2>&1; then
      # Ensure the boot sequence is complete before checking apps/openurl.
      xcrun simctl bootstatus "${CANDIDATE_UDID}" -b >/dev/null 2>&1 || true
      BOOTED_UDID="${CANDIDATE_UDID}"
      pass "Booted simulator automatically: ${BOOTED_UDID}"
    else
      fail "No booted simulator found and failed to boot ${CANDIDATE_UDID}."
    fi
  else
    fail "No booted simulator device found."
  fi
else
  pass "Booted simulator UDID: ${BOOTED_UDID}"
fi

if [ -n "${BOOTED_UDID}" ]; then
  if xcrun simctl listapps "${BOOTED_UDID}" 2>/dev/null | grep -q '"host.exp.Exponent"'; then
    pass "Expo Go is installed on booted simulator."
  else
    warn "Expo Go (host.exp.Exponent) not found on booted simulator."
  fi
fi

if command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:8081 -sTCP:LISTEN >/dev/null 2>&1; then
    pass "Metro is listening on TCP 8081."
  else
    warn "No listener found on TCP 8081. Start Expo with: npx expo start"
  fi
fi

if [ -n "${BOOTED_UDID}" ]; then
  if xcrun simctl openurl "${BOOTED_UDID}" "https://expo.dev" >/dev/null 2>&1; then
    pass "Simulator can open https URL via simctl openurl."
  else
    fail "Simulator failed to open https URL via simctl openurl."
  fi

  if xcrun simctl openurl "${BOOTED_UDID}" "${TEST_URL}" >/dev/null 2>&1; then
    pass "Simulator accepted ${TEST_URL} via simctl openurl."
  else
    fail "Simulator failed to open ${TEST_URL} via simctl openurl."
  fi
fi

echo
echo "Summary: ${PASS_COUNT} pass, ${WARN_COUNT} warn, ${FAIL_COUNT} fail"

if [ "${FAIL_COUNT}" -gt 0 ]; then
  echo "Suggested recovery:"
  echo "  xcrun simctl shutdown all"
  echo "  killall Simulator"
  echo "  open -a Simulator"
  echo "  npx expo start -c"
  exit 1
fi

exit 0
