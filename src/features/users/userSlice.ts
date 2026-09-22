import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsers } from '../../api/users';
import { User } from '../../types/User';

export const getUsersThunk = createAsyncThunk('users/getUsers', async () => {
  const response = await getUsers();

  return response;
});

const initialState = {
  users: [] as User[],
  loading: false,
  error: '',
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsersThunk.pending, state => ({
      ...state,
      loading: true,
      error: '',
    }));
    builder.addCase(
      getUsersThunk.fulfilled,
      (state, action: PayloadAction<User[]>) => ({
        ...state,
        loading: false,
        users: action.payload,
      }),
    );
    builder.addCase(getUsersThunk.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.error.message || 'Failed to fetch users',
    }));
  },
});
export default userSlice.reducer;
