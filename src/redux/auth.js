import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit"
import axios from "../axios"


export const fetchOnLogin = createAsyncThunk('auth/fetchOnLogin', async (params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post('/auth/login', params)

        return data
    } catch (error) {
       return rejectWithValue('Неверный логин или пароль !')
    }
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const {data} = await axios.get('/auth/me')

    return data
})


export const fetchRegister = createAsyncThunk('/auth/fetchRegister', async (params, {rejectWithValue}) => {
   try {
    const {data} = await axios.post('/auth/register', params)
    return data
   } catch (error) {
    return rejectWithValue(error)    
   }

})


const initialState = {
    data: null,
    status: 'loading'
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.data = null
        }
    },
    extraReducers: (builder) => {
        // Логин
        builder.addCase(fetchOnLogin.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })

        builder.addCase(fetchOnLogin.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        })

        builder.addCase(fetchOnLogin.rejected, (state, action) => {
            state.status = 'error'
            state.data = null
        })



        // Автоматический вход при обновление/первом рендере приложения
        builder.addCase(fetchAuthMe.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })

        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        })

        builder.addCase(fetchAuthMe.rejected, (state, action) => {
            state.status = 'error'
            state.data = null
        })



        // Регистрация
        builder.addCase(fetchRegister.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })

        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        })

        builder.addCase(fetchRegister.rejected, (state, action) => {
            state.status = 'error'
            state.data = null
        })


    }
})

export const authReducer = authSlice.reducer