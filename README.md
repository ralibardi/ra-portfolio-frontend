# RA Portfolio

![GitHub Actions](https://img.shields.io/github/actions/workflow/status/ralibardi/ra-portfolio/azure-static-web-apps-kind-ocean-010be9b03.yml)
![GitHub Checks](https://img.shields.io/github/checks-status/ralibardi/ra-portfolio/main)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=ralibardi_ra-portfolio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ralibardi_ra-portfolio)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ralibardi_ra-portfolio&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ralibardi_ra-portfolio)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ralibardi_ra-portfolio&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ralibardi_ra-portfolio)

## Overview

RA Portfolio showcases projects and contact information using React, Storybook, and Vite for a responsive, interactive experience.

## Key Features

- Contact form for user outreach
- Detailed project showcase
- Responsive design for all devices
- Multi-language support
- Interactive UI components
- Performance optimized
- Accessibility compliant

## Technology Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI Development:** Storybook
- **Styling:** SCSS Modules
- **Testing:** Jest & React Testing Library
- **CI/CD:** GitHub Actions
- **Hosting:** Azure Static Web Apps
- **Code Quality:** SonarCloud
- **Internationalization:** i18next

## Setup

### Requirements

- Node.js ≥20.0.0
- npm ≥10.0.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ralibardi/ra-portfolio.git
```

2. Navigate to the project directory:

```bash
cd ra-portfolio
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run storybook` - Start Storybook
- `npm run lint` - Run Biome linting
- `npm run format` - Format code with Biome

## Project Structure

```
ra-portfolio/
├── src/
│   ├── app/
│   │   ├── routes/          # Route definitions
│   │   └── styles/          # Global SCSS architecture
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── api/                 # API client and services
│   ├── utils/               # Utility functions
│   └── type/                # TypeScript types
├── docs/                    # 📚 Documentation
│   ├── architecture/        # System design and decisions
│   ├── guides/              # How-to guides
│   ├── kiro-notes/          # AI-generated explanations
│   └── api/                 # API documentation
├── public/                  # Public assets
└── .storybook/              # Storybook configuration
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Architecture](docs/architecture/)** - System design, SCSS architecture, license info
- **[Guides](docs/guides/)** - Setup, development, testing, deployment guides
- **[Kiro Notes](docs/kiro-notes/)** - AI-generated migration guides and quick references
- **[API](docs/api/)** - API endpoint specifications (coming soon)

### Quick Links
- 🎨 [SCSS Architecture](docs/architecture/SCSS_ARCHITECTURE.md) - Complete styling system guide
- 📝 [License Explanation](docs/architecture/LICENSE_EXPLANATION.md) - Why proprietary license
- 🔄 [SCSS Migration Guide](docs/kiro-notes/2024-12-scss-migration.md) - Migrating to new structure
- ⚡ [SCSS Quick Reference](docs/kiro-notes/scss-quick-reference.md) - Common patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Quality Assurance

- All code changes require tests
- Maintains 80%+ test coverage
- Follows Biome configuration
- Passes SonarCloud quality gates

## Deployment

The application is automatically deployed to Azure Static Web Apps through GitHub Actions when changes are pushed to the main branch.

## License

Copyright (c) 2024 Ronny Alibardi. All Rights Reserved.

This project uses a **proprietary license**. The code is viewable for evaluation and learning purposes, but copying, redistribution, or commercial use is prohibited.

See [LICENSE](LICENSE) for full terms and [LICENSE_EXPLANATION.md](docs/architecture/LICENSE_EXPLANATION.md) for detailed reasoning.

## Contact

For questions or feedback, please use the contact form on the portfolio website or open an issue in this repository.
