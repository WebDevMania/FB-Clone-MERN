import React from 'react'
import classes from './posts.module.css'
import Post from '../post/Post'
import { useState } from 'react'
import { useEffect } from 'react'
import { request } from '../../util/request'
import { useSelector } from 'react-redux'
import Share from '../share/Share'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchTimelinePosts = async () => {

      const headers = {
        'Authorization': `Bearer ${token}`
      }

      const data = await request(`/post/timelinePosts`, 'GET', headers)
      console.log(data)
      setPosts(data)
    }
    fetchTimelinePosts()
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Share />
        <div className={classes.posts}>
          {posts?.map((post) => (
            <Post post={post} key={post._id}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Posts