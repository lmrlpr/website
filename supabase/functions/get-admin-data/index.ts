import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { password } = await req.json()

    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const [
      { data: merch_orders },
      { data: gotham_registrations },
      { data: restaurant_reservations },
    ] = await Promise.all([
      supabase.from('merch_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('gotham_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('restaurant_reservations').select('*').order('created_at', { ascending: false }),
    ])

    return new Response(
      JSON.stringify({ merch_orders, gotham_registrations, restaurant_reservations }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
