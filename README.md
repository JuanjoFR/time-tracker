# ⏱️ Time Tracker - Hexagonal Architecture Learning Project

A simple time tracking application built with Next.js 16, demonstrating **Hexagonal Architecture** (Ports & Adapters) combined with **Vertical Slice Architecture**.

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
src/
├── features/
│   └── time-record/
│       ├── domain/
│       │   ├── time-record.types.ts      # Types & Zod schemas
│       │   ├── time-record.factory.ts    # Factory functions
│       │   └── time-record.utils.ts      # Domain utilities
│       │
│       ├── application/
│       │   ├── ports/
│       │   │   └── time-record.repository.ts  # Repository interface
│       │   └── use-cases/
│       │       ├── save-time-record.ts
│       │       └── get-all-time-records.ts
│       │
│       ├── infrastructure/
│       │   ├── http/
│       │   │   └── time-record.actions.ts     # Server Actions
│       │   └── persistence/
│       │       ├── supabase-time-record.repository.ts
│       │       └── repository.instance.ts     # DI Container
│       │
│       └── presentation/
│           └── components/
│               └── timer-page.tsx
│
└── app/
    └── page.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

**Secondary Adapters** (Output - Repository):

```typescript
// infrastructure/persistence/supabase-time-record.repository.ts
export const createSupabaseRepository = (): TimeRecordRepository => {
  return {
    save: async (record) => {
      const supabase = await createClient();
      const { data } = await supabase.from('time_records').insert(record);
      return data;
    },
  };
};

// infrastructure/persistence/repository.instance.ts (DI Container)
export const timeRecordRepository = createSupabaseRepository();
```

### 4. Presentation Layer (UI)

Pure React components that call Server Actions:

```typescript
// presentation/components/timer-page.tsx
const handleSave = async () => {
  const result = await saveTimeRecordAction(description, seconds);
  // Handle result...
};
```

## 🎓 Learning Resources

### Dependency Flow

```
Presentation → Infrastructure (Primary) → Application → Domain ← Infrastructure (Secondary)
```

**Golden Rule**: Inner layers should NOT depend on outer layers.

### Why This Architecture?

- ✅ **Testable**: Each layer can be tested independently
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Flexible**: Easy to swap implementations (e.g., change from Supabase to other databases)
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
- [x] Implement middleware-based auth (no useEffect)
- [ ] Add editing/deleting records
- [ ] Add categories/tags
- [ ] Export data to CSV
- [ ] Add unit tests

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
