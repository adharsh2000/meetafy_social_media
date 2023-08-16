const ProfileValid = ({fullname, mobile, address, bio, gender}) => {
    const err = {}

    if(!fullname) {
        err.fullname = "Please add your full name."
    }else if(fullname.length > 25){
        err.fullname = "Full name is up to 25 characters long."
    }

    if(!mobile) {
        err.mobile = "Please add your Mobile."
    }

    if(!address) {
        err.address = "Please add your Address"
    }

    if(!bio) {
        err.bio = "Please add your Bio."
    }else if(bio.length > 200){
        err.bio = "Bio must be at least 200 characters."
    }

    if(!gender){
        err.gender = "Please select a gender"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}


export default ProfileValid