import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotePageProps {
  searchParams: {
    search: string;
    page: number;
  };
}

const NotesPage = async ({ searchParams }: NotePageProps) => {
  const search = searchParams.search ?? '';
  const page = Number(searchParams.page ?? 1);

  const data = await fetchNotes(search, page);

  return (
    <NotesClient initialSearch={search} initialPage={page} initialData={data} />
  );
};

export default NotesPage;
