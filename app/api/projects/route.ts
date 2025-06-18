import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'active' },
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
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        technologies: data.technologies || [],
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        imageUrl: data.imageUrl,
        featured: data.featured || false,
        order: data.order || 0,
        status: data.status || 'active'
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