import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: {
    search?: string;
    page?: string;
  };
};

const NotesPage = async ({ params }: Props) => {
  const search = params.search ?? '';
  const page = Number(params.page ?? 1);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialSearch={search} initialPage={page} />
    </HydrationBoundary>
  );
};

export default NotesPage;
