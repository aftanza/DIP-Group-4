import {child, get, update} from "firebase/database";
import {dbRef} from "../../../firebaseConfig";

export async function queue_updateQueue({roomID, queueList = null}){
  const updates = {};
  updates[`/queue/${roomID}`] = queueList

  try {
    await update(dbRef, updates)
    await console.log("queue updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function queue_getQueue({roomID}){
  try {
    const snapshot = await get(child(dbRef, `/queue/${roomID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function queue_removeQueue({roomID}){
  const updates = {};
  updates[`/queue/${roomID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("queue deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}