import {child, get, update, push, remove, ref} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

export async function room_updateRoom({roomID, roomName, roomDescription, themeImageUrl, last_message, last_message_timestamp, dj, isPublic, users, isOthersAddSongs}){
  if (roomID === null && roomName === null && last_message === null && themeImageUrl == null && last_message_timestamp === null && isOthersAddSongs === null && roomDescription === null && dj === null && isPublic === null) {
    throw new Error("One or more required parameters are missing or empty in room_updateRoom.");
  }
  const updates = {};

  if(roomID){
    if(roomName){
      updates[`/rooms/${roomID}/room_name`] = roomName
    }
    if(roomDescription){
      updates[`/rooms/${roomID}/room_description`] = roomDescription
    }
    if(themeImageUrl){
      updates[`/rooms/${roomID}/themeImageUrl`] = themeImageUrl
    }
    if(last_message){
      updates[`/rooms/${roomID}/last_message`] = last_message
    }
    if(last_message_timestamp){
      updates[`/rooms/${roomID}/last_message_timestamp`] = last_message
    }
    if(dj){
      updates[`/rooms/${roomID}/dj`] = dj
    }
    if(isPublic){
      updates[`/rooms/${roomID}/isPublic`] = isPublic
    }
    if(users){
      updates[`/rooms/${roomID}/users`] = users
    }
    if(isOthersAddSongs){
      updates[`/rooms/${roomID}/isOthersAddSongs`] = isOthersAddSongs
    }
  }
  else {
    const newRoomId = push(child(dbRef, `/rooms`)).key;

    if(roomName){
      updates[`/rooms/${newRoomId}/room_name`] = roomName
    }
    if(roomDescription){
      updates[`/rooms/${newRoomId}/room_description`] = roomDescription
    }
    if(themeImageUrl){
      updates[`/rooms/${newRoomId}/themeImageUrl`] = themeImageUrl
    }
    if(last_message){
      updates[`/rooms/${newRoomId}/last_message`] = last_message
    }
    if(last_message_timestamp){
      updates[`/rooms/${newRoomId}/last_message_timestamp`] = last_message
    }
    if(dj){
      updates[`/rooms/${newRoomId}/djList`] = dj
    }
    if(isPublic){
      updates[`/rooms/${newRoomId}/isPublic`] = isPublic
    }
    if(isOthersAddSongs){
      updates[`/rooms/${roomID}/isOthersAddSongs`] = isOthersAddSongs
    }
    if(users){
      updates[`/rooms/${roomID}/users`] = users
    }
  }

  try {
    await update(dbRef, updates)
    // await console.log("rooms updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function room_getRoom({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_getRoom.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function room_fetchDJList({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_fetchDJList.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}/dj`));
    const djItems = snapshot.val();

    if (djItems) {
      const names = Object.values(djItems).map(item => item.username);
      return names;
    } else {
      console.log('No data found under "dj"');
      return [];
    }
  } catch (e) {
    console.log(e)
    throw e
  }
};

export async function room_fetchDJUrlList({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_fetchDJList.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}/dj`));
    const djItems = snapshot.val();

    if (djItems) {
      const names = Object.values(djItems).map(item => item.profileUrl);
      return names;
    } else {
      console.log('No data found under "dj"');
      return [];
    }
  } catch (e) {
    console.log(e)
    throw e
  }
};

export async function room_fetchUserList({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_fetchDJList.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}/users`));
    const djItems = snapshot.val();

    if (djItems) {
      const names = Object.values(djItems).map(item => item.username);
      return names;
    } else {
      console.log('No data found under "dj"');
      return [];
    }
  } catch (e) {
    console.log(e)
    throw e
  }
};

export async function room_fetchUserUrlList({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_fetchDJList.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}/users`));
    const djItems = snapshot.val();

    if (djItems) {
      const names = Object.values(djItems).map(item => item.profileUrl);
      return names;
    } else {
      console.log('No data found under "dj"');
      return [];
    }
  } catch (e) {
    console.log(e)
    throw e
  }
};

export async function room_removeRoom({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_removeRoom.");
  }
  const updates = {};
  updates[`/rooms/${roomID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("room deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function room_addUser({roomID, userID, username}){
  if (roomID === null || userID === null || username === null) {
    throw new Error("One or more required parameters are missing or empty in room_addUser.");
  }
  const updates = {};
  updates[`/rooms/${roomID}/users/${userID}`] = {
    username: username
  }

  try {
    await update(dbRef, updates)
  }catch (e) {
    console.log("error in room_addUser")
    throw e
  }
}

export async function room_removeUser({roomID, userID}){
  if (roomID === null || userID === null) {
    throw new Error("One or more required parameters are missing or empty in room_addUser.");
  }
  try {
    remove(ref(db, `/rooms/${roomID}/users/${userID}`))
      .then(() => {
        console.log("user deleted from room successfully")
      })
      .catch(error => {
        console.log("Error in deleting user")
        throw error
      });
  }catch (e) {
    console.log("error in room_addUser")
    throw e
  }
}