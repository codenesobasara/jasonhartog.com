import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function createHubSpotContact(name: string, email: string, phone: string, message: string) {
  const nameParts = name.trim().split(/\s+/)
  const firstname = nameParts[0]
  const lastname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        firstname,
        lastname,
        email,
        phone: phone || '',
        message,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        leadsource: 'jasonhartog.com',
      },
    }),
  })

  // If contact already exists, update instead
  if (!res.ok) {
    const err = await res.json()
    if (err.category === 'CONFLICT') {
      // Contact exists — update via email
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            firstname,
            lastname,
            phone: phone || '',
            message,
            leadsource: 'jasonhartog.com',
          },
        }),
      })
    } else {
      console.error('HubSpot error:', err)
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, message, website } = body

  // Honeypot check
  if (website) {
    return Response.json({ success: true })
  }

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Send emails and create HubSpot contact in parallel
    await Promise.all([
      // Email to Jason — new lead notification
      resend.emails.send({
        from: 'Jason Hartog Photography <jason@jasonhartog.com>',
        to: 'jason@jasonhartog.com',
        subject: `New inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),

      // Confirmation email to the prospect
      resend.emails.send({
        from: 'Jason Hartog Photography <jason@jasonhartog.com>',
        to: email,
        subject: 'Thanks for reaching out — Jason Hartog Photography',
        html: `
          <h2>Thanks for reaching out, ${name}!</h2>
          <p>I've received your message and will be in touch shortly.</p>
          <p>Best,<br>Jason Hartog</p>
        `,
      }),

      // Create/update contact in HubSpot
      createHubSpotContact(name, email, phone, message),
    ])

    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to process contact form:', error)
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }
}
