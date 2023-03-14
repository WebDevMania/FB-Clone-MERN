import React from 'react'
import classes from './profile.module.css'
import coverPicture from '../../assets/italy.jpg'
import profilePicture from '../../assets/person1.jpg'
import Share from '../share/Share'
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { request } from '../../util/request'
import Post from '../post/Post'

const Profile = () => {
    const { id } = useParams()
    const { user, token } = useSelector((state) => state.auth)
    const [userPosts, setUserPosts] = useState([])
    const [isFollowed, setIsFollowed] = useState(user.followings.includes(id))
    const [profileDetails, setProfileDetails] = useState("")
    const BACKEND_URL = `http://localhost:5000/images/`

    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const posts = await request(`/post/find/userposts/${id}`, 'GET')
                console.log(posts)
                setUserPosts(posts)
            } catch (error) {
                console.error(error)
            }
        }
        fetchPosts()
    }, [id])

    useEffect(() => {
        const fetchUserData = async() => {
            const user = await request(`/user/find/${id}`, 'GET')
            setProfileDetails(user)
        }
        fetchUserData()
    }, [id])

    
    const handleFollow = async() => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }

            if(isFollowed){
                await request(`/user/unfollow/${id}`, "PUT", headers)
            } else {
                await request(`/user/follow/${id}`, "PUT", headers)
            }

            setIsFollowed(prev => !prev)
        } catch (error) {
            console.error(error)
        }
    }

    console.log(profileDetails)
  return (
    <div className={classes.container}>
        <div className={classes.wrapper}>
            <div className={classes.top}>
                <img src={
                    profileDetails?.coverPic 
                    ? BACKEND_URL + profileDetails?.coverPic
                    : coverPicture
                    } className={classes.coverPicture} />
                <img src={
                    profileDetails?.profilePic
                    ? BACKEND_URL + profileDetails?.profilePic
                    : profilePicture
                    } className={classes.profilePicture} />
                <div className={classes.profileData}>
                   <h2 className={classes.username}>{profileDetails?.username}</h2>
                   {id !== user._id && (
                    <button className={classes.followBtn} onClick={handleFollow}>{isFollowed ? "Followed" : "Follow"}</button>
                   )}
                </div> 
                {id === user._id && <Share />}
                <div className={classes.posts}>
                    {userPosts?.map((post) => (
                        <Post key={post._id} post={post}/>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile