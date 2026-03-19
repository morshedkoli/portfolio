import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const settings = await prisma.settings.findMany()
        // Convert to key-value object for easier consumption
        const settingsMap: Record<string, any> = {}
        settings.forEach((s) => {
            settingsMap[s.key] = s.value
        })
        return NextResponse.json(settingsMap)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const { key, value, description } = data

        if (!key) {
            return NextResponse.json(
                { error: 'Key is required' },
                { status: 400 }
            )
        }

        const setting = await prisma.settings.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description },
        })

        return NextResponse.json(setting)
    } catch (error) {
        console.error('Error updating setting:', error)
        return NextResponse.json(
            { error: 'Failed to update setting' },
            { status: 500 }
        )
    }
}
