import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import styles from './Login.module.scss'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchRegister } from '../../redux/auth'
import { useNavigate } from 'react-router-dom'

export const Registration = () => {
  /*
  1) НАПИСАЛИ ЛОГИКУ ЧЕРЕЗ useForm() +
  2) НАПИСАЛИ ЛОГИКУ НА ЗАПРОС СЕРВЕРУ ЧЕРЕЗ createAsyncThunk +
  3) СОХРАНИЛИ ТОКЕН В LOCALSTORAGE +
  4) НЕМНОГО ДОПОЛНИЛИ ВАЛИДАЦИЮ ФОРМЫ +
  5) ПОСЛЕ ВСЕГО ЭТОГО ПЕРЕШЛИ НА ГЛАВНУЮ СТРАНИЦУ
  */
  const { register, formState, handleSubmit } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [state, setState] = useState({
    success: false,
    message: ''
  })
  const onSubmit = async data => {
    const reternedAction = await dispatch(fetchRegister(data))


    if (reternedAction.payload?.token) {
      window.localStorage.setItem('token', reternedAction.payload.token)
      navigate('/')
    } 
    else {
      setState({
        success: true,
        message: 'Некоректные данные !'
      })
    }
  }

  // console.log('formState', formState.errors)
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='Полное имя'
          fullWidth
          error={state.success}
          helperText={state.message}
          {...register('fullName', { required: 'Это поле обязательно !' })}
          autoComplete='off'
        />
        <TextField
          className={styles.field}
          label='E-Mail'
          fullWidth
          error={state.success}
          helperText={state.message}
          type='email'
          {...register('email', { required: 'Это поле обязательно !' })}
          autoComplete='off'
        />
        <TextField
          className={styles.field}
          label='Пароль'
          fullWidth
          error={state.success}
          helperText={state.message}
          // type='password'
          {...register('password', { required: 'Это поле обязательно !' })}
          autoComplete='off'
        />
        <Button size='large' variant='contained' fullWidth type='submit'>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  )
}
