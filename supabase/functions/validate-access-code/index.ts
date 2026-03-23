const ORIGIN = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'
const ACCESS_CODE = Deno.env.get('RESTAURANT_ACCESS_CODE') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code } = await req.json()
    const valid = typeof code === 'string' && code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()

    return new Response(JSON.stringify({ valid }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch {
    return new Response(JSON.stringify({ valid: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
