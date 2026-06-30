#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

DEPLOY_HOST="${DEPLOY_HOST:-macbookpro-server}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/melke}"
DEPLOY_TARGET="${DEPLOY_HOST}:${DEPLOY_PATH%/}/"
DRY_RUN="${DRY_RUN:-0}"
printf -v REMOTE_DEPLOY_PATH "%q" "${DEPLOY_PATH}"

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

required_commands=(ssh rsync mktemp)
for command_name in "${required_commands[@]}"; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Missing required command: ${command_name}" >&2
    exit 1
  fi
done

site_files=(
  index.html
  style.css
  pages.css
  about.css
  contact.css
  project.css
  mobile.css
  textrepellant.js
  image-animation.js
  game.js
  corners-animation.js
  hide-and-seek.js
  cube.js
  favicon.svg
  favicon-32.png
  favicon-180.png
  cursor.svg
  backgroundNoise.gif
  explosion.gif
  profileprint.jpg
  profilewater.jpg
  asmara.jpg
  zuerich.jpg
)

tmp_dir="$(mktemp -d)"
build_dir="${tmp_dir}/site"
trap 'rm -rf "${tmp_dir}"' EXIT
mkdir -p "${build_dir}"

for file in "${site_files[@]}"; do
  source_file="${ROOT_DIR}/${file}"
  target_file="${build_dir}/${file}"

  if [[ ! -f "${source_file}" ]]; then
    echo "Missing deploy file: ${file}" >&2
    exit 1
  fi

  mkdir -p "$(dirname "${target_file}")"
  cp "${source_file}" "${target_file}"
done

rsync_args=(
  -az
  --delete
  --delete-delay
  --human-readable
  --itemize-changes
)

if [[ "${DRY_RUN}" == "1" ]]; then
  rsync_args+=(--dry-run)
  echo "Dry run: no files will be changed."
fi

echo "Deploy source: ${build_dir}/"
echo "Deploy target: ${DEPLOY_TARGET}"

if [[ "${DRY_RUN}" == "1" ]]; then
  ssh "${DEPLOY_HOST}" "test -d ${REMOTE_DEPLOY_PATH}"
else
  ssh "${DEPLOY_HOST}" "mkdir -p ${REMOTE_DEPLOY_PATH}"
fi

rsync "${rsync_args[@]}" "${build_dir}/" "${DEPLOY_TARGET}"

echo "Deploy finished."
