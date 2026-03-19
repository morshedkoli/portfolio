import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const allowedStatuses = ['unread', 'read', 'replied'] as const

const updateStatus = async (request: NextRequest, id: string) => {
  const data = await request.json()
  const nextStatus = data?.status

  if (!allowedStatuses.includes(nextStatus)) {
    return NextResponse.json(
      { error: 'Invalid status value' },
      { status: 400 }
    )
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { status: nextStatus }
  })

  return NextResponse.json(contact)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return await updateStatus(request, id)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return await updateStatus(request, id)
  } catch (error) {
    console.error('Error patching contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
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
    await prisma.contact.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
