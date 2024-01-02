'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import axios from 'axios';
import qs from 'query-string';

import { Input } from '@/components/ui/input';
import { Plus, SendHorizonal, Slash } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '@/components/emoji-picker';
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'channel' | 'conversation';
}

const formSchema = z.object({
  content: z.string().min(1),
});
export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6 '>
                  <button
                    type='button'
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500
                   dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'>
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    {...field}
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 
                    border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-500 dark:text-zinc-200'
                    disabled={isLoading}
                  />
                  <div className='absolute top-7 right-8 flex'>
                    <EmojiPicker
                      onChange={(emoji: string) => {
                        field.onChange(`${field.value} ${emoji}`);
                      }}
                    />
                    <p className='flex item-center text-zinc-400 ml-2 text-md'>
                      |
                    </p>

                    <SendHorizonal
                      className='ml-2 text-zinc-400 cursor-pointer'
                      type='submit'
                      onClick={form.handleSubmit(onSubmit)}
                    />
                  </div>{' '}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
