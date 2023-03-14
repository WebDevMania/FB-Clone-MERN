import React, { useState } from 'react'
import classes from './post.module.css'
import italy from '../../assets/italy.jpg'
import person from '../../assets/person1.jpg'
import { AiFillLike, AiOutlineComment, AiOutlineHeart, AiOutlineLike } from 'react-icons/ai'
import { IoMdSettings, IoMdShareAlt } from 'react-icons/io'
import { format } from 'timeago.js'
import { useEffect } from 'react'
import { request } from '../../util/request'
import { useSelector } from 'react-redux'
import Comment from '../comment/Comment'
import { Link } from 'react-router-dom'

const Post = ({ post }) => {
  const { user, token } = useSelector((state) => state.auth)
  const [authorDetails, setAuthorDetails] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user._id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await request('/user/find/' + post.userId, 'GET')
        setAuthorDetails(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchDetails()
  }, [post._id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await request(`/comment/${post._id}`, 'GET')
        console.log(data)
        setComments(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [post._id])

  const handleLike = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    try {
      await request(`/post/likePost/${post._id}`, "PUT", headers)
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDislike = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    try {
      await request(`/post/dislikePost/${post?._id}`, "PUT", headers)
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const data = await request('/comment', 'POST', headers, { text: commentText, postId: post._id })
      console.log(data)
      setComments(prev => {
        if (prev.length === 0) return [data]
        return [data, ...prev]
      })

      setCommentText("")
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePost = async() => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      await request('/post/deletePost/' + post._id, 'DELETE', headers)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className={classes.post}>
      <div className={classes.top}>
        <Link to={`/profile/${user._id}`} className={classes.topLeft}>
          <img src={person} alt="" className={classes.postAuthorImg} />
          <div className={classes.postDetails}>
            <span>{authorDetails?.username}</span>
            <span className={classes.date}>{format(post?.createdAt)}</span>
          </div>
        </Link>
        {user._id === post?.userId && <IoMdSettings onClick={() => setShowDeleteModal(prev => !prev)}/>}
        {showDeleteModal && (
          <span className={classes.deleteModal} onClick={handleDeletePost}>
             Delete post
          </span>
        )}
      </div>
      <p className={classes.desc}>
        {post?.desc}
      </p>
      <div className={classes.postImgContainer}>
        <img src={post.imageUrl ? `http://localhost:5000/images/${post.imageUrl}` : italy} alt="" className={classes.postImg} />
      </div>
      <div className={classes.actions}>
        {
          !isLiked &&
          <span className={classes.action} onClick={handleLike}>
            Like <AiOutlineLike />
          </span>
        }
        {isLiked &&
          <span className={classes.action} onClick={handleDislike}>
            Liked <AiFillLike />
          </span>
        }
        <span className={classes.action} onClick={() => setShowComments(prev => !prev)}>
          Comment <AiOutlineComment />
        </span>
        <span className={classes.action}>
          Share <IoMdShareAlt />
        </span>
      </div>
      {showComments &&
        <>
          <div className={classes.comments}>
            {comments?.length > 0 ? comments?.map((comment) => (
              <Comment comment={comment} key={comment._id} />
            )) : <h3 style={{padding: '1.25rem'}}>No comments yet.</h3>}
          </div>
          <form className={classes.commentSection} onSubmit={handleComment}>
            <textarea value={commentText} type="text" placeholder='Type comment...' onChange={(e) => setCommentText(e.target.value)} />
            <button type="submit">Post</button>
          </form>
        </>
      }
    </div>
  )
}

export default Post