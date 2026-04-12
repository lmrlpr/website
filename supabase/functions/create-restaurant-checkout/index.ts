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

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, classGroup, email, phone, starter, main, dessert, drinks, hasAlcohol } = await req.json()

    if (!firstName || !lastName || !classGroup || !email || !starter || !main || !dessert || !drinks) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Porta Nova',
            description: `${firstName} ${lastName} — Dîner Prom Night`,
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ]

    if (hasAlcohol) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Alcool',
            description: 'Cocktail + 1/3 bouteille de vin + 1 Soft + 1 Bière',
          },
          unit_amount: 700,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      metadata: {
        type: 'restaurant_reservation',
        first_name: firstName,
        last_name: lastName,
        class_group: classGroup,
        email,
        phone: phone ?? '',
        starter,
        main,
        dessert,
        drinks,
        has_alcohol: hasAlcohol ? 'true' : 'false',
      },
      success_url: `${SITE_URL}/prom/restaurant?success=1`,
      cancel_url: `${SITE_URL}/prom/restaurant?cancelled=1`,
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
