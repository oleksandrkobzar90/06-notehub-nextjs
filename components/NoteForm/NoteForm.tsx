import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import * as Yup from 'yup';
import type { NewNote } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNoteAPI } from '@/lib/api';

interface NoteFormProps {
  onClose: () => void;
}

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must contain no more than 50 characters.')
    .required('Required'),
  content: Yup.string().max(
    500,
    'Content must contain no more than 500 characters.'
  ),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

const NoteFormInitialValues: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteForm = ({ onClose }: NoteFormProps) => {
  const handleCloseClick = (): void => {
    onClose();
  };

  const queryClient = useQueryClient();

  const mutationCreate = useMutation({
    mutationFn: createNoteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const handleSubmit = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    mutationCreate.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={NoteFormInitialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          ></Field>
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCloseClick}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutationCreate.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
