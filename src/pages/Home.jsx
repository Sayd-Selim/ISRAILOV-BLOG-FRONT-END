import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/posts';

export const Home = () => {
  const dispatch = useDispatch();
  
  const { posts, tags } = useSelector((state) => state.posts);
  const { data } = useSelector((state) => state.auth);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = posts.status === 'loading';

  // Используем тему Material-UI
  const theme = useTheme();
  // Определяем, если экран маленький (например, мобильный)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    try {
      dispatch(fetchPosts());
      dispatch(fetchTags());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

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
      <Grid container spacing={4} direction={isMobile ? 'column' : 'row'}>
        <Grid xs={12} md={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                _id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={
                  data?.email === 'iftah_abwab@mail.ru' ||
                  obj.user?._id === data?._id
                }
              />
            )
          )}
        </Grid>
        <Grid xs={12} md={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={posts.items.map(elem => elem.comments[0]).filter(elem => elem !== undefined)}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
}
