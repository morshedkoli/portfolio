import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export async function GET() {
  try {
    // Fetch all data
    const [profile, skills, experiences, educations] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.education.findMany({ orderBy: { order: 'asc' } })
    ])

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))

    // Header - Name
    doc.fontSize(24)
       .fillColor('#1e40af')
       .font('Helvetica-Bold')
       .text(profile?.name || 'Resume', { align: 'center' })
       .moveDown(0.3)

    // Title
    doc.fontSize(14)
       .fillColor('#666666')
       .font('Helvetica')
       .text(profile?.title || '', { align: 'center' })
       .moveDown(0.5)

    // Contact Info
    const contactParts = [
      profile?.email,
      profile?.phone,
      profile?.location
    ].filter(Boolean)
    
    doc.fontSize(10)
       .fillColor('#505050')
       .text(contactParts.join('  |  '), { align: 'center' })
       .moveDown(1)

    // Divider
    doc.strokeColor('#cccccc')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke()
       .moveDown(1)

    // Summary
    if (profile?.description) {
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('SUMMARY')
         .moveDown(0.3)

      doc.fontSize(10)
         .fillColor('#3c3c3c')
         .font('Helvetica')
         .text(profile.description)
         .moveDown(1)
    }

    // Experience
    if (experiences.length > 0) {
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('EXPERIENCE')
         .moveDown(0.3)

      for (const exp of experiences) {
        const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const endDate = exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''

        doc.fontSize(11)
           .fillColor('#282828')
           .font('Helvetica-Bold')
           .text(exp.position, { continued: true })
           .font('Helvetica')
           .fillColor('#666666')
           .text(`  ${startDate} - ${endDate}`, { align: 'right' })

        doc.fontSize(10)
           .fillColor('#505050')
           .text(exp.company)
           .moveDown(0.2)

        doc.fillColor('#3c3c3c')
           .text(exp.description)
           .moveDown(0.8)
      }
      doc.moveDown(0.5)
    }

    // Education
    if (educations.length > 0) {
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('EDUCATION')
         .moveDown(0.3)

      for (const edu of educations) {
        const startYear = new Date(edu.startDate).getFullYear()
        const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'

        doc.fontSize(11)
           .fillColor('#282828')
           .font('Helvetica-Bold')
           .text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, { continued: true })
           .font('Helvetica')
           .fillColor('#666666')
           .text(`  ${startYear} - ${endYear}`, { align: 'right' })

        doc.fontSize(10)
           .fillColor('#505050')
           .text(edu.institution)
           .moveDown(0.5)
      }
      doc.moveDown(0.5)
    }

    // Skills
    if (skills.length > 0) {
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('SKILLS')
         .moveDown(0.3)

      // Group skills by category
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
      }, {} as Record<string, string[]>)

      for (const [category, skillNames] of Object.entries(skillsByCategory)) {
        doc.fontSize(10)
           .fillColor('#3c3c3c')
           .font('Helvetica-Bold')
           .text(`${category.charAt(0).toUpperCase() + category.slice(1)}: `, { continued: true })
           .font('Helvetica')
           .fillColor('#505050')
           .text(skillNames.join(', '))
           .moveDown(0.2)
      }
    }

    // End document
    doc.end()

    // Wait for PDF generation to complete
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    const filename = `${(profile?.name || 'resume').toLowerCase().replace(/\s+/g, '-')}-resume.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    })
  } catch (error) {
    console.error('Error generating resume PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}
