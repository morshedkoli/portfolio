const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleSkills = [
  {
    name: 'React',
    category: 'frontend',
    proficiency: 90,
    icon: '⚛️',
    order: 1
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 85,
    icon: '🔷',
    order: 2
  },
  {
    name: 'Next.js',
    category: 'frontend',
    proficiency: 88,
    icon: '▲',
    order: 3
  },
  {
    name: 'Node.js',
    category: 'backend',
    proficiency: 82,
    icon: '🟢',
    order: 1
  },
  {
    name: 'PostgreSQL',
    category: 'backend',
    proficiency: 75,
    icon: '🐘',
    order: 2
  },
  {
    name: 'Prisma',
    category: 'backend',
    proficiency: 80,
    icon: '🔺',
    order: 3
  },
  {
    name: 'Git',
    category: 'tools',
    proficiency: 85,
    icon: '📚',
    order: 1
  },
  {
    name: 'Docker',
    category: 'tools',
    proficiency: 70,
    icon: '🐳',
    order: 2
  },
  {
    name: 'JavaScript',
    category: 'languages',
    proficiency: 92,
    icon: '🟨',
    order: 1
  },
  {
    name: 'Python',
    category: 'languages',
    proficiency: 78,
    icon: '🐍',
    order: 2
  }
]

async function seedSkills() {
  try {
    console.log('Seeding skills...')
    
    // Clear existing skills
    await prisma.skill.deleteMany()
    
    // Add sample skills
    for (const skill of sampleSkills) {
      await prisma.skill.create({
        data: skill
      })
    }
    
    console.log('Skills seeded successfully!')
    console.log(`Added ${sampleSkills.length} skills to the database.`)
  } catch (error) {
    console.error('Error seeding skills:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSkills()