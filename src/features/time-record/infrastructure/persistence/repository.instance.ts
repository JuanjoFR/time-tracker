// src/features/time-record/infrastructure/persistence/repository.instance.ts

import { createSupabaseRepository } from './supabase-time-record.repository';

/**
 * Dependency Injection Container
 *
 * This file manages the repository instance.
 * In a real application, this would be replaced by a proper DI container
 * or configuration system that allows swapping implementations.
 */

// Create singleton instance
// This is the ONLY place where we instantiate the repository
export const timeRecordRepository = createSupabaseRepository();

/**
 * To swap implementations (e.g., from Supabase to different database):
 *
 * import { createPostgresRepository } from './postgres-time-record.repository';
 * export const timeRecordRepository = createPostgresRepository();
 *
 * Use cases don't need to change - that's the power of hexagonal architecture!
 */
