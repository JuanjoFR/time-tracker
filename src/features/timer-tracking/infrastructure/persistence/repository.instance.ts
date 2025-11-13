// src/features/timer-tracking/infrastructure/persistence/repository.instance.ts

import { createInMemoryRepository } from './in-memory-time-record.repository';

/**
 * Dependency Injection Container
 *
 * This file manages the repository instance.
 * In a real application, this would be replaced by a proper DI container
 * or configuration system that allows swapping implementations.
 */

// Create singleton instance
// This is the ONLY place where we instantiate the repository
export const timeRecordRepository = createInMemoryRepository();

/**
 * To swap implementations (e.g., from InMemory to PostgreSQL):
 *
 * import { createPostgresRepository } from './postgres-time-record.repository';
 * export const timeRecordRepository = createPostgresRepository();
 *
 * Use cases don't need to change!
 */
