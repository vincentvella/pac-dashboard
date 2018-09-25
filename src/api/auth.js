import { authRef, setUpFirebase } from './firebase';

export function auth(email, pw) {
  if (!authRef) {
    setUpFirebase();
  }
  return authRef().signInWithEmailAndPassword(email, pw);
}
