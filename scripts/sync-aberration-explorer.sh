#!/usr/bin/env bash
# Regenerate _includes/aberration-visualisation.html from the TEM teaching course widget.
# Usage: scripts/sync-aberration-explorer.sh [path/to/aberration-explorer.html]
# Default source assumes tem-teaching is checked out next to this repo.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-../tem-teaching/03-aberration-correction/widgets/aberration-explorer.html}"
OUT="_includes/aberration-visualisation.html"
COURSE="https://github.com/vivekdevulapalli07/tem-teaching"

{
  echo '<!-- Aberration Explorer. Generated from tem-teaching/03-aberration-correction/widgets/aberration-explorer.html'
  echo '     by scripts/sync-aberration-explorer.sh; edit the course version and rerun the script instead of editing this copy. -->'
  echo '{% raw %}'
  # Keep only the <body> content; scope colour tokens to the widget; drop dark-mode overrides
  # (the site is light-only), the page-level html/body rule and the duplicate <h1>.
  awk '
    /<body>/ {on=1; next}
    /<\/body>/ {on=0}
    !on {next}
    /^  :root \{$/ && !done {print "  .ab-root {"; done=1; next}
    /^  @media \(prefers-color-scheme: dark\) \{$/ {skip=1}
    skip && /^  :root\[data-theme="dark"\] \{$/ {skip=2; next}
    skip==2 && /^  \}$/ {skip=0; next}
    skip {next}
    /^  html, body \{/ {next}
    /<h1>Aberration Explorer<\/h1>/ {next}
    {print}
  ' "$SRC" | sed \
    -e "s#that you met in Chapter 02, now with#that you meet in the <a href=\"$COURSE/tree/main/02-diffraction-physics\">diffraction-physics chapter</a> of the TEM course, now with#" \
    -e "s#(see the multislice lecture in Chapter 02)#(see the <a href=\"$COURSE/tree/main/02-diffraction-physics\">multislice lecture</a> in the TEM course)#" \
    -e "s#^    </ul>\$#    </ul>\n    <p style=\"font-size:0.8rem\">This tool is part of the open <a href=\"$COURSE\">TEM teaching course</a> (Chapter 03, aberration correction), where the source lives.</p>#"
  echo '{% endraw %}'
} > "$OUT"
echo "Wrote $OUT from $SRC"
