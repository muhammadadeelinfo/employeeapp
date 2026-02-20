#!/usr/bin/env node

const path = require('path');
const { config } = require('dotenv');

config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'DATABASE_URL', 'DIRECT_URL'];
const urlEnv = ['SUPABASE_URL', 'DATABASE_URL', 'DIRECT_URL'];

const missing = requiredEnv.filter((key) => !process.env[key]);

const looksLikeSupabaseKey = (value) =>
  typeof value === 'string' &&
  (value.startsWith('sb_publishable_') ||
    value.startsWith('sb_secret_') ||
    value.startsWith('eyJ'));

const parseHostname = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
};

const expectedSupabaseHost = parseHostname(process.env.SUPABASE_URL);
const hasSupabaseHost = (value) =>
  typeof value === 'string' && (!expectedSupabaseHost || value.includes(expectedSupabaseHost));

console.log('Supabase/Postgres configuration check');
console.log('-------------------------------------');
requiredEnv.forEach((key) => {
  const value = process.env[key];
  const status = value ? 'FOUND' : 'MISSING';
  let note = '';

  if (!value) {
    note = '';
  } else if (urlEnv.includes(key)) {
    note = hasSupabaseHost(value)
      ? ''
      : ' (not pointing to the SUPABASE_URL host)';
  } else if (key.endsWith('_KEY')) {
    note = looksLikeSupabaseKey(value) ? '' : ' (unexpected key format)';
  }

  console.log(`${key}: ${status}${note}`);
});

if (missing.length > 0) {
  console.log('\nMissing required env vars:', missing.join(', '));
  process.exitCode = 1;
} else {
  const urlsPointToSupabase = urlEnv.every((key) => hasSupabaseHost(process.env[key]));
  if (!urlsPointToSupabase) {
    console.log('\nWarning: one or more URL values do not reference the SUPABASE_URL host.');
    process.exitCode = 1;
  } else {
    console.log('\nAll required env vars are present and URL values point to the configured Supabase host.');
  }
}
