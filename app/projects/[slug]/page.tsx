import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/actions/project-actions'
import { ProjectDetailView } from '@/components/project/ProjectDetailView'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getProjectBySlug(slug)
  
  if (!result.success || !result.data) {
    return {
      title: 'Project Not Found'
    }
  }

  const project = result.data as any
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    keywords: project.techStack ? project.techStack.map((tech: any) => tech.name).join(', ') : '',
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${baseUrl}/projects/${project.slug}`,
      type: 'article',
      publishedTime: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt,
      modifiedTime: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : project.updatedAt,
      images: project.coverImage ? [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: `${project.title} Project Cover`
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : [],
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const result = await getProjectBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const project = result.data as any

  // Only show published projects to public
  if (project.publishStatus !== 'published') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

  // Structured Data for the specific project
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: project.projectType === 'webapp' ? 'WebApplication' : 'DesktopApplication',
    operatingSystem: 'All',
    url: project.demoUrl || `${baseUrl}/projects/${project.slug}`,
    image: project.coverImage || undefined,
    author: {
      '@type': 'Person',
      name: 'Murshed Koli',
    },
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailView project={result.data} />
    </>
  )
}
