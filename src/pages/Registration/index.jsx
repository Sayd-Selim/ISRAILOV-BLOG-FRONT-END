import React, { useRef, useState } from 'react'
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
import axios from '../../axios'

export const Registration = () => {
  const [flag, setFlag] = useState(false)
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [state, setState] = useState({
    success: false,
    message: ''
  })

  const [image, setImage] = useState()
  const [imageForFrontendPlace, setImageForFrontendPlace] = useState('')
  
  const inputFileRef = useRef(null)

  const onChangeImage = async (e) => {
    setImage(e.target.files[0])
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    const {data} = await axios.post('/upload', formData)
    setImageForFrontendPlace(data.url)
    setFlag(true)
  }

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('email', data.email);
    formData.append('fullName', data.fullName);
    formData.append('password', data.password);


    try {
        const reternedAction = await dispatch(fetchRegister(formData));
        if (reternedAction.payload?.token) {
            window.localStorage.setItem('token', reternedAction.payload.token);
            navigate('/');
        } else {
            setState({
                success: true,
                message: 'Некорректные данные!'
            });
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
    }
}

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar onClick={() => inputFileRef.current.click()} sx={{ width: 100, height: 100 }} src={`${process.env.REACT_APP_API_URL}${imageForFrontendPlace}`} />
        <input ref={inputFileRef} type="file" onChange={(e) => onChangeImage(e)}  hidden={flag && true}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='Полное имя'
          fullWidth
          error={state.success}
          helperText={state.message}
          {...register('fullName', { required: 'Это поле обязательно !' })}
        />
        <TextField
          className={styles.field}
          label='E-Mail'
          fullWidth
          error={state.success}
          helperText={state.message}
          type='email'
          {...register('email', { required: 'Это поле обязательно !' })}
        />
        <TextField
          className={styles.field}
          label='Пароль'
          fullWidth
          error={state.success}
          helperText={state.message}
          {...register('password', { required: 'Это поле обязательно !' })}
        />
        <Button size='large' variant='contained' fullWidth type='submit'>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  )
}
