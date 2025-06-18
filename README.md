# Portfolio Website

A modern, interactive portfolio website built with Next.js, featuring 3D animations, particle effects, and smooth transitions.

## Features

- 🎨 **Modern Design**: Clean, professional layout with dark theme
- 🎭 **3D Animations**: Interactive 3D elements using Three.js and React Three Fiber
- ✨ **Particle Effects**: Dynamic particle background for visual appeal
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🎯 **Smooth Animations**: Framer Motion for buttery smooth transitions
- 🚀 **Performance**: Optimized for fast loading and smooth interactions
- 📧 **Contact Form**: Interactive contact form with validation
- 🎪 **Interactive Elements**: Hover effects and micro-interactions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Hero.tsx
│   ├── Loading.tsx
│   ├── Navigation.tsx
│   ├── ParticleBackground.tsx
│   ├── Projects.tsx
│   └── Skills.tsx
├── public/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Customization

### Personal Information

Update the following files with your personal information:

- `components/Hero.tsx` - Main headline and introduction
- `components/About.tsx` - About section content
- `components/Skills.tsx` - Your skills and technologies
- `components/Projects.tsx` - Your projects and portfolio items
- `components/Contact.tsx` - Contact information and social links

### Styling

- Colors and theme can be customized in `tailwind.config.js`
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind CSS classes

### 3D Elements

- Particle system configuration in `components/ParticleBackground.tsx`
- 3D sphere animation in `components/Hero.tsx`
- Three.js settings can be adjusted in respective components

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Performance Optimization

- Images are optimized using Next.js Image component
- 3D elements are lazy-loaded with Suspense
- Animations are optimized for 60fps
- Code splitting is handled automatically by Next.js

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: 3D features require WebGL support.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please reach out through the contact form on the website or create an issue in this repository.