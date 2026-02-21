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

echo "Android Emulator + Expo health check"
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Test URL: ${TEST_URL}"
echo

if ! command -v adb >/dev/null 2>&1; then
  fail "adb is not available. Install Android SDK platform-tools and add adb to PATH."
  echo
  echo "Summary: ${PASS_COUNT} pass, ${WARN_COUNT} warn, ${FAIL_COUNT} fail"
  exit 1
fi

if ! command -v lsof >/dev/null 2>&1; then
  warn "lsof is not available; skipping Metro port check."
fi

ANDROID_HOME_VAL="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -n "${ANDROID_HOME_VAL}" ]; then
  pass "Android SDK path detected: ${ANDROID_HOME_VAL}"
else
  warn "ANDROID_HOME / ANDROID_SDK_ROOT not set. adb may still work if platform-tools are globally installed."
fi

# Start adb server in case it is not running.
adb start-server >/dev/null 2>&1 || true

BOOTED_SERIAL="$(adb devices | sed -n '2,$p' | awk '$2=="device" {print $1}' | head -n 1)"
if [ -z "${BOOTED_SERIAL}" ]; then
  fail "No running Android emulator/device found in 'adb devices'."
else
  pass "Connected Android target: ${BOOTED_SERIAL}"
fi

if command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:8081 -sTCP:LISTEN >/dev/null 2>&1; then
    pass "Metro is listening on TCP 8081."
  else
    warn "No listener found on TCP 8081. Start Expo with: npx expo start"
  fi
fi

if [ -n "${BOOTED_SERIAL}" ]; then
  # Verify shell access through adb.
  if adb -s "${BOOTED_SERIAL}" shell 'echo ok' >/dev/null 2>&1; then
    pass "adb shell is responsive."
  else
    fail "adb shell is not responsive for ${BOOTED_SERIAL}."
  fi

  # Launch Expo deep link URL (works when Expo Go/development client is present).
  if adb -s "${BOOTED_SERIAL}" shell am start -W -a android.intent.action.VIEW -d "${TEST_URL}" >/dev/null 2>&1; then
    pass "Target accepted ${TEST_URL} via android.intent.action.VIEW."
  else
    fail "Target failed to open ${TEST_URL}."
  fi
fi

echo
echo "Summary: ${PASS_COUNT} pass, ${WARN_COUNT} warn, ${FAIL_COUNT} fail"

if [ "${FAIL_COUNT}" -gt 0 ]; then
  echo "Suggested recovery:"
  echo "  adb kill-server"
  echo "  adb start-server"
  echo "  npx expo start -c"
  echo "  # If no emulator is running, open Android Studio and start an AVD"
  exit 1
fi

exit 0
