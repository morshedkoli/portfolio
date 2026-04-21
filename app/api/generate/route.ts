import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { field, contextData } = await req.json()

    if (!field) {
      return NextResponse.json({ error: 'Field is required' }, { status: 400 })
    }

    // Build the prompt dynamically based on the field type
    let prompt = ''
    switch (field) {
      case 'project-description':
        prompt = `Write an engaging, professional, and concise 2-3 paragraph description for a software project named "${contextData.title}". ${contextData.tech ? 'It uses: ' + contextData.tech + '.' : ''} ${contextData.type ? 'Type: ' + contextData.type + '.' : ''} Emphasize the problem it solves and its technical excellence. Do not use markdown headers, just plain text or simple paragraphs.`
        break
      case 'project-seo':
        prompt = `Write a concise 150-160 character SEO meta description for a software project named "${contextData.title}". Make it click-worthy and professional.`
        break
      case 'experience-description':
        prompt = `Expand the following bullet points into a professional, cohesive 2-3 paragraph experience summary for a "${contextData.position}" role at "${contextData.company}". Make it sound impactful and results-oriented. Context: ${contextData.currentDesc || 'General responsibilities'}`
        break
      case 'profile-description':
        prompt = `Write an impactful, professional standard "About Me" biography (about 3-4 sentences long) for a person named ${contextData.name || 'someone'}, working as a ${contextData.title || 'Developer'}. Make it sound modern, tech-forward, and authoritative.`
        break
      case 'profile-title':
        prompt = `Enhance the professional title "${contextData.title || ''}" for a portfolio hero section. Keep it concise, punchy, and modern (e.g., 'Full Stack Developer', 'Senior Cloud Architect'). Output ONLY the title with no quotes.`
        break
      case 'project-title':
        prompt = `Enhance the project title "${contextData.title || ''}" to be catchy and professional. Output ONLY the title (max 5 words) with no quotes.`
        break
      case 'education-description':
        prompt = `Write a professional 1-2 sentence description of the academic achievements or focus areas for a degree in "${contextData.degree || 'Technology'}" at "${contextData.institution || 'University'}". Context: ${contextData.currentDesc || ''}`
        break
      case 'certification-description':
        prompt = `Write a concise, professional 1-2 sentence description highlighting the value and skills demonstrated by the "${contextData.name || 'Professional'}" certification. Context: ${contextData.currentDesc || ''}`
        break
      case 'settings-seo-description':
        prompt = `Write a highly optimized, professional SEO meta description (150-160 characters) for a developer portfolio website named "${contextData.title || 'Portfolio'}". Make it click-worthy.`
        break
      default:
        prompt = `Refine and perfectly format the following text for a professional portfolio field named "${field}". Ensure industry-standard capitalization, spelling, and professional tone. If it's a short title or name, output ONLY the refined phrase with no quotes or extra punctuation. Context data: ${JSON.stringify(contextData)}`
        break
    }

    // Fetch custom API keys from settings if available
    let customGoogleKey = null
    let customOpenRouterKey = null
    try {
      const googleAiSetting = await prisma.settings.findUnique({ where: { key: 'googleAiKey' } })
      const openRouterSetting = await prisma.settings.findUnique({ where: { key: 'openRouterKey' } })
      if (googleAiSetting?.value) customGoogleKey = String(googleAiSetting.value).replace(/^["']|["']$/g, '').trim()
      if (openRouterSetting?.value) customOpenRouterKey = String(openRouterSetting.value).replace(/^["']|["']$/g, '').trim()
    } catch (e) {
      console.error('Settings DB error:', e)
    }

    const googleKey = customGoogleKey || process.env.GOOGLE_AI_API_KEY
    if (googleKey) {
      try {
        console.log('Attempting generation with Google AI...')
        const ai = new GoogleGenAI({ apiKey: googleKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })
        
        if (response.text) {
          return NextResponse.json({ text: response.text })
        }
      } catch (googleError) {
        console.error('Google AI Failed (falling back to OpenRouter):', googleError)
      }
    } else {
      console.warn('No GOOGLE_AI_API_KEY found, jumping directly to fallback.')
    }

    // Fallback: OpenRouter
    const openRouterKey = customOpenRouterKey || process.env.OPENROUTER_API_KEY
    if (openRouterKey) {
      console.log('Attempting generation with OpenRouter...')
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', // Required by OpenRouter
          'X-Title': 'Portfolio AI Integration', // Required by OpenRouter
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini', // Fallback lightweight model
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('OpenRouter API request failed')
      }

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return NextResponse.json({ text: data.choices[0].message.content })
      }
    }

    throw new Error('All AI providers failed or missing API keys.')

  } catch (error: any) {
    console.error('API Generate Error:', error)
    return NextResponse.json({ error: error.message || 'Error occurred' }, { status: 500 })
  }
}
