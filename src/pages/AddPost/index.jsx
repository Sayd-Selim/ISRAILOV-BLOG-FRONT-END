import React, { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import axios from '../../axios'
import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchFromAdmin,
  fetchSendPosts,
} from '../../redux/posts'
import { useNavigate, useParams } from 'react-router-dom'


export const AddPost = () => {
  const { posts } = useSelector(state => state.posts)
  const { data } = useSelector(state => state.auth)
  const { id } = useParams()
  const element = posts.items.find(elem => elem._id === id)
  const [image, setImage] = useState()
  const [flagForDownloadImage, setFlagForDownloadImage] = useState(false)
  const [value, setValue] = React.useState({
    text: '',
    title: '',
    tags: [],
    imageUrl: ''
  })

  useEffect(() => {
    if (element) {
      setImage(element.imageUrl)
      setValue({
        text: element.text,
        title: element.title,
        tags: element.tags,
        imageUrl: element.imageUrl
      })
    }
  }, [])

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputFileRef = useRef(null)

  const handleChangeFile = async event => {
    const formData = new FormData()
    formData.append('image', event.target.files[0])
    setFlagForDownloadImage(true)
    const { data } = await axios.post('/upload', formData)
    setImage(data.url)
    value.imageUrl = data.url
  }

  const onClickRemoveImage = () => {
    setImage('')
    setValue(prev => ({
      ...prev,
      imageUrl: ''
    }))
    setFlagForDownloadImage(false)
  }

  const onChangeText = React.useCallback(value => {
    setValue(prev => ({
      ...prev,
      text: value
    }))
  }, [])

  const onChangeInput = value => {
    setValue(prev => ({
      ...prev,
      title: value
    }))
  }

  const onChangeTags = tag => {
    setValue(prev => ({
      ...prev,
      tags: tag
    }))
  }

  const SendPostInServer = async (value, id) => {

    try {
      if (element && data.email === 'iftah_abwab@mail.ru') {
         await dispatch(
          fetchFromAdmin({ element, value })
        )
        alert('Вы успешно обновили пост')
        navigate('/')
      } else if (!element) {
        const reternedAction = await dispatch(fetchSendPosts(value))
        if (!reternedAction.error) {
          alert('Вы успешно создали пост')
          navigate('/')
        }
      } else if (data.email === 'iftah_abwab@mail.ru' && !element) {
        const reternedAction = await dispatch(fetchSendPosts(value))
        if (!reternedAction.error) {
          alert('Вы успешно создали пост')
          navigate('/')
        }
      } else {
        await axios.patch(`/posts/${id}/edit`, value)
        alert('Вы успешно обновили пост')
        navigate('/')
      }
    } catch (err) {
      alert('Произошла ошибка при обновление статьи')
    }
  }

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000
      }
    }),
    []
  )

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        variant='outlined'
        size='large'
        onClick={() => inputFileRef.current.click()}
      >
        {(!flagForDownloadImage && 'Загрузить фото') ||
          (flagForDownloadImage && !image && 'Изображение загружается !') ||
          (image && 'Изображение загрузился !')}
      </Button>
      <input
        ref={inputFileRef}
        type='file'
        onChange={handleChangeFile}
        hidden
      />
      {image && (
        <>
          <Button
            variant='contained'
            color='error'
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>

          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${image}`}
            alt='Uploaded'
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        fullWidth
        onChange={e => onChangeInput(e.target.value)}
        autoComplete='off'
        value={value.title}
        error={value.title.length < 10 && true || false}
        helperText={value.title.length < 10 && 'Необходимо больше 10-и символов для Заголовки' || ''}
      />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Тэги'
        fullWidth
        onChange={e => onChangeTags(e.target.value)}
        autoComplete='off'
        value={value.tags}
        error={value.tags.length === 0 && true || false}
        helperText={value.tags.length === 0 && 'Необходимо написать тег (например: Моя история, Знакомства и т.п)' || ''}
      />
      <SimpleMDE
        className={styles.editor}
        value={value.text}
        onChange={onChangeText}
        options={options}
      />
      <div className={styles.buttons}>
        <Button
          size='large'
          variant='contained'
          onClick={() => SendPostInServer(value, id)}
        >
          {(element && 'Сохранить') || 'Опубликовать'}
        </Button>
        <a href='/'>
          <Button size='large'>Отмена</Button>
        </a>
      </div>
    </Paper>
  )
}
