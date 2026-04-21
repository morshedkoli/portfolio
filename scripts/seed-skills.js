// Seed script: Adds all full-stack developer skills via the API
// Usage: node scripts/seed-skills.js

const BASE_URL = 'http://localhost:3000'

const skills = [
  // ─── FRONTEND ───────────────────────────────────────
  { name: 'React',            category: 'frontend', proficiency: 92, icon: '⚛️',  order: 1  },
  { name: 'Next.js',          category: 'frontend', proficiency: 90, icon: '▲',   order: 2  },
  { name: 'TypeScript',       category: 'frontend', proficiency: 88, icon: '🔷',  order: 3  },
  { name: 'JavaScript',       category: 'frontend', proficiency: 95, icon: '🟨',  order: 4  },
  { name: 'HTML5',            category: 'frontend', proficiency: 95, icon: '🌐',  order: 5  },
  { name: 'CSS3',             category: 'frontend', proficiency: 90, icon: '🎨',  order: 6  },
  { name: 'Tailwind CSS',     category: 'frontend', proficiency: 92, icon: '💨',  order: 7  },
  { name: 'Framer Motion',    category: 'frontend', proficiency: 85, icon: '🎬',  order: 8  },
  { name: 'Redux',            category: 'frontend', proficiency: 80, icon: '🔄',  order: 9  },
  { name: 'Zustand',          category: 'frontend', proficiency: 82, icon: '🐻',  order: 10 },
  { name: 'React Query',      category: 'frontend', proficiency: 80, icon: '🔍',  order: 11 },
  { name: 'Responsive Design',category: 'frontend', proficiency: 92, icon: '📱',  order: 12 },

  // ─── BACKEND ────────────────────────────────────────
  { name: 'Node.js',          category: 'backend', proficiency: 90, icon: '🟢',  order: 1  },
  { name: 'Express.js',       category: 'backend', proficiency: 88, icon: '🚂',  order: 2  },
  { name: 'MongoDB',          category: 'backend', proficiency: 88, icon: '🍃',  order: 3  },
  { name: 'PostgreSQL',       category: 'backend', proficiency: 78, icon: '🐘',  order: 4  },
  { name: 'Prisma',           category: 'backend', proficiency: 85, icon: '💎',  order: 5  },
  { name: 'REST APIs',        category: 'backend', proficiency: 92, icon: '🔗',  order: 6  },
  { name: 'GraphQL',          category: 'backend', proficiency: 72, icon: '◈',   order: 7  },
  { name: 'Firebase',         category: 'backend', proficiency: 82, icon: '🔥',  order: 8  },
  { name: 'Supabase',         category: 'backend', proficiency: 78, icon: '⚡',  order: 9  },
  { name: 'Redis',            category: 'backend', proficiency: 65, icon: '🟥',  order: 10 },
  { name: 'Authentication',   category: 'backend', proficiency: 85, icon: '🔐',  order: 11 },
  { name: 'Mongoose',         category: 'backend', proficiency: 85, icon: '📦',  order: 12 },

  // ─── LANGUAGES ──────────────────────────────────────
  { name: 'JavaScript',       category: 'languages', proficiency: 95, icon: '🟨', order: 1  },
  { name: 'TypeScript',       category: 'languages', proficiency: 88, icon: '🔷', order: 2  },
  { name: 'Python',           category: 'languages', proficiency: 75, icon: '🐍', order: 3  },
  { name: 'Java',             category: 'languages', proficiency: 65, icon: '☕', order: 4  },
  { name: 'Kotlin',           category: 'languages', proficiency: 70, icon: '🟣', order: 5  },
  { name: 'Dart',             category: 'languages', proficiency: 72, icon: '🎯', order: 6  },
  { name: 'C/C++',            category: 'languages', proficiency: 55, icon: '⚙️', order: 7  },
  { name: 'SQL',              category: 'languages', proficiency: 80, icon: '📊', order: 8  },
  { name: 'Bash',             category: 'languages', proficiency: 70, icon: '💻', order: 9  },

  // ─── TOOLS ──────────────────────────────────────────
  { name: 'Git & GitHub',     category: 'tools', proficiency: 90, icon: '🐙',  order: 1  },
  { name: 'Docker',           category: 'tools', proficiency: 72, icon: '🐳',  order: 2  },
  { name: 'VS Code',          category: 'tools', proficiency: 95, icon: '📝',  order: 3  },
  { name: 'Figma',            category: 'tools', proficiency: 75, icon: '🎨',  order: 4  },
  { name: 'Vercel',           category: 'tools', proficiency: 88, icon: '▲',   order: 5  },
  { name: 'Postman',          category: 'tools', proficiency: 85, icon: '📮',  order: 6  },
  { name: 'Linux',            category: 'tools', proficiency: 75, icon: '🐧',  order: 7  },
  { name: 'Nginx',            category: 'tools', proficiency: 65, icon: '🌐',  order: 8  },
  { name: 'CI/CD',            category: 'tools', proficiency: 72, icon: '🔄',  order: 9  },
  { name: 'npm/yarn/pnpm',    category: 'tools', proficiency: 90, icon: '📦',  order: 10 },
  { name: 'Webpack/Vite',     category: 'tools', proficiency: 78, icon: '⚡',  order: 11 },
  { name: 'Jest',             category: 'tools', proficiency: 70, icon: '🧪',  order: 12 },
  { name: 'Android Studio',   category: 'tools', proficiency: 72, icon: '📱',  order: 13 },

  // ─── VIBE CODING ────────────────────────────────────
  { name: 'Cursor AI',        category: 'vibe-coding', proficiency: 90, icon: '🖱️', order: 1  },
  { name: 'Claude Code',      category: 'vibe-coding', proficiency: 92, icon: '🤖', order: 2  },
  { name: 'GitHub Copilot',   category: 'vibe-coding', proficiency: 88, icon: '🧑‍✈️', order: 3  },
  { name: 'Google Gemini',    category: 'vibe-coding', proficiency: 85, icon: '✨', order: 4  },
  { name: 'ChatGPT',          category: 'vibe-coding', proficiency: 88, icon: '💬', order: 5  },
  { name: 'Windsurf',         category: 'vibe-coding', proficiency: 80, icon: '🏄', order: 6  },
  { name: 'v0 by Vercel',     category: 'vibe-coding', proficiency: 78, icon: '🅥',  order: 7  },
  { name: 'Prompt Engineering', category: 'vibe-coding', proficiency: 88, icon: '📝', order: 8  },

  // ─── AI ─────────────────────────────────────────────
  { name: 'OpenAI API',       category: 'ai', proficiency: 82, icon: '🧠', order: 1  },
  { name: 'LangChain',        category: 'ai', proficiency: 65, icon: '🔗', order: 2  },
  { name: 'Hugging Face',     category: 'ai', proficiency: 60, icon: '🤗', order: 3  },
  { name: 'TensorFlow',       category: 'ai', proficiency: 55, icon: '📐', order: 4  },
  { name: 'Machine Learning', category: 'ai', proficiency: 60, icon: '🤖', order: 5  },
  { name: 'NLP',              category: 'ai', proficiency: 58, icon: '💬', order: 6  },
  { name: 'RAG Systems',      category: 'ai', proficiency: 68, icon: '📚', order: 7  },
  { name: 'AI Integration',   category: 'ai', proficiency: 85, icon: '⚡', order: 8  },
]

async function seedSkills() {
  console.log('🚀 Starting skill seeding...\n')

  let success = 0
  let failed = 0

  for (const skill of skills) {
    try {
      const res = await fetch(`${BASE_URL}/api/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skill, isEnabled: true }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log(`  ✅ ${skill.icon} ${skill.name} (${skill.category}) — ${skill.proficiency}%`)
        success++
      } else {
        const err = await res.text()
        console.log(`  ❌ ${skill.name}: ${err}`)
        failed++
      }
    } catch (error) {
      console.log(`  ❌ ${skill.name}: ${error.message}`)
      failed++
    }
  }

  console.log(`\n──────────────────────────────────`)
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed:  ${failed}`)
  console.log(`📊 Total:   ${skills.length}`)
  console.log(`──────────────────────────────────`)
}

seedSkills()