# Documentation Structure

This directory contains all project documentation organized by purpose.

## 📁 Folder Structure

```
docs/
├── architecture/       # System design and architecture decisions
├── guides/            # How-to guides and tutorials
├── kiro-notes/        # AI-generated explanations and migration guides
├── api/               # API documentation
└── README.md          # This file
```

## 📚 Documentation Types

### Architecture (`architecture/`)
**Purpose**: High-level system design and architectural decisions

**Contains**:
- System architecture diagrams
- Technology stack decisions
- Design patterns used
- Infrastructure overview

**Audience**: Developers, architects, technical leads

---

### Guides (`guides/`)
**Purpose**: Step-by-step instructions for common tasks

**Contains**:
- Setup and installation guides
- Development workflow
- Deployment procedures
- Troubleshooting guides

**Audience**: Developers, DevOps, new team members

---

### Kiro Notes (`kiro-notes/`)
**Purpose**: AI-generated explanations and implementation notes

**Contains**:
- Migration guides (e.g., SCSS restructuring)
- Implementation explanations
- Change logs from AI assistance
- Quick reference guides

**Audience**: Developers reviewing AI-assisted changes

**Note**: These are supplementary explanations, not official documentation

---

### API (`api/`)
**Purpose**: API endpoint documentation

**Contains**:
- Endpoint specifications
- Request/response examples
- Authentication details
- Error codes

**Audience**: Frontend developers, API consumers

---

## 🎯 Quick Links

### For New Developers
1. Start with `guides/SETUP.md`
2. Review `architecture/OVERVIEW.md`
3. Check `kiro-notes/` for recent changes

### For Employers/Reviewers
1. Read `architecture/OVERVIEW.md` for system design
2. Review `architecture/TECH_STACK.md` for technology choices
3. Check root `README.md` for project overview

### For Contributors
1. Follow `guides/CONTRIBUTING.md`
2. Review `guides/CODE_STANDARDS.md`
3. Check `kiro-notes/` for recent architectural changes

---

## 📝 Documentation Standards

### File Naming
- Use `UPPERCASE.md` for important docs (README, CONTRIBUTING)
- Use `kebab-case.md` for specific topics (setup-guide.md)
- Prefix with date for time-sensitive docs (2024-12-scss-migration.md)

### Content Structure
```markdown
# Title

Brief description (1-2 sentences)

## Table of Contents (for long docs)

## Sections with Clear Headers

## Examples with Code Blocks

## Related Documentation Links
```

### Maintenance
- Update docs when code changes
- Archive outdated docs to `archive/`
- Review quarterly for accuracy
- Keep examples up-to-date

---

## 🔍 Finding Documentation

### By Topic
- **Setup**: `guides/SETUP.md`
- **Architecture**: `architecture/OVERVIEW.md`
- **API**: `api/ENDPOINTS.md`
- **Deployment**: `guides/DEPLOYMENT.md`
- **Recent Changes**: `kiro-notes/`

### By Audience
- **Developers**: Start with `guides/`
- **Architects**: Start with `architecture/`
- **Employers**: Start with root `README.md` and `architecture/`
- **DevOps**: Start with `guides/DEPLOYMENT.md`

---

## 🤖 About Kiro Notes

The `kiro-notes/` folder contains AI-generated documentation that:
- Explains implementation decisions
- Provides migration guides
- Offers quick references
- Documents AI-assisted changes

**These are supplementary** - they help understand changes but aren't official project documentation.

---

## 📊 Documentation Health

| Section | Status | Last Updated |
|---------|--------|--------------|
| Architecture | ✅ Current | 2024-12 |
| Guides | ✅ Current | 2024-12 |
| API | 🟡 In Progress | - |
| Kiro Notes | ✅ Current | 2024-12 |

---

## 🆘 Need Help?

- **Can't find what you need?** Check the root `README.md`
- **Documentation outdated?** Create an issue or PR
- **New to the project?** Start with `guides/SETUP.md`
- **Questions?** Contact: ronny.alibardi@outlook.com
