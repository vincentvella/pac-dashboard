import { authRef, setUpFirebase, ref } from './firebase';

export const auth = (email, pw) => {
  if (!authRef) {
    setUpFirebase();
  }
  return authRef.signInWithEmailAndPassword(email, pw);
}

export const getUserInfo = async (uid) => {
  if (!ref) {
    setUpFirebase();
  }
  let userInfo = {};
  await ref.child(`/Web/Users/${uid}`).once('value').then((snapshot) => {
    userInfo = snapshot.val();
  });
  return userInfo;
};
