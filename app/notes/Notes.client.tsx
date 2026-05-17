'use client';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import css from '@/components/NotesPage/NotesPage.module.css';
import { Note } from '@/types/note';

interface NotesClientProps {
  initialSearch: string;
  initialPage: number;
}

const NotesClient = ({ initialSearch, initialPage }: NotesClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', search, currentPage],
    queryFn: () => fetchNotes(search, currentPage),
    placeholderData: keepPreviousData,
    throwOnError: true,
  });

  const handleSearch = useDebouncedCallback((newQuery: string) => {
    setSearch(newQuery.trim());
    setCurrentPage(1);
  }, 1000);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
};

export default NotesClient;
