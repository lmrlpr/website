import Stripe from 'npm:stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'
const ALLOWED_ORIGIN = new URL(SITE_URL).origin  // e.g. https://lmrlpr.github.io

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
    const { firstName, lastName, email } = await req.json()

    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Gotham — Billet Externe',
            description: `${firstName} ${lastName}`,
          },
          unit_amount: 5300,
        },
        quantity: 1,
      }],
      metadata: {
        type: 'gotham_ticket',
        first_name: firstName,
        last_name: lastName,
        email,
        ticket_type: 'external',
      },
      success_url: `${SITE_URL}/prom/gotham?success=1`,
      cancel_url: `${SITE_URL}/prom/gotham?cancelled=1`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
