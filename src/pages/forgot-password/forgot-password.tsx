import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword, resetError } from '../../services/user/slice';
import { selectUserError } from '../../services/selectors';

export const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const errorText = useSelector(selectUserError);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ForgotPasswordUI
      errorText={errorText ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
