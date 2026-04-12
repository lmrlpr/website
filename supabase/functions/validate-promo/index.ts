import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'
const ALLOWED_ORIGIN = new URL(SITE_URL).origin

function getCorsHeaders(req: Request) {
  const requestOrigin = req.headers.get('origin') ?? ''
  const allowed = (requestOrigin === 'http://localhost:5173' || requestOrigin === ALLOWED_ORIGIN)
    ? requestOrigin
    : ALLOWED_ORIGIN
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return new Response(JSON.stringify({ valid: false }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const coupons = await stripe.coupons.list({ limit: 100 })
    const match = coupons.data.find((c: { name: string }) => c.name === code.trim().toUpperCase())

    if (match) {
      const discountType = match.percent_off ? 'percent' : 'flat'
      const value = match.percent_off ?? (match.amount_off ? match.amount_off / 100 : 0)
      const label = match.percent_off
        ? `Réduction -${match.percent_off}%`
        : `Réduction -${value} €`

      return new Response(JSON.stringify({ valid: true, discountType, value, label }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    return new Response(JSON.stringify({ valid: false }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch {
    return new Response(JSON.stringify({ valid: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
