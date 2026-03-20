import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const allowedProjectTypes = ['webapp', 'android', 'desktop', 'api'] as const

const getProjectType = (type: unknown) => {
  if (typeof type === 'string' && allowedProjectTypes.includes(type as (typeof allowedProjectTypes)[number])) {
    return type
  }
  return 'webapp'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('all') === 'true'
    const lifecycleStatus = searchParams.get('lifecycleStatus')
    
    const where: Record<string, unknown> = {}
    
    // For public API, only show published projects
    if (!includeAll) {
      where.publishStatus = 'published'
    }
    
    if (lifecycleStatus) {
      where.lifecycleStatus = lifecycleStatus
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate slug if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    // Check if slug exists
    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        longDescription: data.longDescription,
        projectType: getProjectType(data.projectType),
        lifecycleStatus: data.lifecycleStatus || 'idea',
        publishStatus: data.publishStatus || 'draft',
        coverImage: data.coverImage,
        logoUrl: data.logoUrl,
        gallery: data.gallery || [],
        technologies: data.technologies || [],
        techStack: data.techStack || [],
        features: data.features || [],
        modules: data.modules || [],
        roadmap: data.roadmap || [],
        flowDiagram: data.flowDiagram,
        apiStructure: data.apiStructure || [],
        databaseDesign: data.databaseDesign || [],
        deployment: data.deployment,
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        featured: data.featured || false,
        order: data.order || 0,
        overallProgress: data.overallProgress || 0
      }
    })
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
