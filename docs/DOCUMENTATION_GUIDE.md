# Documentation Guide

Quick guide for maintaining and organizing project documentation.

## 📁 Folder Structure

```
docs/
├── architecture/       # Official system design docs
├── guides/            # Step-by-step how-to guides
├── kiro-notes/        # AI-generated explanations
├── api/               # API specifications
└── README.md          # Documentation overview
```

## 🎯 Where to Put New Documentation

### Decision Tree

```
Is this documentation?
│
├─ YES → Continue
│
└─ NO → Not for docs/ folder

What type of documentation?
│
├─ System Design / Architecture Decision
│   └─ → docs/architecture/
│
├─ Step-by-Step Guide / Tutorial
│   └─ → docs/guides/
│
├─ AI-Generated Explanation / Migration Guide
│   └─ → docs/kiro-notes/
│
└─ API Endpoint Specification
    └─ → docs/api/
```

## 📝 Documentation Types

### Architecture (`architecture/`)
**When to use**: Documenting high-level design decisions

**Examples**:
- ✅ SCSS architecture overview
- ✅ Technology stack decisions
- ✅ Design patterns used
- ✅ Infrastructure overview
- ✅ License explanations

**File naming**: `TOPIC_NAME.md` (uppercase for important docs)

---

### Guides (`guides/`)
**When to use**: Creating step-by-step instructions

**Examples**:
- ✅ Setup and installation
- ✅ Development workflow
- ✅ Testing procedures
- ✅ Deployment process
- ✅ Troubleshooting

**File naming**: `TOPIC.md` or `topic-guide.md`

---

### Kiro Notes (`kiro-notes/`)
**When to use**: AI-generated explanations and migrations

**Examples**:
- ✅ Migration guides (SCSS restructuring)
- ✅ Quick reference guides
- ✅ Implementation explanations
- ✅ Change documentation

**File naming**: 
- Time-sensitive: `YYYY-MM-topic-name.md`
- References: `topic-quick-reference.md`

**Important**: These are supplementary, not official docs!

---

### API (`api/`)
**When to use**: Documenting API endpoints

**Examples**:
- ✅ Endpoint specifications
- ✅ Request/response formats
- ✅ Authentication details
- ✅ Error codes

**File naming**: `ENDPOINTS.md`, `AUTHENTICATION.md`, etc.

---

## 🤖 Kiro-Generated Documentation

### What Kiro Should Create

**Kiro Notes** (`kiro-notes/`):
- ✅ Migration guides for major changes
- ✅ Quick reference guides
- ✅ Implementation explanations
- ✅ Change summaries

**NOT in Kiro Notes**:
- ❌ Official architecture docs (use `architecture/`)
- ❌ Step-by-step guides (use `guides/`)
- ❌ API specs (use `api/`)

### Naming Convention for Kiro Notes

```
# Time-sensitive (migrations, major changes)
YYYY-MM-topic-name.md
Example: 2024-12-scss-migration.md

# Quick references
topic-quick-reference.md
Example: scss-quick-reference.md

# Implementation notes
topic-implementation-notes.md
Example: authentication-implementation-notes.md
```

### When to Archive Kiro Notes

Move to `kiro-notes/archive/` when:
- ✅ Implementation is complete and stable
- ✅ Official documentation covers the topic
- ✅ Note is >6 months old and no longer relevant
- ✅ Patterns have significantly changed

## 📋 Documentation Checklist

### Before Creating New Documentation

- [ ] Determine correct folder (architecture/guides/kiro-notes/api)
- [ ] Check if similar documentation exists
- [ ] Choose appropriate file name
- [ ] Include clear title and description
- [ ] Add to relevant README.md

### For Kiro-Generated Docs

- [ ] Place in `kiro-notes/` folder
- [ ] Use date prefix if time-sensitive
- [ ] Mark as "AI-generated" in header
- [ ] Link to official docs if available
- [ ] Update `kiro-notes/README.md`

### For Official Documentation

- [ ] Place in appropriate folder
- [ ] Follow documentation standards
- [ ] Include examples and code blocks
- [ ] Link to related documentation
- [ ] Update folder README.md

## 🔄 Maintenance

### Monthly Review
- Check for outdated Kiro notes
- Update guides with code changes
- Verify links still work
- Archive old migration guides

### Quarterly Review
- Comprehensive documentation audit
- Update architecture docs
- Consolidate duplicate information
- Improve clarity and examples

## 📊 Documentation Status

Track documentation health:

| Folder | Purpose | Status | Last Updated |
|--------|---------|--------|--------------|
| architecture/ | System design | ✅ Current | 2024-12 |
| guides/ | How-to guides | 🟡 In Progress | - |
| kiro-notes/ | AI explanations | ✅ Current | 2024-12 |
| api/ | API specs | 🟡 Planned | - |

## 🎨 Documentation Standards

### File Structure
```markdown
# Title

Brief description (1-2 sentences)

## Table of Contents (for long docs)

## Main Content
Clear sections with headers

## Examples
Code blocks with syntax highlighting

## Related Documentation
Links to related docs

## Questions?
Contact information
```

### Writing Style
- **Clear and Concise**: Get to the point
- **Examples**: Show, don't just tell
- **Consistent**: Follow established patterns
- **Updated**: Keep current with code

### Code Blocks
```markdown
\`\`\`typescript
// Always specify language
const example = "like this";
\`\`\`
```

## 🆘 Common Questions

### "Where should this doc go?"
Use the decision tree above or ask:
- Is it system design? → `architecture/`
- Is it a how-to? → `guides/`
- Is it AI-generated? → `kiro-notes/`
- Is it API-related? → `api/`

### "Should Kiro create this?"
Kiro should create:
- Migration guides for major changes
- Quick references for new systems
- Implementation explanations

Kiro should NOT create:
- Official architecture documentation
- Long-term maintenance guides
- API specifications

### "When to archive Kiro notes?"
Archive when:
- Migration is complete
- Official docs cover the topic
- Note is outdated (>6 months)
- Patterns have changed significantly

## 📚 Examples

### Good Documentation Organization

```
docs/
├── architecture/
│   ├── SCSS_ARCHITECTURE.md          # Official design system
│   └── LICENSE_EXPLANATION.md        # License reasoning
├── guides/
│   ├── SETUP.md                      # Getting started
│   └── DEPLOYMENT.md                 # How to deploy
├── kiro-notes/
│   ├── 2024-12-scss-migration.md     # Time-sensitive migration
│   ├── scss-quick-reference.md       # Quick lookup
│   └── archive/
│       └── old-migration.md          # Archived old guide
└── api/
    └── ENDPOINTS.md                  # API reference
```

### Bad Documentation Organization

```
docs/
├── random-notes.md                   # ❌ Unclear purpose
├── stuff.md                          # ❌ Vague name
├── kiro-notes/
│   └── OFFICIAL_ARCHITECTURE.md      # ❌ Wrong folder
└── guides/
    └── api-endpoints.md              # ❌ Should be in api/
```

## 🎯 Quick Reference

| I want to... | Put it in... | Name it... |
|--------------|--------------|------------|
| Document system design | `architecture/` | `TOPIC_NAME.md` |
| Create a how-to guide | `guides/` | `TOPIC.md` |
| Explain a migration | `kiro-notes/` | `YYYY-MM-topic.md` |
| Create quick reference | `kiro-notes/` | `topic-quick-reference.md` |
| Document API endpoint | `api/` | `ENDPOINTS.md` |

---

**Remember**: Good documentation is:
- ✅ In the right place
- ✅ Clearly named
- ✅ Well-structured
- ✅ Kept up-to-date
- ✅ Easy to find
