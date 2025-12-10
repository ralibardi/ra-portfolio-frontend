# Architecture Documentation

This folder contains high-level system design, architectural decisions, and technical specifications.

## 📐 What's Here?

Official documentation about:
- System architecture and design patterns
- Technology stack and rationale
- Infrastructure overview
- Design decisions and trade-offs
- SCSS architecture and styling system
- License and intellectual property

## 📚 Documents

### `SCSS_ARCHITECTURE.md`
**Purpose**: Complete documentation of the SCSS architecture

**Contents**:
- Folder structure and organization
- Design system (colors, typography, spacing)
- Usage examples and best practices
- Import patterns and conventions
- Theme system documentation

**Audience**: Frontend developers, designers

---

### `LICENSE_EXPLANATION.md`
**Purpose**: Explains the proprietary license choice

**Contents**:
- Why proprietary license was chosen
- What's allowed vs prohibited
- Reasoning for employers and developers
- Contact information for permissions

**Audience**: Employers, recruiters, other developers

---

## 🎯 Planned Documents

### `TECH_STACK.md` (Coming Soon)
- Frontend: React 19, TypeScript, Vite
- Styling: SCSS with CSS Modules
- State: React Query
- Routing: React Router v7
- Testing: Jest, React Testing Library
- Build: Vite with optimizations

### `DESIGN_PATTERNS.md` (Coming Soon)
- Component architecture
- State management patterns
- Error handling approach
- Performance optimization strategies

### `INFRASTRUCTURE.md` (Coming Soon)
- Azure Static Web Apps
- Azure Functions API
- Azure SQL Database
- Deployment pipeline

## 📝 Documentation Standards

### What Belongs Here
✅ High-level system design
✅ Architectural decisions and rationale
✅ Technology choices and trade-offs
✅ Design patterns and principles
✅ Infrastructure overview

### What Doesn't Belong Here
❌ Step-by-step guides (use `../guides/`)
❌ API endpoint specs (use `../api/`)
❌ AI-generated notes (use `../kiro-notes/`)
❌ Temporary migration guides

## 🔍 Finding Information

### By Topic
- **SCSS/Styling**: `SCSS_ARCHITECTURE.md`
- **License**: `LICENSE_EXPLANATION.md`
- **Tech Stack**: `TECH_STACK.md` (coming soon)
- **Infrastructure**: `INFRASTRUCTURE.md` (coming soon)

### By Audience
- **Frontend Developers**: Start with `SCSS_ARCHITECTURE.md`
- **Employers/Reviewers**: Start with `LICENSE_EXPLANATION.md`
- **Architects**: Review all documents
- **New Team Members**: Read in order listed above

## 🎨 Architecture Principles

### Frontend Architecture
- **Component-Based**: Modular, reusable components
- **Type-Safe**: TypeScript throughout
- **Performance-First**: Code splitting, lazy loading
- **Accessible**: WCAG AA compliance
- **Responsive**: Mobile-first design

### Styling Architecture
- **Organized**: Clear folder structure (abstracts, base, utilities, animations)
- **Maintainable**: Design tokens and variables
- **Themeable**: Light/dark mode support
- **Scalable**: Utility classes for rapid development

### Code Quality
- **Linted**: Biome for consistent code style
- **Tested**: Jest + React Testing Library
- **Documented**: Clear comments and documentation
- **Reviewed**: PR reviews for all changes

## 📊 Architecture Decisions

### Why React 19?
- Latest features and performance improvements
- Strong ecosystem and community
- Excellent TypeScript support
- Modern concurrent features

### Why SCSS?
- Powerful features (variables, mixins, nesting)
- Better organization than plain CSS
- Design token system
- Theme support

### Why Vite?
- Fast development server
- Optimized production builds
- Modern tooling
- Excellent TypeScript support

### Why Azure?
- Cost-effective for portfolio projects
- Integrated services (Static Web Apps, Functions, SQL)
- Professional-grade infrastructure
- Easy deployment and scaling

## 🔄 Keeping Documentation Current

### Review Schedule
- **Monthly**: Quick review for accuracy
- **Quarterly**: Comprehensive review and updates
- **After Major Changes**: Update immediately

### Update Process
1. Make code changes
2. Update relevant architecture docs
3. Link to related guides if needed
4. Update this README if new docs added

## 🆘 Questions?

- **Architecture Questions**: Review documents here first
- **Implementation Questions**: Check `../guides/`
- **Recent Changes**: Check `../kiro-notes/`
- **Contact**: ronny.alibardi@outlook.com

---

**Note**: This is official project documentation. Keep it accurate and up-to-date!
