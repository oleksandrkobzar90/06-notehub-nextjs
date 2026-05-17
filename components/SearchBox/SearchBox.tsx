import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (search: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const handleSearch = (value: string) => {
    onSearch(value);
  };

  return (
    <input
      className={css.input}
      type="text"
      name="search"
      autoComplete="off"
      placeholder="Search notes"
      autoFocus
      onChange={e => handleSearch(e.target.value)}
    />
  );
};

export default SearchBox;
