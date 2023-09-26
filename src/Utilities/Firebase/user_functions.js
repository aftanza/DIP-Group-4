import {child, get, ref, update, remove} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

async function userExist({userId}){
  const snapshot = await get(child(dbRef, `users/${userId}`))
  return snapshot.exists()
}

export async function user_updateUser({userID, username, roomsObjects}){
  const updates = {};

  if(userID){
    updates[`/users/${userID}`] = userID
  }
  if(username){
    updates[`/users/${userID}/${username}`] = username
  }
  if(roomsObjects){
    updates[`/users/${userID}/rooms}`] = roomsObjects
  }

  try {
    await update(dbRef, updates)
    // await console.log("rooms updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function user_getRooms({userId}) {
  try {
    const snapshot = await get(child(dbRef, `/users/${userId}/rooms/`));
    return await snapshot.val()
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function user_getUsername({userId}) {
  try {
    const snapshot = await get(child(dbRef, `/users/${userId}/username/`));
    return await snapshot.val()
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function user_addToRoom({userId, arrayOfRoomIDs}){
  const updates = {};

  await arrayOfRoomIDs.forEach(roomId => {
    updates[`/users/${userId}/rooms/${roomId}`] = true
  })

  try {
    if (!(await userExist(userId))) {
      console.log("user does not exists");
    }
    else{
      await update(dbRef, updates)
      // await console.log("user added to rooms successfully")
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function user_removeFromRooms({userId, arrayOfRoomIDs}){
  const updates = {};

  arrayOfRoomIDs.forEach(roomId => {
    updates[`/users/${userId}/rooms/${roomId}`] = null
  })

  try {
    if (!(await userExist(userId))) {
      console.log("user does not exists");
    }
    else{
      await update(dbRef, updates)
      // await console.log("user removed from rooms successfully")
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function user_removeUser({userId}){
  try {
    if (!(await userExist(userId))) {
      console.log("user does not exists");
    }
    else {
      remove(ref(db, `users/${userId}`))
        .then(() => {
          // console.log("user deleted successfully")
        })
        .catch(error => {
          console.log("Error in deleting user")
          throw error
        });
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}