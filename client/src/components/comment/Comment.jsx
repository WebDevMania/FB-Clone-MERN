import React from 'react'
import person from '../../assets/person1.jpg'
import { useEffect } from 'react'
import { useState } from 'react'
import { format } from 'timeago.js'
import { request } from '../../util/request'
import classes from './comment.module.css'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useSelector } from 'react-redux'

const Comment = ({ comment }) => {
    const { user, token } = useSelector((state) => state.auth)
    const [commentAuthor, setCommentAuthor] = useState("")
    const [isLiked, setIsLiked] = useState(comment.likes.includes(user._id))

    useEffect(() => {
        const fetchCommentAuthor = async () => {
            try {
                const data = await request(`/user/find/${comment.userId}`, 'GET')
                setCommentAuthor(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchCommentAuthor()
    }, [])

    const handleLikeComment = async () => {

        try {
            const headers = {'Authorization': `Bearer ${token}`}

            await request(`/comment/toggleLike/${comment._id}`, 'PUT', headers)
            
            setIsLiked(prev => !prev)
        } catch (error) {
          console.error(error)
        }
    }

    return (
        <div className={classes.comment}>
            <div className={classes.commentLeft}>
                <img src={person} className={classes.commentImg} />
                <div className={classes.commentDetails}>
                    <h4>{commentAuthor?.username}</h4>
                    <span>{format(comment.createdAt)}</span>
                </div>
                <div className={classes.commentText}>{comment.text}</div>
            </div>
            {isLiked ? <AiFillHeart onClick={handleLikeComment}/> : <AiOutlineHeart onClick={handleLikeComment}/>}
        </div>
    )
}

export default Comment