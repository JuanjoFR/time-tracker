'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play, Square, Save } from 'lucide-react';
import { toast } from 'sonner';
import { saveTimeRecordAction } from '@/features/timer-tracking/infrastructure/http/time-record.actions';
import { formatDuration } from '@/features/timer-tracking/domain/time-record.utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

// Form validation schema
const timerFormSchema = z.object({
  description: z.string().min(1, 'Description is required').trim(),
});

type TimerFormValues = z.infer<typeof timerFormSchema>;

export function TimerCard() {
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form setup
  const form = useForm<TimerFormValues>({
    resolver: zodResolver(timerFormSchema),
    defaultValues: {
      description: '',
    },
  });

  // Timer effect - updates every 100ms for smooth UX
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 0.1);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const onSubmit = async (values: TimerFormValues) => {
    if (seconds === 0) {
      toast.error('Please start the timer before saving');
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveTimeRecordAction(
        values.description,
        Math.round(seconds)
      );

      if (result.success) {
        toast.success('Time record saved successfully!');
        // Clear form and reset timer
        form.reset();
        setSeconds(0);
        setIsRunning(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error saving time record:', error);
      toast.error('Failed to save time record. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = seconds > 0 && !isSaving;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-indigo-600 mb-4">
          {formatDuration(Math.round(seconds))}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            type="button"
            onClick={handleStart}
            disabled={isRunning}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
            size="lg"
          >
            <Play size={20} />
            Start
          </Button>

          <Button
            type="button"
            onClick={handleStop}
            disabled={!isRunning}
            variant="destructive"
            className="flex items-center gap-2"
            size="lg"
          >
            <Square size={20} />
            Stop
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Client meeting, Feature development..."
                      disabled={isSaving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!canSave}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Record'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
