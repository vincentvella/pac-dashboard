import { authRef, setUpFirebase, ref } from './firebase';

export const auth = (email, pw) => {
  if (!authRef) {
    setUpFirebase();
  }
  console.log('WE TRIED!');
  return authRef().signInWithEmailAndPassword(email, pw);
}

export const getUserInfo = async (uid) => {
  if (!ref) {
    setUpFirebase();
  }
  let userInfo = {};
  await ref.child(`/Web/Users/${uid}`).once('value').then((snapshot) => {
    console.log('UID', uid, 'SNAP', snapshot.val());
    userInfo = snapshot.val();
  });
  return userInfo;
};
