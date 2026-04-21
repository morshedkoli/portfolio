import dynamic from 'next/dynamic'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Certifications from '@/components/Certifications'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { getHomePageData } from '@/lib/site-data'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'))

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

export default async function Home() {
  const { profile, settings, skills, experiences, education, certifications, projects } =
    await getHomePageData()

  const siteName = String(settings.siteName || profile.name || 'Portfolio')
  const siteDescription = String(
    settings.siteDescription ||
      profile.description ||
      'Professional portfolio showcasing projects, skills, and experience.'
  )

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 6)
  const featuredSkills = skills.slice(0, 12)

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#featured-projects`,
        name: 'Featured portfolio projects',
        itemListElement: featuredProjects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/projects/${project.slug}`,
          name: project.title,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#skills`,
        name: 'Core skills',
        itemListElement: featuredSkills.map((skill, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: skill.name,
        })),
      },
    ],
  }

  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <ParticleBackground />
      <Navigation />
      <Hero profile={profile} projectCount={projects.length} skillCount={skills.length} />
      <section
        aria-labelledby="portfolio-summary"
        className="relative z-10 px-4 pb-6 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-sm">
          <h2 id="portfolio-summary" className="text-2xl font-semibold text-white">
            Portfolio Summary
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-gray-300 sm:text-base">
            {siteName} is the portfolio website of {profile.name}, a {profile.title}. This site
            highlights professional experience, technical skills, education, certifications,
            selected projects, and contact details in a structured format for both human visitors
            and machine readers. The portfolio currently includes {projects.length} published
            projects, {skills.length} listed skills, {experiences.length} experience entries,
            {education.length} education entries, and {certifications.length} certifications.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Focus Areas
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Full-stack web development, responsive user interfaces, API development,
                performance optimization, SEO, and AI-enhanced digital products.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Core Technologies
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                {featuredSkills.map((skill) => skill.name).join(', ') || siteDescription}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Contact
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Email: {profile.email}
                {profile.phone ? ` | Phone: ${profile.phone}` : ''}
                {profile.location ? ` | Location: ${profile.location}` : ''}
              </p>
            </div>
          </div>
        </div>
      </section>
      <About />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
