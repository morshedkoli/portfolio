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

  const project = result.data as { title: string; description: string; coverImage?: string }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : []
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const result = await getProjectBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const project = result.data as { publishStatus?: string }

  // Only show published projects to public
  if (project.publishStatus !== 'published') {
    notFound()
  }

  return <ProjectDetailView project={result.data} />
}
