#!/usr/bin/env bash
# Copia i file dell'app in una cartella pronta da pubblicare (GitHub Pages o zip della release)
# e inserisce l'identificativo della versione nel service worker e in src/version.js.
#
# Uso: scripts/build-site.sh <cartella-di-destinazione> <identificativo>
set -euo pipefail

OUT="${1:?cartella di destinazione mancante}"
BUILD="${2:?identificativo mancante}"

if ! [[ "$BUILD" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "Identificativo non valido: $BUILD" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R index.html config.js manifest.webmanifest sw.js icons src LICENSE README.md "$OUT"/
touch "$OUT/.nojekyll"

# sed compatibile con macOS e Linux
sed -i.bak "s/const BUILD = 'dev';/const BUILD = '${BUILD}';/" "$OUT/sw.js"
sed -i.bak "s/build: 'dev'/build: '${BUILD}'/" "$OUT/src/version.js"
rm -f "$OUT/sw.js.bak" "$OUT/src/version.js.bak"

grep -q "const BUILD = '${BUILD}';" "$OUT/sw.js"
grep -q "build: '${BUILD}'" "$OUT/src/version.js"
echo "Sito pronto in $OUT (versione $BUILD)"
