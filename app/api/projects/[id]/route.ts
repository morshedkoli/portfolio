import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOverallProgress } from '@/lib/utils/project-helpers'

const allowedProjectTypes = ['webapp', 'android', 'desktop', 'api'] as const

const getProjectType = (type: unknown) => {
  if (typeof type === 'string' && allowedProjectTypes.includes(type as (typeof allowedProjectTypes)[number])) {
    return type
  }
  return 'webapp'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Calculate progress if relevant fields are provided
    let overallProgress = data.overallProgress
    if (data.modules || data.features || data.roadmap) {
      overallProgress = calculateOverallProgress({
        modules: data.modules || [],
        features: data.features || [],
        roadmap: data.roadmap || []
      })
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        longDescription: data.longDescription,
        projectType: getProjectType(data.projectType),
        lifecycleStatus: data.lifecycleStatus,
        publishStatus: data.publishStatus,
        coverImage: data.coverImage,
        logoUrl: data.logoUrl,
        gallery: data.gallery,
        technologies: data.technologies || [],
        techStack: data.techStack,
        features: data.features,
        modules: data.modules,
        roadmap: data.roadmap,
        flowDiagram: data.flowDiagram,
        apiStructure: data.apiStructure,
        databaseDesign: data.databaseDesign,
        deployment: data.deployment,
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        featured: data.featured || false,
        order: data.order || 0,
        overallProgress
      }
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
