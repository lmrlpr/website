import Stripe from 'npm:stripe'

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

const PRICE_MAP: Record<string, number> = {
  eleve: 1500,
  prof: 3500,
  plus_un: 3500,
}

const NAME_MAP: Record<string, string> = {
  eleve: 'Gotham — Élève de Première',
  prof: 'Gotham — Professeur',
  plus_un: 'Gotham — +1 Invité',
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, ticketType } = await req.json()

    if (!firstName || !lastName || !email || !ticketType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const unitAmount = PRICE_MAP[ticketType]
    const productName = NAME_MAP[ticketType]

    if (!unitAmount || !productName) {
      return new Response(JSON.stringify({ error: 'Invalid ticket type' }), {
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
            name: productName,
            description: `${firstName} ${lastName}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }],
      metadata: {
        type: 'gotham_ticket',
        first_name: firstName,
        last_name: lastName,
        email,
        ticket_type: ticketType,
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
