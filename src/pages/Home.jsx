import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import axios from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { fetchPosts, fetchTags } from '../redux/posts'


/*
КАК DISPATCH ЗАСТАВЛЯЕТ ПЕРЕРИСОВАТЬСЯ КОМПОНЕНТ ?


1) ПРИ ПЕРВОМ РЕНДЕРЕ ПРОЕКТА ЗАПУСКАЮТСЯ ВСЕ ФАЙЛЫ И ВЫЗЫВАЮТСЯ ВСЕ ФУНКЦИИ КОТОРЫЕ МЫ НАПИСАЛИ ВЫЗВАТЬ, ВКЛЮЧАЯ НАШ useSelector +
2) ПРИ ВЫЗОВЕ useSelector В НЕЙ СОЗДАЕТСЯ STATE И SETSTATE ПЕРЕДАЕТСЯ В ФУНКЦИЮ subscribe(СЮДА !) +
3) И subscribe ДОБАВЛЯЕТ ЭТОТ SETSTATE В МАССИВ У СЕБЯ В ЛОГИКЕ +
4) И ПРИ ВЫЗОВЕ DISPATCH, DISPATCH ВЫЗЫВАЕТ ЭТУ ФУНКЦИЮ ИЗ МАССИВА ТО ЕСТЬ НАШ SETSTATE +
5) И КОГДА ВЫЗЫВАЕТСЯ SETSTATE ОБНОВЛЯЕТСЯ useSelector, ПОТОМУ ЧТО STATE СОЗДАНА В НЕЙ +
6) И useSelector ВОЗВРАЩАЕТСЯ С НОВОЙ ССЫЛКОЙ В ТЕ КОМПОНЕНТЫ ГДЕ ОНА БЫЛА ИЗНАЧАЛЬНО ВЫЗВАНА +
7) И ПОТОМ РЕАКТ ВИДИТ ЧТО В КОМПОНЕНТЕ ПОМЕНЯЛАСЬ ОДНА ССЫЛКА ТО ЕСТЬ ПОЯВИЛАСЬ НОВАЯ ССЫЛКА 
ТО ОНА ПЕРЕРИСУЕТ ЭТОТ КОМПОНЕНТ 

РЕЗЮМИРУЯ: КОГДА DISPATCH ВЫЗЫВАЕТСЯ ТО useSelector ОБНОВЛЯЕТ СВОЙ КОМПОНЕНТ
*/ 
export const Home = () => {
  const dispatch = useDispatch()

  const { posts, tags } = useSelector(state => state.posts)
  const {data} = useSelector(state => state.auth)
  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = posts.status === 'loading'


  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])


  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label='basic tabs example'
      >
        <Tab label='Новые' />
        <Tab label='Популярные' />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          
            isPostsLoading ? (
              <Post key={index} isLoading={true}/>
            ) : (
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl}
                // imageUrl='https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png'
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={ data.email === 'iftah_abwab@mail.ru' || obj.user?._id === data?._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg'
                },
                text: 'Это тестовый комментарий'
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top'
              }
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  )
}
