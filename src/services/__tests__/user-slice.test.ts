import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  resetError,
  getUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '../user/slice';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { user, pending } from './fixtures';

jest.mock('../../utils/burger-api');

const mockedGetUserApi = getUserApi as jest.MockedFunction<typeof getUserApi>;
const mockedLoginUserApi = loginUserApi as jest.MockedFunction<
  typeof loginUserApi
>;
const mockedRegisterUserApi = registerUserApi as jest.MockedFunction<
  typeof registerUserApi
>;
const mockedLogoutApi = logoutApi as jest.MockedFunction<typeof logoutApi>;
const mockedUpdateUserApi = updateUserApi as jest.MockedFunction<
  typeof updateUserApi
>;
const mockedForgotPasswordApi = forgotPasswordApi as jest.MockedFunction<
  typeof forgotPasswordApi
>;
const mockedResetPasswordApi = resetPasswordApi as jest.MockedFunction<
  typeof resetPasswordApi
>;

const createTestStore = () =>
  configureStore({ reducer: { user: userReducer } });

const getState = (store: ReturnType<typeof createTestStore>) =>
  store.getState().user;

const authResponse = {
  success: true,
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user
};

const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();

    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
};

describe('user slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    clearCookies();
  });

  test('возвращает начальное состояние', () => {
    const store = createTestStore();

    expect(getState(store)).toEqual(initialState);
  });

  describe('getUser', () => {
    test('переводит состояние в pending', () => {
      mockedGetUserApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(getUser());

      expect(getState(store).isLoading).toBe(true);
    });

    test('сохраняет пользователя при fulfilled', async () => {
      mockedGetUserApi.mockResolvedValue({ success: true, user });

      const store = createTestStore();
      await store.dispatch(getUser());

      expect(getState(store)).toEqual({
        user,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });

    test('сбрасывает пользователя и завершает проверку при rejected', async () => {
      mockedGetUserApi.mockRejectedValue(new Error('Не авторизован'));

      const store = createTestStore();
      await store.dispatch(getUser()).catch(() => undefined);

      expect(getState(store)).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });
  });

  describe('loginUser', () => {
    test('переводит состояние в pending', () => {
      mockedLoginUserApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(loginUser({ email: user.email, password: 'secret' }));

      expect(getState(store)).toMatchObject({
        isLoading: true,
        error: null
      });
    });

    test('сохраняет пользователя и токены при fulfilled', async () => {
      mockedLoginUserApi.mockResolvedValue(authResponse);

      const store = createTestStore();
      await store.dispatch(
        loginUser({ email: user.email, password: 'secret' })
      );

      expect(getState(store)).toEqual({
        user,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(document.cookie).toContain('accessToken=');
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedLoginUserApi.mockRejectedValue(new Error('Ошибка входа'));

      const store = createTestStore();
      await store
        .dispatch(loginUser({ email: user.email, password: 'wrong' }))
        .catch(() => undefined);

      expect(getState(store)).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: 'Ошибка входа'
      });
    });
  });

  describe('registerUser', () => {
    test('переводит состояние в pending', () => {
      mockedRegisterUserApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(
        registerUser({ email: user.email, name: user.name, password: 'pass' })
      );

      expect(getState(store).isLoading).toBe(true);
    });

    test('сохраняет пользователя и токены при fulfilled', async () => {
      mockedRegisterUserApi.mockResolvedValue(authResponse);

      const store = createTestStore();
      await store.dispatch(
        registerUser({ email: user.email, name: user.name, password: 'pass' })
      );

      expect(getState(store)).toEqual({
        user,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedRegisterUserApi.mockRejectedValue(new Error('Ошибка регистрации'));

      const store = createTestStore();
      await store
        .dispatch(
          registerUser({
            email: user.email,
            name: user.name,
            password: 'pass'
          })
        )
        .catch(() => undefined);

      expect(getState(store).error).toBe('Ошибка регистрации');
      expect(getState(store).isLoading).toBe(false);
    });
  });

  describe('logoutUser', () => {
    test('переводит состояние в pending', () => {
      mockedLogoutApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(logoutUser());

      expect(getState(store).isLoading).toBe(true);
    });

    test('очищает пользователя и оба токена при fulfilled', async () => {
      mockedLogoutApi.mockResolvedValue({ success: true });

      const store = createTestStore();
      store.dispatch(getUser.fulfilled({ success: true, user }, 'request-id'));
      localStorage.setItem('refreshToken', 'refresh-token');
      document.cookie = 'accessToken=access-token; path=/';

      expect(getState(store).user).toEqual(user);
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(document.cookie).toContain('accessToken=access-token');

      await store.dispatch(logoutUser());

      expect(getState(store)).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(document.cookie).not.toContain('accessToken=');
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedLogoutApi.mockRejectedValue(new Error('Ошибка выхода'));

      const store = createTestStore();
      await store.dispatch(logoutUser()).catch(() => undefined);

      expect(getState(store).error).toBe('Ошибка выхода');
      expect(getState(store).isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    test('переводит состояние в pending', () => {
      mockedUpdateUserApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(updateUser({ name: 'Новое имя' }));

      expect(getState(store).isLoading).toBe(true);
      expect(getState(store).error).toBeNull();
    });

    test('обновляет пользователя при fulfilled', async () => {
      const updatedUser = { ...user, name: 'Новое имя' };
      mockedUpdateUserApi.mockResolvedValue({
        success: true,
        user: updatedUser
      });

      const store = createTestStore();
      await store.dispatch(updateUser({ name: 'Новое имя' }));

      expect(getState(store)).toEqual({
        user: updatedUser,
        isAuthChecked: false,
        isLoading: false,
        error: null
      });
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedUpdateUserApi.mockRejectedValue(
        new Error('Ошибка обновления данных')
      );

      const store = createTestStore();
      await store
        .dispatch(updateUser({ name: 'Новое имя' }))
        .catch(() => undefined);

      expect(getState(store).error).toBe('Ошибка обновления данных');
    });
  });

  describe('forgotPassword', () => {
    test('переводит состояние в pending', () => {
      mockedForgotPasswordApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(forgotPassword({ email: user.email }));

      expect(getState(store).isLoading).toBe(true);
    });

    test('завершает загрузку при fulfilled', async () => {
      mockedForgotPasswordApi.mockResolvedValue({ success: true });

      const store = createTestStore();
      await store.dispatch(forgotPassword({ email: user.email }));

      expect(getState(store)).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      });
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedForgotPasswordApi.mockRejectedValue(
        new Error('Ошибка восстановления пароля')
      );

      const store = createTestStore();
      await store
        .dispatch(forgotPassword({ email: user.email }))
        .catch(() => undefined);

      expect(getState(store).error).toBe('Ошибка восстановления пароля');
      expect(getState(store).isLoading).toBe(false);
    });
  });

  describe('resetPassword', () => {
    test('переводит состояние в pending', () => {
      mockedResetPasswordApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(resetPassword({ password: 'pass', token: 'token' }));

      expect(getState(store).isLoading).toBe(true);
    });

    test('завершает загрузку при fulfilled', async () => {
      mockedResetPasswordApi.mockResolvedValue({ success: true });

      const store = createTestStore();
      await store.dispatch(resetPassword({ password: 'pass', token: 'token' }));

      expect(getState(store)).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      });
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedResetPasswordApi.mockRejectedValue(
        new Error('Ошибка сброса пароля')
      );

      const store = createTestStore();
      await store
        .dispatch(resetPassword({ password: 'pass', token: 'token' }))
        .catch(() => undefined);

      expect(getState(store).error).toBe('Ошибка сброса пароля');
      expect(getState(store).isLoading).toBe(false);
    });
  });

  test('resetError очищает ошибку', () => {
    const store = createTestStore();
    store.dispatch(
      loginUser.rejected(new Error('Ошибка входа'), 'request-id', {
        email: user.email,
        password: 'wrong'
      })
    );

    store.dispatch(resetError());

    expect(getState(store).error).toBeNull();
  });
});
