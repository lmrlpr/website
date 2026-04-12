import Stripe from 'npm:stripe'
import { createClient } from 'npm:@supabase/supabase-js'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'unknown'}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (session.metadata?.type === 'gotham_ticket') {
      const { first_name, last_name, email, ticket_type } = session.metadata
      const price = (session.amount_total ?? 0) / 100
      const { error } = await supabase.from('gotham_registrations').insert({
        first_name,
        last_name,
        email,
        ticket_type,
        price,
        payment_status: 'paid',
        stripe_session_id: session.id,
      })
      if (error) {
        console.error('DB insert failed (gotham):', error.message)
        return new Response('Database error', { status: 500 })
      }
    }

    if (session.metadata?.type === 'restaurant_reservation') {
      const {
        first_name,
        last_name,
        class_group,
        email,
        phone,
        starter,
        main,
        dessert,
        drinks,
        has_alcohol,
      } = session.metadata
      const { error } = await supabase.from('restaurant_reservations').insert({
        first_name,
        last_name,
        class_group,
        email,
        phone: phone ?? null,
        menu_selection: { starter, main, dessert, drinks },
        total_surcharge: has_alcohol === 'true' ? 7 : 0,
        payment_status: 'paid',
        stripe_session_id: session.id,
      })
      if (error) {
        console.error('DB insert failed (restaurant):', error.message)
        return new Response('Database error', { status: 500 })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
