import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as commentsApi from '../../api/comments';
import { Comment, CommentData } from '../../types/Comment';

const initialState = {
  items: [] as Comment[],
  loading: false,
  error: '',
};

export const getCommentsThunk = createAsyncThunk(
  'comments/getComments',
  async (postId: number) => {
    const response = await commentsApi.getPostComments(postId);

    return response;
  },
);

export const addCommentThunk = createAsyncThunk(
  'comments/addComment',
  async (data: CommentData & { postId: number }) => {
    const response = await commentsApi.createComment(data);

    return response;
  },
);

export const deleteCommentThunk = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: number) => {
    await commentsApi.deleteComment(commentId);

    return commentId;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCommentsThunk.pending, state => ({
      ...state,
      loading: true,
      error: '',
    }));
    builder.addCase(
      getCommentsThunk.fulfilled,
      (state, action: PayloadAction<Comment[]>) => ({
        ...state,
        loading: false,
        items: action.payload,
      }),
    );
    builder.addCase(getCommentsThunk.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.error.message || 'Failed to fetch comments',
    }));

    builder.addCase(
      addCommentThunk.fulfilled,
      (state, action: PayloadAction<Comment>) => ({
        ...state,
        items: [...state.items, action.payload],
      }),
    );
    builder.addCase(addCommentThunk.rejected, state => ({
      ...state,
      error: 'Failed to add a comment',
    }));

    builder.addCase(
      deleteCommentThunk.fulfilled,
      (state, action: PayloadAction<number>) => ({
        ...state,
        items: state.items.filter(comment => comment.id !== action.payload),
      }),
    );
  },
});

export default commentsSlice.reducer;
