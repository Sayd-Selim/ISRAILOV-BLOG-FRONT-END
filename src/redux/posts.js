import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import axios from '../axios';

/*
1) ПРИ ВЫЗОВЕ createAsyncThunk,она - ВОЗВРАЩАЕТ ФУНКЦИЮ +
2) ПЕРЕДАЕМ ЕЕ В DISPATCH(ВОТ СЮДА !) И КОГДА МЫ ЕЕ ВЫЗЫВАЕМ В DISPATCH(ЗДЕСЬ) ТО ОНА ВОЗВРАЩАЕТ ЕЩЕ ОДНУ ФУНКЦИЮ +
3) И В ЛОГИКЕ DISPATCH ВЫЗЫВАЕТСЯ ЭТА ВОЗВРАЩЕННАЯ ФУНКЦИЯ +
4) И ЭТА ФУНКЦИЯ ВЫЗЫВАЕТ ФУНКЦИЮ ИЗ ВТОРОГО АРГУМЕНТА createAsyncThunk  И ЕЩЁ ВЫЗЫВАЕТ DISPATCH + 
5) И DISPATCH ВЫЗЫВАЕТ ИЗ extraReducers СНАЧАЛА PENDING ПОТОМ FULFILLED ПЕРЕДАВАЮ В ACTION PAYLOAD = DATA +

РЮЗЮМИРУЯ: createAsyncThunk ВОЗВРАЩАЕТ ФУНКЦИЮ ЧТОБЫ ВЫЗВАТЬ СВОЙ ВТОРОЙ ПАРАМЕТР 
И ПЕРЕДАТЬ ЕЕ РЕЗУЛЬТАТ В ACTION.PAYLOAD ИЗ FULFILLED ФУНКЦИИ
*/
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const {
        data
    } = await axios.get('/posts')
    return data
})

export const fetchSendPosts = createAsyncThunk('posts/fetchSendPosts', async (paramsFromPost) => {
    const {
        data
    } = await axios.post('/posts', paramsFromPost)
    return data
})


export const fetchFromAdmin = createAsyncThunk('posts/fetchFromAdmin', async (dataFromAdmin) => {

    const {data} = await axios.patch(`/posts/${dataFromAdmin.element._id}/edit`, dataFromAdmin)
    return data

})


export const fetchDeleteOnePost = createAsyncThunk('posts/fetchDeleteOnePost', async (idFromPost) => {
    const {
        data
    } = await axios.delete(`/posts/${idFromPost}`)
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const {
        data
    } = await axios.get('/tags')
    return data
})


const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

/*
ФУНКЦИЯ ИЗ extraReducers ВОЗВРАЩАЕТ ОБЪЕКТ ГДЕ КЛЮЧ - ЭТО ПЕРВОЕ ЗНАЧЕНИЕ ИЗ ФУНКЦИИ addCase(),
 А ЗНАЧЕНИЕ НАШЕГО КЛЮЧА ОБЪЕКТА ЯВ-СЯ - ВТОРЫМ ЗНАЧЕНИЕМ ИЗ ФУНКЦИИ addCase() ,ТО ЕСТЬ, ФУНКЦИЯ.

НАПРИМЕР {posts/fetchPosts/FULFILLED: (STATE, ACTION) => {...ДАЛЬШЕ ЛОГИКА}}

РЮЗЮМИРУЯ: DISPATCH ВЫЗЫВАЕТ ОБЪЕКТ ВОЗВРАЩЕННЫЙ ИЗ  extraReducers
*/


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Получение постов
        builder.addCase(fetchPosts.pending, (state, action) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        });

        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        });

        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.posts.items = [];
            state.posts.status = 'error';
        });




        // Удаление поста
        builder.addCase(fetchDeleteOnePost.pending, (state, action) => {
            state.posts.status = 'loading';
        });

        builder.addCase(fetchDeleteOnePost.fulfilled, (state, action) => {
            state.posts.items = state.posts.items.filter(elem => elem._id !== action.payload.user._id);
            state.posts.status = 'loaded';
        });

        builder.addCase(fetchDeleteOnePost.rejected, (state, action) => {
            state.posts.status = 'error';
        });







        // Получение тэгов
        builder.addCase(fetchTags.pending, (state, action) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        });

        builder.addCase(fetchTags.fulfilled, (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        });

        builder.addCase(fetchTags.rejected, (state, action) => {
            state.tags.items = [];
            state.tags.status = 'error';
        });






        // Созадние поста
        builder.addCase(fetchSendPosts.pending, (state, action) => {
            state.posts.status = 'loading';
        });

        builder.addCase(fetchSendPosts.fulfilled, (state, action) => {
            state.posts.items = [...state.posts.items, action.payload]
            state.posts.status = 'loaded';
        });

        builder.addCase(fetchSendPosts.rejected, (state, action) => {
            state.posts.items = [];
            state.posts.status = 'error';
        });

    }

})

export const postsReducer = postsSlice.reducer
