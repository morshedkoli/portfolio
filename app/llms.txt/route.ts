import { getHomePageData } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { profile, skills, experiences, education, certifications, projects } =
    await getHomePageData()

  let content = `# Portfolio of ${profile.name}
> ${profile.title}
> ${profile.description}

## Contact Information
- Email: ${profile.email}
${profile.phone ? `- Phone: ${profile.phone}` : ''}
${profile.location ? `- Location: ${profile.location}` : ''}

`

  if (profile.socialLinks) {
    content += `## Social Links\n`
    for (const [key, value] of Object.entries(profile.socialLinks)) {
      if (value) content += `- ${key}: ${value}\n`
    }
    content += '\n'
  }

  content += `## Professional Experience\n`
  experiences.forEach(exp => {
    content += `### ${exp.position} at ${exp.company}\n`
    content += `- Timeline: ${new Date(exp.startDate).getFullYear()} - ${exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}\n`
    if (exp.location) content += `- Location: ${exp.location}\n`
    content += `${exp.description}\n\n`
  })

  if (skills.length > 0) {
    content += `## Skills\n`
    const categorizedSkills = skills.reduce((acc, skill) => {
      // @ts-ignore
      const category = skill.category || 'General'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill.name)
      return acc
    }, {} as Record<string, string[]>)

    for (const [category, skillNames] of Object.entries(categorizedSkills)) {
      content += `### ${category}\n`
      content += `${skillNames.join(', ')}\n\n`
    }
  }

  content += `## Featured Projects\n`
  projects.forEach(proj => {
    content += `### ${proj.title}\n`
    content += `${proj.description}\n`
    if (proj.techStack) {
      if (Array.isArray(proj.techStack)) {
        content += `- Built with: ${proj.techStack.join(', ')}\n`
      } else {
        content += `- Built with: ${proj.techStack}\n`
      }
    }
    if (proj.githubUrl) content += `- GitHub: ${proj.githubUrl}\n`
    if (proj.demoUrl) content += `- Live: ${proj.demoUrl}\n`
    content += `\n`
  })

  content += `## Education\n`
  education.forEach(edu => {
    content += `### ${edu.degree} in ${edu.field}\n`
    content += `- Institution: ${edu.institution}\n`
    content += `- Timeline: ${new Date(edu.startDate).getFullYear()} - ${edu.current ? 'Present' : new Date(edu.endDate!).getFullYear()}\n`
    if (edu.description) content += `${edu.description}\n`
    content += `\n`
  })

  if (certifications.length > 0) {
     content += `## Certifications\n`
     certifications.forEach(cert => {
        content += `- ${cert.name} from ${cert.issuer} (${new Date(cert.date).getFullYear()})\n`
        if (cert.url) content += `  URL: ${cert.url}\n`
     })
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}
