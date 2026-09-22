import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';
import { getUserPosts } from '../../api/posts';

const initialState = {
  posts: [] as Post[],
  loading: false,
  error: '',
};

export const getPostsThunk = createAsyncThunk(
  'posts/getPosts',
  async (userId: number) => {
    const response = await getUserPosts(userId);

    return response;
  },
);
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPostsThunk.pending, state => ({
      ...state,
      loading: true,
      error: '',
    }));
    builder.addCase(
      getPostsThunk.fulfilled,
      (state, action: PayloadAction<Post[]>) => ({
        ...state,
        loading: false,
        posts: action.payload,
      }),
    );
    builder.addCase(getPostsThunk.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.error.message || 'Failed to fetch posts',
    }));
  },
});

export default postsSlice.reducer;
