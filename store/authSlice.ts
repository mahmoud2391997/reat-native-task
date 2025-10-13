import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mmkvSetString, mmkvDelete } from '@/lib/mmkv';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isSuperAdmin: false,
};

// Superadmin usernames - in a real app this would come from a secure source
const SUPER_ADMIN_USERNAMES = ['superadmin', 'admin', 'emilys'];

interface LoginCredentials {
  username: string;
  password: string;
}

type LoginResponse = User;

// Async thunk for login
export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, expiresInMins: 30 }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

// Async thunk for fetching user data
export const fetchUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>('auth/fetchUser', async (token: string, { rejectWithValue }) => {
  try {
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to fetch user');
    }

    const userData: User = await response.json();
    return { ...userData, token };
  } catch (error) {
    return rejectWithValue('Network error');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSuperAdmin = false;
      mmkvDelete('auth_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.isSuperAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload;
        state.isAuthenticated = true;
        // Check if user is super admin
        state.isSuperAdmin = SUPER_ADMIN_USERNAMES.includes(action.payload.username);
        // persist token
        if (action.payload.token) {
          mmkvSetString('auth_token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Check if user is super admin
        state.isSuperAdmin = SUPER_ADMIN_USERNAMES.includes(action.payload.username);
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.isSuperAdmin = false;
      });
  },
});

export const { logout, clearError, setSuperAdmin } = authSlice.actions;

export default authSlice.reducer;