#!/usr/bin/env bash
# Usage: ./supabase/migrate.sh <migration_file.sql>
# Example: ./supabase/migrate.sh supabase/migrations/002_add_column.sql
#
# Requires:
#   SUPABASE_PROJECT_REF  — project ref (from your Supabase URL)
#   SUPABASE_ACCESS_TOKEN — from Supabase Dashboard → Account → Access Tokens

set -e

MIGRATION_FILE="${1}"
PROJECT_REF="${SUPABASE_PROJECT_REF:-igsclbjwpbjgqzsshwyn}"
ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN}"

if [[ -z "$MIGRATION_FILE" ]]; then
  echo "Usage: $0 <migration_file.sql>"
  exit 1
fi

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "Error: SUPABASE_ACCESS_TOKEN is not set"
  echo "Set it with: export SUPABASE_ACCESS_TOKEN=sbp_..."
  exit 1
fi

if [[ ! -f "$MIGRATION_FILE" ]]; then
  echo "Error: File not found: $MIGRATION_FILE"
  exit 1
fi

echo "→ Applying migration: $MIGRATION_FILE"

RESPONSE=$(cat "$MIGRATION_FILE" | jq -Rs '{query: .}' | curl -s -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @-)

if echo "$RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
  echo "❌ Migration failed:"
  echo "$RESPONSE" | jq -r '.message'
  exit 1
else
  echo "✅ Migration applied successfully"
fi
