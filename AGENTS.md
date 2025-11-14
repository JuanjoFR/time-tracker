# 🤖 AI Agents Guide

This document provides guidance for AI agents (like Claude, GitHub Copilot, Cursor, etc.) working on this codebase.

## Project Context

This is a **learning project** focused on demonstrating **Hexagonal Architecture** and **Vertical Slice Architecture** in Next.js 16.

**Priority**: Code clarity and educational value over performance optimization or advanced features.

---

## Architecture Rules (CRITICAL)

### Layer Dependencies

**NEVER violate these dependency rules**:

```
Domain ← Application ← Infrastructure → Presentation
  ↑          ↑              ↑
  └──────────┴──────────────┘
     Can only import inward
```

| Layer          | Can Import From                  | CANNOT Import From           |
| -------------- | -------------------------------- | ---------------------------- |
| Domain         | ❌ Nothing                       | Everything                   |
| Application    | ✅ Domain                        | Infrastructure, Presentation |
| Infrastructure | ✅ Domain, Application           | Presentation                 |
| Presentation   | ✅ Infrastructure (Primary only) | Application, Domain          |

### File Organization

Each feature follows this structure:

```
features/{feature-name}/
├── domain/
│   ├── {entity}.types.ts      # Types, Zod schemas
│   ├── {entity}.factory.ts    # Factory functions
│   └── {entity}.utils.ts      # Domain utilities
│
├── application/
│   ├── ports/
│   │   └── {entity}.repository.ts  # Interfaces
│   └── use-cases/
│       └── {action}-{entity}.ts
│
├── infrastructure/
│   ├── http/
│   │   └── {entity}.actions.ts     # Server Actions
│   └── persistence/
│       └── {implementation}-{entity}.repository.ts
│
└── presentation/
    └── components/
        └── {feature}-page.tsx
```

---

## Code Style Guidelines

### 1. Use Functional Programming

**DO**:

```typescript
// Plain objects
type TimeRecord = {
  id: string;
  description: string;
};

// Factory functions (not singletons!)
export const createTimeRecord = (input: CreateInput): TimeRecord => ({
  id: crypto.randomUUID(),
  ...input,
});

// Factory for repositories
export const createInMemoryRepository = (): TimeRecordRepository => {
  const records: TimeRecord[] = [];
  return {
    save: async (record) => {
      /* ... */
    },
  };
};
```

**DON'T**:

```typescript
// Classes
class TimeRecord {
  constructor(public id: string) {}
}

// Singleton exports from repository
const records: TimeRecord[] = [];
export const repository = {
  save: async () => {},
}; // ❌ Export factory function instead
```

### 2. Use Zod for Validation

**DO**:

```typescript
export const TimeRecordSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  durationInSeconds: z.number().positive(),
});

export type TimeRecord = z.infer<typeof TimeRecordSchema>;
```

### 3. Use Server Actions (Not API Routes)

**DO**:

```typescript
// infrastructure/http/{entity}.actions.ts
'use server';

export async function saveRecordAction(input: Input) {
  return await saveRecordUseCase(input);
}
```

**DON'T**:

```typescript
// app/api/records/route.ts (avoid)
export async function POST(request: Request) {
  // ...
}
```

### 4. Type-Safe Error Handling

**DO**:

```typescript
type Result<T> = { success: true; data: T } | { success: false; error: string };

export const myUseCase = async (): Promise<Result<Data>> => {
  try {
    // logic
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 5. UI/UX Guidelines

**Follow [Vercel Design Guidelines](https://vercel.com/design/guidelines)** for:

- Component design patterns
- Color schemes and typography
- Spacing and layout consistency
- Interactive states and animations
- Accessibility standards

When creating presentation components, reference these guidelines to maintain professional, consistent user interfaces.

---

## When Adding New Code

### Adding a New Feature

1. **Create feature folder**:

   ```
   src/features/{new-feature}/
   ```

2. **Start with Domain**:

   - Define types in `domain/{entity}.types.ts`
   - Add validation schemas (Zod)
   - Create factory functions

3. **Add Application layer**:

   - Define ports (interfaces) in `application/ports/`
   - Implement use cases in `application/use-cases/`

4. **Add Infrastructure**:

   - Create Server Actions in `infrastructure/http/`
   - Implement repositories in `infrastructure/persistence/`

5. **Add Presentation**:
   - Create UI components in `presentation/components/`

### Modifying Existing Code

**Check dependencies first**:

- If changing Domain → May affect all layers
- If changing Application → May affect Infrastructure and Presentation
- If changing Infrastructure → Should not affect Application or Domain

**Run mental dependency check**:

```
Domain uses → Nothing ✓
Application uses → Domain only ✓
Infrastructure uses → Domain + Application ✓
Presentation uses → Infrastructure (Primary Adapters) only ✓
```

---

## Common Tasks

### Task: Add a new field to TimeRecord

1. **Update Domain** (`domain/time-record.types.ts`):

   ```typescript
   export const TimeRecordSchema = z.object({
     // existing fields...
     newField: z.string(), // Add here
   });
   ```

2. **Update Factory** if needed (`domain/time-record.factory.ts`)

3. **Update UI** (`presentation/components/timer-page.tsx`)

4. **No changes needed** in Application or Infrastructure (ports stay the same)

---

### Task: Swap Database Implementation

To change from Supabase to a different database:

```typescript
// infrastructure/persistence/repository.instance.ts

// Before (Supabase)
import { createSupabaseRepository } from './supabase-time-record.repository';
export const timeRecordRepository = createSupabaseRepository();

// After (Different Database) - Change in ONE file only!
import { createPostgresRepository } from './postgres-time-record.repository';
export const timeRecordRepository = createPostgresRepository();
```

**Benefits of hexagonal architecture**:

- ✅ Zero changes needed in Domain, Application, or Presentation layers
- ✅ Environment switching (dev/prod) handled by configuration only
- ✅ Clean separation between business logic and technical implementation

---

### Task: Add a new use case

1. **Create use case file** (`application/use-cases/delete-time-record.ts`):

   ```typescript
   export const deleteTimeRecordUseCase = async (
     id: string
   ): Promise<Result<void>> => {
     // Implementation
   };
   ```

2. **Add to port** if new repository method needed:

   ```typescript
   export type TimeRecordRepository = {
     // existing methods...
     delete: (id: string) => Promise<void>; // Add if needed
   };
   ```

3. **Implement in adapter** (`infrastructure/persistence/...`):

   ```typescript
   // supabase-time-record.repository.ts
   export const createSupabaseRepository = (): TimeRecordRepository => {
     return {
       delete: async (id) => {
         const supabase = await createClient();
         await supabase.from('time_records').delete().eq('id', id);
       },
     };
   };
   ```

4. **Update DI Container** (`infrastructure/persistence/repository.instance.ts`):

   ```typescript
   // Re-export updated instance
   export const timeRecordRepository = createSupabaseRepository();
   ```

5. **Create Server Action** (`infrastructure/http/time-record.actions.ts`):

   ```typescript
   'use server';
   export async function deleteTimeRecordAction(id: string) {
     return await deleteTimeRecordUseCase(id);
   }
   ```

6. **Call from UI** (`presentation/components/...`)

---

## Testing Guidance

### Unit Tests (Domain)

Test pure functions in isolation:

```typescript
// domain/time-record.factory.test.ts
import { createTimeRecord } from './time-record.factory';

describe('createTimeRecord', () => {
  it('should create a valid record', () => {
    const record = createTimeRecord({
      description: 'Test task',
      durationInSeconds: 100,
    });

    expect(record.id).toBeDefined();
    expect(record.description).toBe('Test task');
  });

  it('should throw on invalid input', () => {
    expect(() =>
      createTimeRecord({
        description: '',
        durationInSeconds: -1,
      })
    ).toThrow();
  });
});
```

### Integration Tests (Application)

Test use cases with mock repositories:

```typescript
// application/use-cases/save-time-record.test.ts
import { saveTimeRecordUseCase } from './save-time-record';

const mockRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
};

describe('saveTimeRecordUseCase', () => {
  it('should save record through repository', async () => {
    const result = await saveTimeRecordUseCase({
      description: 'Task',
      durationInSeconds: 100,
    });

    expect(result.success).toBe(true);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

---

## Common Mistakes to Avoid

### ❌ DON'T: Import Use Cases in Presentation

```typescript
// presentation/components/timer-page.tsx
import { saveTimeRecordUseCase } from '../../application/use-cases/save-time-record'; // ❌ WRONG
```

**Why**: Presentation should only know about Infrastructure (Primary Adapters).

**Fix**: Use Server Actions:

```typescript
import { saveTimeRecordAction } from '../../infrastructure/http/time-record.actions'; // ✅ CORRECT
```

---

### ❌ DON'T: Import Infrastructure in Domain

```typescript
// domain/time-record.factory.ts
import { prisma } from '@/lib/db'; // ❌ WRONG

export const createTimeRecord = async () => {
  await prisma.timeRecord.create(...); // ❌ WRONG
};
```

**Why**: Domain should be pure and have no external dependencies.

**Fix**: Keep Domain pure, do persistence in Infrastructure:

```typescript
// domain/time-record.factory.ts
export const createTimeRecord = (input: Input): TimeRecord => {
  return { id: crypto.randomUUID(), ...input }; // ✅ CORRECT
};

// infrastructure/persistence/prisma-repository.ts
export const save = async (record: TimeRecord) => {
  await prisma.timeRecord.create({ data: record }); // ✅ CORRECT
};
```

---

### ❌ DON'T: Put Business Logic in Server Actions

```typescript
// infrastructure/http/time-record.actions.ts
'use server';
export async function saveTimeRecordAction(input: Input) {
  // ❌ WRONG: Business logic in infrastructure
  if (input.durationInSeconds < 0) {
    throw new Error('Invalid duration');
  }

  await repository.save({ ...input, id: crypto.randomUUID() });
}
```

**Fix**: Business logic belongs in Domain:

```typescript
// domain/time-record.factory.ts
export const createTimeRecord = (input: Input): TimeRecord => {
  CreateTimeRecordSchema.parse(input); // ✅ Validation in domain
  return { id: crypto.randomUUID(), ...input };
};

// infrastructure/http/time-record.actions.ts
('use server');
export async function saveTimeRecordAction(input: Input) {
  return await saveTimeRecordUseCase(input); // ✅ Delegate to use case
}
```

---

## Quick Reference

### Where does X go?

| What                     | Layer          | Location                                     |
| ------------------------ | -------------- | -------------------------------------------- |
| Type definitions         | Domain         | `domain/{entity}.types.ts`                   |
| Validation schemas (Zod) | Domain         | `domain/{entity}.types.ts`                   |
| Business rules           | Domain         | `domain/{entity}.factory.ts` or `.utils.ts`  |
| Repository interfaces    | Application    | `application/ports/{entity}.repository.ts`   |
| Use case orchestration   | Application    | `application/use-cases/{action}-{entity}.ts` |
| Server Actions           | Infrastructure | `infrastructure/http/{entity}.actions.ts`    |
| Database implementation  | Infrastructure | `infrastructure/persistence/*.repository.ts` |
| React components         | Presentation   | `presentation/components/*.tsx`              |

---

## Prompting Tips for AI Agents

When asking for code modifications:

**Good prompts**:

- "Add a new field `category` to TimeRecord, following hexagonal architecture"
- "Create a new use case to delete time records"
- "Add environment-based configuration for Supabase local vs production"

**Bad prompts**:

- "Just add the feature quickly" (might violate architecture)
- "Put everything in one file" (breaks separation of concerns)

**Always specify**:

- Which layer should be modified
- Whether new interfaces/ports are needed
- If multiple layers need updates

---

## Resources

- See `ARCHITECTURE.md` for detailed architecture documentation
- See `README.md` for project overview
- Check existing code in `src/features/time-record/` as examples
- **UI Guidelines**: [Vercel Design Guidelines](https://vercel.com/design/guidelines)

---

## Questions to Ask Before Making Changes

1. **Which layer does this change belong to?**

   - Domain, Application, Infrastructure, or Presentation?

2. **Does this create a dependency violation?**

   - Check the dependency rules table above

3. **Do I need to update interfaces (ports)?**

   - If changing how layers communicate, update ports first

4. **Is this business logic or technical implementation?**

   - Business logic → Domain
   - Technical implementation → Infrastructure

5. **Will this change affect multiple features?**
   - If yes, consider shared utilities in a common folder
   - If no, keep it within the feature folder

---

**Remember**: When in doubt, prefer clarity over cleverness. This is a learning project!
