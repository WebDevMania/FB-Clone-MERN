import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../components/navbar/Navbar'
import classes from './updateProfile.module.css'
import { AiOutlineFileImage } from 'react-icons/ai'
import { request } from '../../util/request'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = () => {
    const { user, token } = useSelector((state) => state.auth)
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [profilePic, setProfilePic] = useState('')
    const [coverPic, setCoverPic] = useState('')
    const navigate = useNavigate()

    const handleUpdate = async (e) => {
        e.preventDefault()

        const body = {
            username,
            email
        }

        try {
            let profilePicName = null
            let coverPicName = null

            if (profilePic) {
                profilePicName = crypto.randomUUID() + profilePic.name
                const formData = new FormData()
                formData.append("imageUrl", profilePicName)
                formData.append("photo", profilePic)
                await request(`/upload`, 'POST', {}, formData, true)
                body.profilePic = profilePicName
            }

            if (coverPic) {
                coverPicName = crypto.randomUUID() + coverPicName.name
                const formData = new FormData()
                formData.append("imageUrl", coverPicName)
                formData.append("photo", coverPic)
                await request(`/upload`, 'POST', {}, formData, true)
                body.coverPic = coverPicName
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

            await request(`/user/update/${user._id}`, 'PUT', headers, body)

            navigate(`/profile/${user._id}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={handleUpdate}>
                        <h2>
                            Update Profile
                        </h2>
                        <div className={classes.inputBox}>
                            <label htmlFor='username'>Username</label>
                            <input type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className={classes.inputBox}>
                            <label htmlFor='email'>Email</label>
                            <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={classes.inputBox}>
                            <label htmlFor='pfp'>Profile picture <AiOutlineFileImage /></label>
                            <input style={{ display: 'none' }} type="file" id='pfp' onChange={(e) => setProfilePic(e.target.files[0])} />
                        </div>
                        <div className={classes.inputBox}>
                            <label htmlFor='coverPic'>Cover picture <AiOutlineFileImage /></label>
                            <input style={{ display: 'none' }} type="file" id='coverPic' onChange={(e) => setCoverPic(e.target.files[0])} />
                        </div>
                        <button className={classes.submitBtn} type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile