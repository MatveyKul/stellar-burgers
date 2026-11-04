import { useEffect } from 'react';
import { ConstructorPage } from '@pages';
import clsx from 'clsx';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients/slice';
import { getUser } from '../../services/user/slice';
import {
  selectIngredientsLoading,
  selectIngredientsError,
  selectIsAuthChecked
} from '../../services/selectors';

const App = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <div className='text text_type_main-medium pt-10'>
                Загрузка...
              </div>
            ) : error ? (
              <div
                className={clsx(
                  styles.error,
                  'text text_type_main-medium pt-4'
                )}
              >
                {error}
              </div>
            ) : (
              <ConstructorPage />
            )
          }
        />

        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={clsx(
                  styles.detailHeader,
                  'text text_type_main-large'
                )}
              >
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
