# ⏱️ Time Tracker - Hexagonal Architecture Learning Project

A simple time tracking application built with Next.js 16, demonstrating **Hexagonal Architecture** (Ports & Adapters) combined with **Vertical Slice Architecture**.

## 📸 Screenshot & Demo

### Screenshot

![Time Tracker App Screenshot](./docs/images/app-screenshot.png)

### Video Walkthrough

https://github.com/user-attachments/assets/your-video-filename.mp4

> **Note**: Upload your demo files to the repository:
>
> - Screenshot: `/docs/images/app-screenshot.png`
> - Video: Upload via GitHub's web interface and replace the URL above

## 🎯 Project Purpose

This is an **educational project** designed to learn and understand:

- **Hexagonal Architecture** (Clean Architecture / Ports & Adapters)
- **Vertical Slice Architecture** (feature-based organization)
- **Functional Programming** approach in TypeScript
- **Server Actions** in Next.js 16 (without API routes)
- **Dependency Inversion Principle**

## 🏗️ Architecture Overview

### Hexagonal Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
│         (UI - React Components)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│    Infrastructure - Primary Adapters            │
│         (Server Actions - HTTP)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│          Application Layer                      │
│         (Use Cases / Ports)                     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│            Domain Layer                         │
│       (Business Logic / Entities)               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│   Infrastructure - Secondary Adapters           │
│         (Database / External APIs)              │
└─────────────────────────────────────────────────┘
```

### Vertical Slice Structure

Each feature is self-contained with all its layers:

```
src/features/time-record/
├── domain/              # Business logic
├── application/         # Use cases & ports
├── infrastructure/      # Adapters (HTTP, DB)
└── presentation/        # UI components
```

## 📂 Project Structure

```
src/features/
├── time-record/
│   ├── domain/
│   │   ├── time-record.types.ts      # Types & Zod schemas
│   │   ├── time-record.factory.ts    # Factory functions
│   │   └── time-record.utils.ts      # Domain utilities
│   │
│   ├── application/
│   │   ├── ports/
│   │   │   └── time-record.repository.ts  # Repository interface
│   │   └── use-cases/
│   │       ├── save-time-record.ts
│   │       └── get-all-time-records.ts
│   │
│   ├── infrastructure/
│   │   ├── http/
│   │   │   └── time-record.actions.ts     # Server Actions
│   │   └── persistence/
│   │       ├── supabase-time-record.repository.ts  # Supabase implementation
│   │       └── repository.instance.ts     # DI Container
│   │
│   └── presentation/
│       └── components/
│           ├── timer.tsx              # Main timer component
│           ├── timer-form.tsx         # Timer form
│           ├── time-records-list.tsx  # Records list
│           └── time-record-item.tsx   # Individual record
│
├── auth/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
└── shared/
    └── infrastructure/
        └── persistence/
            └── supabase-middleware.ts

app/
└── page.tsx          # Next.js App Router page (imports from presentation)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables for local development
cp .env.local.example .env.local
# Add your local Supabase URL and anon key

# Run local Supabase (optional, if using Supabase locally)
npx supabase start

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🚀 Deployment

To deploy to production:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Update environment variables:
   ```bash
   # .env.production or deployment platform settings
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   ```
3. Deploy to your platform (Vercel, etc.)

**No code changes needed!** The same repository implementation works with both local and cloud Supabase instances.

### 🔐 Authentication

**Transparent Anonymous Authentication**: Users are automatically signed in anonymously when they visit the app. No user interaction required - just start tracking time!

- **Middleware-based**: Authentication handled in Next.js middleware
- **Server-side**: No client-side auth state management
- **Fallback system**: Dual-layer user creation for reliability
- **RLS compliant**: Works seamlessly with Supabase Row Level Security

## 🧪 Key Concepts Demonstrated

### 1. Domain Layer (Core Business Logic)

Pure business logic with **no external dependencies**:

```typescript
// domain/time-record.factory.ts
export const createTimeRecord = (input: CreateTimeRecordInput): TimeRecord => {
  const validated = CreateTimeRecordSchema.parse(input);

  return {
    id: crypto.randomUUID(),
    description: validated.description.trim(),
    durationInSeconds: validated.durationInSeconds,
    createdAt: new Date(),
  };
};
```

### 2. Application Layer (Use Cases)

Orchestrates domain logic, defines **ports** (interfaces):

```typescript
// application/ports/time-record.repository.ts
export type TimeRecordRepository = {
  save: (record: TimeRecord) => Promise<TimeRecord>;
  findAll: () => Promise<TimeRecord[]>;
};

// application/use-cases/save-time-record.ts
import { timeRecordRepository } from '../../infrastructure/persistence/repository.instance';

export const saveTimeRecordUseCase = async (
  input: CreateTimeRecordInput
): Promise<Result<void>> => {
  const record = createTimeRecord(input);
  await timeRecordRepository.save(record); // Uses DI Container
  return { success: true };
};
```

### 3. Infrastructure Layer (Adapters)

**Primary Adapters** (Input - Server Actions):

```typescript
// infrastructure/http/time-record.actions.ts
'use server';
export async function saveTimeRecordAction(
  description: string,
  duration: number
) {
  return await saveTimeRecordUseCase({
    description,
    durationInSeconds: duration,
  });
}
```

**Secondary Adapters** (Output - Repository + DI Container):

```typescript
// infrastructure/persistence/supabase-time-record.repository.ts
export const createSupabaseRepository = (): TimeRecordRepository => {
  return {
    save: async (record) => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('time_records')
        .insert(record)
        .select()
        .single();
      return data;
    },
    findAll: async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('time_records')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  };
};

// infrastructure/persistence/repository.instance.ts (DI Container)
import { createSupabaseRepository } from './supabase-time-record.repository';

// Single source of truth for repository instance
export const timeRecordRepository = createSupabaseRepository();
```

### 4. Presentation Layer (UI)

Pure React components that call Server Actions:

```typescript
// presentation/components/timer-form.tsx
'use client';

import { saveTimeRecordAction } from '../../infrastructure/http/time-record.actions';

export function TimerForm() {
  const handleSave = async () => {
    const result = await saveTimeRecordAction(description, seconds);
    // Handle result...
  };

  return <form>{/* Form fields */}</form>;
}

// app/page.tsx (Next.js App Router)
import { Timer } from '@/features/time-record/presentation/components/timer';

export default async function HomePage() {
  return (
    <main>
      <Timer />
    </main>
  );
}
```

## 🎓 Learning Resources

### Dependency Flow

```
App Router Page → Presentation Components → Server Actions (Infrastructure Primary)
→ Use Cases (Application) → Domain Logic → Repository Instance (DI Container)
→ Repository Implementation (Infrastructure Secondary) → Database
```

**Golden Rule**: Inner layers should NOT depend on outer layers.

### Why This Architecture?

- ✅ **Testable**: Each layer can be tested independently
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Flexible**: Easy to swap implementations (e.g., change database technology)
- ✅ **Environment-Ready**: Switch between local/production via environment variables only
- ✅ **Scalable**: Add features without affecting existing code

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase (Anonymous users)
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📝 Features

- ⏱️ Start/Stop timer
- 💾 Save time records with descriptions
- 📋 View history of tracked time
- 🔐 Anonymous authentication (Supabase)
- ✅ Input validation with Zod

## 🔄 Next Steps (Future Enhancements)

- [x] Replace InMemory repository with Supabase PostgreSQL
- [x] Add anonymous authentication with RLS
- [x] Implement middleware-based auth (no React Context)
- [x] Transparent anonymous user creation
- [x] Add DI Container pattern for repository instances
- [ ] Add editing/deleting records
- [ ] Add categories/tags
- [ ] Export data to CSV
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add user registration/login (upgrade from anonymous)

## 📚 Further Reading

- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture (Jimmy Bogard)](https://www.jimmybogard.com/vertical-slice-architecture/)

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Note**: This project prioritizes **clarity and learning** over production-ready features. The goal is to understand architectural patterns, not to build a complete application.
