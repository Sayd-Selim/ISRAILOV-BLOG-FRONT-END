import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOnLogin } from '../../redux/auth'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { data, status } = useSelector(state => state.auth)
  const [state, setState] = useState({
    success: false,
    message: null
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  })


  
  // Dispatch при вызове возвращает объект в переменную и в ключ payload сохраняет то что вернул сервер при запросе axios,
  // то есть, функция из второго параметра createAsyncThunk,
  // если передать в неё функцию которая вернула createAsyncThunk , то есть, в Dispatch(сюда !)

  const onSubmit = async data => {
    /*
    Сначала нужно проверить есть ли пользователь в базе данных
        Шаги: 
        1) Если удалось войти, то возвращаем ответ с токеном
        2) Сохраняем токен в localStorage
        3) Заходим в axios.js и вытаскиваем токен из localStorage и добавляем ее в headers.Authorization (она нам нужна на 4 шагу)
        4) Заходим в App.js, отправляем запрос на адресс ('/auth/me') через dispatch на сервер 
    */

    // Dispatch при асинхронном запросе возвращает ответ от сервера (как будето здесь вызвали axios)
    // в ту переменную где её вызвали

    // 1) ОТПРАВЛЯЕМ ЗАПРОС НА СЕРВЕР И ОТВЕТ ОТ СЕРВЕРА СОХРАНЯЕМ В STATE.DATA
    // 2) И ПОТОМ В HEADER ПИШЕМ УСЛОВИЮ С DATA ИЗ STATE

    const reternedAction = await dispatch(fetchOnLogin(data)) // этот запрос делается чтобы войти в аккаунт можно сказать
    // console.log('reternedAction', reternedAction)

    if (reternedAction.payload?.token) {
      window.localStorage.setItem('token', reternedAction.payload.token)
    }else {
      setState({
        success: true,
        message: reternedAction.payload
      })
    }

    // на завтра если забуду: Header обноляется потому что переходим после логирование через navigate('/') на главную страницу
  }

  if (data) {
    navigate('/')
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='E-Mail'
          error={state.success || formState.errors.email}
          helperText={state.message || formState.errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          type='email'
          fullWidth
        />
        <TextField
          className={styles.field}
          label='Пароль'
          fullWidth
          error={state.success || formState.errors.password}
          helperText={state.message || formState.errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
        />
        <Button size='large' variant='contained' fullWidth type='submit'>
          Войти
        </Button>
      </form>
    </Paper>
  )
}
