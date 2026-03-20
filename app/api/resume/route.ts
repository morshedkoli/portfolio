import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function GET() {
  try {
    // Fetch all data
    const [profile, skills, experiences, educations] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.education.findMany({ orderBy: { order: 'asc' } })
    ])

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // Letter size
    const { height } = page.getSize()

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Colors
    const blue = rgb(0.118, 0.251, 0.686) // #1e40af
    const darkGray = rgb(0.235, 0.235, 0.235) // #3c3c3c
    const medGray = rgb(0.4, 0.4, 0.4) // #666666
    const lightGray = rgb(0.314, 0.314, 0.314) // #505050

    let y = height - 50
    const margin = 50
    const pageWidth = 612 - margin * 2

    // Helper function to draw centered text
    const drawCenteredText = (text: string, font: typeof helvetica, size: number, color: typeof blue) => {
      const textWidth = font.widthOfTextAtSize(text, size)
      page.drawText(text, {
        x: (612 - textWidth) / 2,
        y,
        size,
        font,
        color,
      })
      y -= size + 4
    }

    // Helper function to draw text
    const drawText = (text: string, font: typeof helvetica, size: number, color: typeof blue, x = margin) => {
      page.drawText(text, { x, y, size, font, color })
      y -= size + 4
    }

    // Header - Name
    drawCenteredText(profile?.name || 'Resume', helveticaBold, 24, blue)
    y -= 4

    // Title
    if (profile?.title) {
      drawCenteredText(profile.title, helvetica, 14, medGray)
    }
    y -= 4

    // Contact Info
    const contactParts = [profile?.email, profile?.phone, profile?.location].filter(Boolean)
    if (contactParts.length > 0) {
      drawCenteredText(contactParts.join('  |  '), helvetica, 10, lightGray)
    }
    y -= 8

    // Divider
    page.drawLine({
      start: { x: margin, y },
      end: { x: 612 - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    })
    y -= 20

    // Helper to wrap and draw multi-line text
    const drawWrappedText = (text: string, font: typeof helvetica, size: number, color: typeof blue) => {
      // Clean text: replace newlines with spaces, normalize whitespace
      const cleanText = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
      const words = cleanText.split(' ')
      let line = ''
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word
        if (font.widthOfTextAtSize(testLine, size) > pageWidth) {
          drawText(line, font, size, color)
          line = word
        } else {
          line = testLine
        }
      }
      if (line) drawText(line, font, size, color)
    }

    // Summary
    if (profile?.description) {
      drawText('SUMMARY', helveticaBold, 12, blue)
      y -= 4
      drawWrappedText(profile.description, helvetica, 10, darkGray)
      y -= 12
    }

    // Experience
    if (experiences.length > 0) {
      drawText('EXPERIENCE', helveticaBold, 12, blue)
      y -= 4

      for (const exp of experiences) {
        const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const endDate = exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
        const dateRange = `${startDate} - ${endDate}`

        // Position and date on same line
        drawText(exp.position, helveticaBold, 11, rgb(0.157, 0.157, 0.157))
        const dateWidth = helvetica.widthOfTextAtSize(dateRange, 10)
        page.drawText(dateRange, { x: 612 - margin - dateWidth, y: y + 15, size: 10, font: helvetica, color: medGray })

        drawText(exp.company, helvetica, 10, lightGray)
        y -= 2

        drawWrappedText(exp.description, helvetica, 10, darkGray)
        y -= 10
      }
      y -= 8
    }

    // Education
    if (educations.length > 0) {
      drawText('EDUCATION', helveticaBold, 12, blue)
      y -= 4

      for (const edu of educations) {
        const startYear = new Date(edu.startDate).getFullYear()
        const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'
        const dateRange = `${startYear} - ${endYear}`
        const degree = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`

        drawText(degree, helveticaBold, 11, rgb(0.157, 0.157, 0.157))
        const dateWidth = helvetica.widthOfTextAtSize(dateRange, 10)
        page.drawText(dateRange, { x: 612 - margin - dateWidth, y: y + 15, size: 10, font: helvetica, color: medGray })

        drawText(edu.institution, helvetica, 10, lightGray)
        y -= 8
      }
      y -= 8
    }

    // Skills
    if (skills.length > 0) {
      drawText('SKILLS', helveticaBold, 12, blue)
      y -= 4

      // Group skills by category
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
      }, {} as Record<string, string[]>)

      for (const [category, skillNames] of Object.entries(skillsByCategory)) {
        const categoryLabel = `${category.charAt(0).toUpperCase() + category.slice(1)}: `
        const skillsText = skillNames.join(', ')

        page.drawText(categoryLabel, { x: margin, y, size: 10, font: helveticaBold, color: darkGray })
        const labelWidth = helveticaBold.widthOfTextAtSize(categoryLabel, 10)
        page.drawText(skillsText, { x: margin + labelWidth, y, size: 10, font: helvetica, color: lightGray })
        y -= 14
      }
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()
    const filename = `${(profile?.name || 'resume').toLowerCase().replace(/\s+/g, '-')}-resume.pdf`

    return new NextResponse(pdfBytes, {
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
