# 🏗️ Architecture Documentation

## Overview

This project implements **Hexagonal Architecture** (also known as Ports & Adapters) combined with **Vertical Slice Architecture**. This document explains the architectural decisions and patterns used.

## Table of Contents

1. [Hexagonal Architecture](#hexagonal-architecture)
2. [Vertical Slice Architecture](#vertical-slice-architecture)
3. [Layer Responsibilities](#layer-responsibilities)
4. [Dependency Rules](#dependency-rules)
5. [Data Flow](#data-flow)
6. [Design Decisions](#design-decisions)

---

## Hexagonal Architecture

### Core Concept

The application is organized in concentric layers, with the **Domain** at the center and **Infrastructure** at the edges. The domain is completely isolated from external concerns.

```
┌─────────────────────────────────────┐
│         Infrastructure              │  ← Adapters (DB, HTTP, UI)
│  ┌─────────────────────────────┐   │
│  │       Application           │   │  ← Use Cases
│  │  ┌─────────────────────┐   │   │
│  │  │      Domain         │   │   │  ← Business Logic
│  │  └─────────────────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Why Hexagonal?

- **Testability**: Test business logic without databases or HTTP
- **Flexibility**: Swap implementations without changing business logic
- **Maintainability**: Clear boundaries between layers
- **Independence**: Domain doesn't know about infrastructure

---

## Vertical Slice Architecture

### Core Concept

Instead of organizing code by technical layers (controllers, services, repositories), we organize by **features**. Each feature contains all its layers.

### Structure

```
features/
├── timer-tracking/        ← Complete feature
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
└── user-management/       ← Another feature (future)
    ├── domain/
    ├── application/
    └── ...
```

### Why Vertical Slices?

- **Cohesion**: Related code stays together
- **Isolation**: Features don't interfere with each other
- **Scalability**: Add features without refactoring existing ones
- **Team Work**: Different teams can work on different features

---

## Layer Responsibilities

### 1. Domain Layer 🟣

**Location**: `features/{feature}/domain/`

**Responsibility**: Core business logic and rules

**Contains**:

- Types and interfaces (`*.types.ts`)
- Factory functions (`*.factory.ts`)
- Business utilities (`*.utils.ts`)
- Validation schemas (Zod)

**Rules**:

- ❌ NO external dependencies (no imports from other layers)
- ❌ NO framework-specific code (no Next.js, React, etc.)
- ✅ Pure functions and immutable data
- ✅ Framework-agnostic TypeScript

**Example**:

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

---

### 2. Application Layer 🔵

**Location**: `features/{feature}/application/`

**Responsibility**: Orchestrate business logic, define contracts

**Contains**:

- **Ports** (interfaces): `ports/*.ts`
- **Use Cases**: `use-cases/*.ts`

**Rules**:

- ✅ Can import from Domain
- ❌ CANNOT import from Infrastructure or Presentation
- ✅ Defines interfaces (ports) for external dependencies
- ✅ Implements business workflows

**Example - Port (Interface)**:

```typescript
// application/ports/time-record.repository.ts
export type TimeRecordRepository = {
  save: (record: TimeRecord) => Promise<TimeRecord>;
  findAll: () => Promise<TimeRecord[]>;
};
```

**Example - Use Case**:

```typescript
// application/use-cases/save-time-record.ts
export const saveTimeRecordUseCase = async (
  input: CreateTimeRecordInput
): Promise<Result<void>> => {
  const record = createTimeRecord(input);
  await timeRecordRepository.save(record);
  return { success: true };
};
```

---

### 3. Infrastructure Layer 🟢

**Location**: `features/{feature}/infrastructure/`

**Responsibility**: Implement technical details and external integrations

**Contains**:

- **Primary Adapters** (input): `http/*.ts` - Server Actions, API routes
- **Secondary Adapters** (output): `persistence/*.ts` - Database, external APIs

**Rules**:

- ✅ Can import from Application and Domain
- ✅ Implements the interfaces (ports) defined in Application
- ✅ Framework-specific code lives here

**Types of Adapters**:

#### Primary Adapters (Driving/Input)

Receive requests from the outside world and call use cases.

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

#### Secondary Adapters (Driven/Output)

Implement ports defined by the application layer.

```typescript
// infrastructure/persistence/in-memory-time-record.repository.ts
export const createInMemoryRepository = (): TimeRecordRepository => {
  const records: TimeRecord[] = [];

  return {
    save: async (record) => {
      records.push(record);
      return record;
    },
    findAll: async () => [...records],
  };
};
```

---

### 4. Presentation Layer 🟠

**Location**: `features/{feature}/presentation/`

**Responsibility**: User interface (UI)

**Contains**:

- React components
- UI state management
- Client-side interactions

**Rules**:

- ✅ Only imports from Infrastructure (Primary Adapters - Server Actions)
- ❌ NEVER imports from Application or Domain directly
- ✅ Pure UI logic, no business rules

**Example**:

```typescript
// presentation/components/timer-page.tsx
'use client';

import { saveTimeRecordAction } from '../../infrastructure/http/time-record.actions';

export function TimerPage() {
  const handleSave = async () => {
    const result = await saveTimeRecordAction(description, seconds);
    // Update UI...
  };
}
```

---

## Dependency Rules

### The Dependency Rule

> **Source code dependencies must point inward, toward higher-level policies.**

```
Presentation
    ↓ (can import)
Infrastructure (Primary)
    ↓ (can import)
Application
    ↓ (can import)
Domain
    ↓ (imports NOTHING)
```

### Allowed Dependencies

| From Layer     | Can Import                           |
| -------------- | ------------------------------------ |
| Domain         | ❌ Nothing                           |
| Application    | ✅ Domain                            |
| Infrastructure | ✅ Domain, Application               |
| Presentation   | ✅ Infrastructure (Primary Adapters) |

### Dependency Inversion Principle

Application defines **interfaces (ports)**, Infrastructure implements them:

```typescript
// Application defines the contract
export type TimeRecordRepository = {
  save: (record: TimeRecord) => Promise<TimeRecord>;
};

// Infrastructure implements it
export const createPostgresRepository = (): TimeRecordRepository => {
  return {
    save: async (record) => {
      // PostgreSQL implementation
    },
  };
};
```

---

## Data Flow

### Complete Request Flow

```
1. User clicks button
   ↓
2. React Component (Presentation)
   ↓
3. Server Action (Infrastructure - Primary Adapter)
   ↓
4. Use Case (Application)
   ↓
5. Domain Logic (Domain)
   ↓
6. Repository Port (Application - Interface)
   ↓
7. Repository Implementation (Infrastructure - Secondary Adapter)
   ↓
8. Database / Storage
```

### Example Flow: Saving a Time Record

```typescript
// 1. USER ACTION (Presentation)
<button onClick={handleSave}>Save</button>;

// 2. COMPONENT HANDLER (Presentation)
const handleSave = async () => {
  const result = await saveTimeRecordAction(description, seconds);
};

// 3. SERVER ACTION (Infrastructure - Primary)
('use server');
export async function saveTimeRecordAction(
  description: string,
  duration: number
) {
  return await saveTimeRecordUseCase({
    description,
    durationInSeconds: duration,
  });
}

// 4. USE CASE (Application)
export const saveTimeRecordUseCase = async (input: CreateTimeRecordInput) => {
  const record = createTimeRecord(input); // Domain
  await timeRecordRepository.save(record); // Port
};

// 5. DOMAIN LOGIC (Domain)
export const createTimeRecord = (input: CreateTimeRecordInput): TimeRecord => {
  return { id: crypto.randomUUID(), ...input, createdAt: new Date() };
};

// 6. REPOSITORY IMPLEMENTATION (Infrastructure - Secondary)
export const createInMemoryRepository = (): TimeRecordRepository => {
  return {
    save: async (record) => {
      records.push(record);
      return record;
    },
  };
};
```

---

## Design Decisions

### Why Functional Programming?

We use **functions and plain objects** instead of classes:

```typescript
// ✅ Functional approach
type TimeRecord = {
  id: string;
  description: string;
};

const createTimeRecord = (desc: string): TimeRecord => ({
  id: crypto.randomUUID(),
  description: desc,
});

// ❌ Avoided: OOP approach
class TimeRecord {
  constructor(public id: string, public description: string) {}
}
```

**Reasons**:

- Simpler and more testable
- Better TypeScript inference
- Easier to reason about
- No `this` context issues

---

### Why Zod?

Used for **runtime validation** and **type inference**:

```typescript
export const CreateTimeRecordSchema = z.object({
  description: z.string().min(1),
  durationInSeconds: z.number().positive(),
});

export type CreateTimeRecordInput = z.infer<typeof CreateTimeRecordSchema>;
```

**Benefits**:

- Type-safe at compile time AND runtime
- Single source of truth for types and validation
- Clear error messages

---

### Why Server Actions?

Instead of REST API endpoints:

**Traditional**:

```
Component → API Route (/api/records) → Use Case
```

**Server Actions**:

```
Component → Server Action → Use Case
```

**Benefits**:

- Less boilerplate
- Type-safe by default
- Simpler data flow
- Still follows hexagonal architecture (Server Actions = Primary Adapters)

---

### Why InMemory Repository?

For learning purposes, we start with in-memory storage:

**Benefits**:

- No database setup needed
- Fast prototyping
- Easy to understand
- Can be replaced with real DB later (that's the point of ports!)

**Migration Path**:

```typescript
// Easy to swap:
// const repository = createInMemoryRepository();
const repository = createPostgresRepository();
```

---

## Testing Strategy

### Layer-by-Layer Testing

```typescript
// Domain Layer (Unit Tests)
describe('createTimeRecord', () => {
  it('should create a valid record', () => {
    const record = createTimeRecord({
      description: 'Task',
      durationInSeconds: 100,
    });
    expect(record.id).toBeDefined();
  });
});

// Application Layer (Integration Tests)
describe('saveTimeRecordUseCase', () => {
  it('should save record using repository', async () => {
    const mockRepo = createMockRepository();
    const result = await saveTimeRecordUseCase(input);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});

// Infrastructure Layer (Adapter Tests)
describe('InMemoryRepository', () => {
  it('should persist records', async () => {
    const repo = createInMemoryRepository();
    await repo.save(record);
    const all = await repo.findAll();
    expect(all).toContain(record);
  });
});
```

---

## Migration Guide

### Adding a New Feature

1. Create feature folder: `features/my-feature/`
2. Add domain layer (types, factories)
3. Add application layer (ports, use cases)
4. Add infrastructure (adapters)
5. Add presentation (UI)

### Swapping Repository Implementation

```typescript
// Before (InMemory)
import { createInMemoryRepository } from './infrastructure/persistence/in-memory-time-record.repository';

// After (PostgreSQL)
import { createPostgresRepository } from './infrastructure/persistence/postgres-time-record.repository';

// Use case doesn't change!
export const saveTimeRecordUseCase = async (input: CreateTimeRecordInput) => {
  const record = createTimeRecord(input);
  await timeRecordRepository.save(record); // Same interface!
};
```

---

## References

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture by Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/)
