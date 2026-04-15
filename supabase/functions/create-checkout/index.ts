import Stripe from 'https://esm.sh/stripe@14?target=deno'

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
    const { items, promoCode, name, email } = await req.json()

    const line_items = items.map((item: {
      productName: string
      price: number
      color: string
      size?: string
      quantity: number
    }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.productName,
          description: [item.color, item.size].filter(Boolean).join(' · '),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      success_url: `${SITE_URL}/merch?success=1`,
      cancel_url: `${SITE_URL}/merch?cancelled=1`,
      metadata: {
        type: 'merch_order',
        name: name ?? '',
        email: email ?? '',
        items: JSON.stringify(items),
        promo_code: promoCode ?? '',
      },
    }

    if (promoCode) {
      const coupons = await stripe.coupons.list({ limit: 100 })
      const match = coupons.data.find(c => c.name === promoCode)
      if (match) {
        sessionParams.discounts = [{ coupon: match.id }]
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

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
