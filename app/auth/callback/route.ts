import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth and email confirmation callback route.
 * Supabase redirects here after Google authentication or a Magic Link click.
 *
 * Flow:
 * - Exchanges the `code` for a session
 * - First access (no consultant profile): redirects to /app/registrar/info
 * - Returning access: redirects to the `next` param or /app/dashboard
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/app/entrar?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchange error:', error);
    return NextResponse.redirect(`${origin}/app/entrar?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: consultora } = await supabase
      .from('consultoras')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // First access: the consultant profile does not exist yet.
    if (!consultora) {
      return NextResponse.redirect(`${origin}/app/registrar/info`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
