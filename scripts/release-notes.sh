#!/usr/bin/env bash
# Stampa le note di una versione prese da CHANGELOG.md e controlla che la versione
# coincida con quella in src/version.js.
#
# Uso: scripts/release-notes.sh 0.9.1    (anche "v0.9.1")
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:?versione mancante}"
VERSION="${VERSION#v}"

APP_VERSION="$(sed -n "s/.*app: '\([^']*\)'.*/\1/p" src/version.js)"
if [[ "$APP_VERSION" != "$VERSION" ]]; then
  echo "La versione del tag ($VERSION) non coincide con src/version.js ($APP_VERSION)" >&2
  exit 1
fi

NOTES="$(awk -v v="$VERSION" '
  index($0, "## [" v "]") == 1 { on = 1; next }
  on && /^## \[/ { exit }
  on && /^\[[0-9]/ { exit }
  on { print }
' CHANGELOG.md)"

if [[ -z "${NOTES//[[:space:]]/}" ]]; then
  echo "Nessuna nota per la versione $VERSION in CHANGELOG.md" >&2
  exit 1
fi
printf '%s\n' "$NOTES"
