# Contributing to Angular Checklist App

First off, thank you for considering contributing to the Angular Checklist App! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by common sense and mutual respect. Please be kind and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Node version: [e.g. 18.0.0]
 - Next.js version: [e.g. 15.0.2]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request**

## Development Process

### Setting Up Your Development Environment

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/angular-info-base.git
cd angular-info-base

# Add upstream remote
git remote add upstream https://github.com/Tokiarivelo/angular-info-base.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Set up database
npm run prisma:generate
npm run prisma:push

# Start development server
npm run dev
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Keep commits focused and atomic

3. **Test your changes**
   ```bash
   npm run typecheck  # Check TypeScript
   npm run lint       # Check code style
   npm run format     # Format code
   npm test           # Run tests
   npm run build      # Ensure it builds
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Submit!

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Leverage type inference when obvious

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string | null;
}

// Avoid
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Use Server Components by default
- Add `'use client'` only when needed
- Keep components focused and small

```typescript
// Server Component (default)
export default async function MyPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (when needed)
'use client';
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={...}>Click</button>;
}
```

### Naming Conventions

- **Files**: PascalCase for components (`UserProfile.tsx`), camelCase for utilities (`formatDate.ts`)
- **Components**: PascalCase (`UserCard`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Database models**: PascalCase singular (`User`, `Checklist`)

### Code Style

- Use Prettier for formatting (run `npm run format`)
- Use ESLint rules (run `npm run lint`)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

### Best Practices

1. **Server Actions**
   - Always mark with `'use server'`
   - Include authentication checks
   - Validate input
   - Use `revalidatePath()` for cache updates

2. **Database Queries**
   - Use Prisma Client
   - Include only needed fields
   - Add proper error handling
   - Use transactions for related updates

3. **Authentication**
   - Never expose passwords
   - Always hash passwords with bcrypt
   - Check authorization before mutations
   - Use session helpers from NextAuth

4. **Error Handling**
   - Use try-catch blocks
   - Provide user-friendly error messages
   - Log errors for debugging
   - Never expose sensitive information

## Testing

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('handles user interaction', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
```

## Documentation

- Update README.md for user-facing changes
- Update DEVELOPMENT.md for developer-facing changes
- Add JSDoc comments for complex functions
- Update API_EXAMPLES.md for new endpoints

## Database Changes

When modifying the database schema:

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate` (creates migration)
3. Test the migration
4. Update TypeScript types if needed
5. Update seed script if relevant

## Review Process

### What We Look For

- ✅ Code follows project conventions
- ✅ Tests pass
- ✅ TypeScript compiles without errors
- ✅ ESLint passes
- ✅ Documentation updated
- ✅ PR description explains changes
- ✅ Commits are clean and focused

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] Tests pass
- [ ] Build succeeds
```

## Getting Help

- 📖 Check the [DEVELOPMENT.md](DEVELOPMENT.md) guide
- 💬 Open a GitHub Discussion
- 🐛 Create an issue for bugs
- 💡 Create an issue for feature requests

## Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for their contributions
- Git commit history

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
