#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}
ENV_FILE="${ENV_FILE:-$PROJECT_ROOT/.env.local}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
fi

if command -v supabase >/dev/null 2>&1; then
  SUPABASE_CLI=(supabase)
elif command -v npx >/dev/null 2>&1; then
  SUPABASE_CLI=(npx -y supabase@latest)
else
  echo "supabase CLI를 찾을 수 없습니다. Homebrew 설치 또는 Node/npx 사용 환경을 확인하세요."
  echo "설치: https://supabase.com/docs/guides/cli"
  exit 1
fi

PROJECT_REF=${SUPABASE_PROJECT_REF:-""}
if [ -z "$PROJECT_REF" ]; then
  if [ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ]; then
    echo "SUPABASE_PROJECT_REF 또는 NEXT_PUBLIC_SUPABASE_URL이 필요합니다."
    exit 1
  fi

  PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed 's#https://##' | sed 's/.supabase.co//')
fi

echo "Target Project Ref: $PROJECT_REF"

OPENAI_API_KEY_VAL=${OPENAI_API_KEY:-}
if [ -z "$OPENAI_API_KEY_VAL" ]; then
  read -r -p "OPENAI_API_KEY (입력 안 하면 중단): " -s OPENAI_API_KEY_VAL
  echo
fi
if [ -z "${OPENAI_API_KEY_VAL:-}" ]; then
  echo "OPENAI_API_KEY가 비어 있습니다."
  exit 1
fi

FUNCTION_INVOKE_TOKEN_VAL=${FUNCTION_INVOKE_TOKEN:-${SUPABASE_SERVICE_ROLE_KEY:-}}
if [ -z "$FUNCTION_INVOKE_TOKEN_VAL" ]; then
  read -r -p "FUNCTION_INVOKE_TOKEN (입력 안 하면 중단): " -s FUNCTION_INVOKE_TOKEN_VAL
  echo
fi
if [ -z "${FUNCTION_INVOKE_TOKEN_VAL:-}" ]; then
  echo "FUNCTION_INVOKE_TOKEN 또는 SUPABASE_SERVICE_ROLE_KEY가 필요합니다."
  exit 1
fi

OPENAI_IMAGE_MODEL=${OPENAI_IMAGE_MODEL:-gpt-image-1}
OPENAI_IMAGE_SIZE=${OPENAI_IMAGE_SIZE:-1024x1024}
OPENAI_IMAGE_QUALITY=${OPENAI_IMAGE_QUALITY:-auto}
OPENAI_IMAGE_BACKGROUND=${OPENAI_IMAGE_BACKGROUND:-auto}

${SUPABASE_CLI[@]} secrets set OPENAI_API_KEY="$OPENAI_API_KEY_VAL" --project-ref "$PROJECT_REF"
${SUPABASE_CLI[@]} secrets set FUNCTION_INVOKE_TOKEN="$FUNCTION_INVOKE_TOKEN_VAL" --project-ref "$PROJECT_REF"
${SUPABASE_CLI[@]} secrets set OPENAI_IMAGE_MODEL="$OPENAI_IMAGE_MODEL" --project-ref "$PROJECT_REF"
${SUPABASE_CLI[@]} secrets set OPENAI_IMAGE_SIZE="$OPENAI_IMAGE_SIZE" --project-ref "$PROJECT_REF"
${SUPABASE_CLI[@]} secrets set OPENAI_IMAGE_QUALITY="$OPENAI_IMAGE_QUALITY" --project-ref "$PROJECT_REF"
${SUPABASE_CLI[@]} secrets set OPENAI_IMAGE_BACKGROUND="$OPENAI_IMAGE_BACKGROUND" --project-ref "$PROJECT_REF"

${SUPABASE_CLI[@]} functions deploy generate-image --project-ref "$PROJECT_REF"

echo "배포 완료"
