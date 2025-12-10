# Kiro Notes

This folder contains AI-generated documentation created by Kiro to explain implementations, migrations, and architectural changes.

## 🤖 What Are Kiro Notes?

These documents are created by Kiro AI assistant to:
- Explain implementation decisions
- Provide migration guides for major changes
- Offer quick reference guides
- Document AI-assisted architectural changes

## ⚠️ Important Notes

- **Supplementary Documentation**: These are NOT official project docs
- **Time-Sensitive**: May become outdated as the project evolves
- **Educational**: Helpful for understanding "why" behind changes
- **Review Recommended**: Always verify against actual code

## 📋 Current Notes

### SCSS Architecture (December 2024)

#### `2024-12-scss-migration.md`
**Purpose**: Step-by-step guide for migrating from old SCSS structure to new organized architecture

**Key Topics**:
- Import path changes
- Color system updates
- Mixin usage changes
- Common migration issues

**When to Use**: When updating components to use new SCSS structure

---

#### `scss-quick-reference.md`
**Purpose**: Quick lookup guide for common SCSS patterns and utilities

**Key Topics**:
- Color usage examples
- Spacing scale reference
- Typography patterns
- Layout utilities
- Animation classes

**When to Use**: Daily development reference for SCSS utilities

---

## 🎯 How to Use These Notes

### For Developers
1. **During Migration**: Use migration guides step-by-step
2. **Daily Development**: Keep quick references handy
3. **Understanding Changes**: Review notes when encountering new patterns
4. **Onboarding**: Read recent notes to understand latest changes

### For Code Reviewers
1. **Context**: Understand why changes were made
2. **Validation**: Verify implementations match documented patterns
3. **Consistency**: Ensure team follows documented approaches

### For Future Reference
1. **Archive Old Notes**: Move outdated notes to `archive/` subfolder
2. **Update When Needed**: If patterns change, update or archive notes
3. **Link to Official Docs**: Reference official documentation when available

## 📁 File Naming Convention

```
YYYY-MM-topic-name.md          # Time-sensitive guides (migrations, changes)
topic-quick-reference.md       # Quick reference guides
topic-implementation-notes.md  # Implementation explanations
```

## 🔄 Maintenance

### When to Archive
- Implementation is complete and stable
- Official documentation covers the topic
- Patterns have significantly changed
- Note is >6 months old and no longer relevant

### How to Archive
```bash
# Create archive folder if needed
mkdir docs/kiro-notes/archive

# Move old notes
mv docs/kiro-notes/old-note.md docs/kiro-notes/archive/
```

## 📚 Related Documentation

- **Official Architecture**: `../architecture/`
- **Developer Guides**: `../guides/`
- **API Documentation**: `../api/`

## 🆘 Questions?

If Kiro notes are unclear or outdated:
1. Check official documentation in `../architecture/` or `../guides/`
2. Review actual code implementation
3. Create an issue for documentation updates
4. Contact: ronny.alibardi@outlook.com

---

**Remember**: These notes are helpful context, but always verify against the actual codebase!
