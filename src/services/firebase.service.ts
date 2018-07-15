import * as firebase from 'firebase-admin';

export class FirebaseService {
    public getClient() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp({
                credential: firebase.credential.cert({
                    projectId: process.env.FIREBASE_PROJECTID,
                    privateKey: process.env.FIREBASE_PRIVATEKEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENTEMAIL,
                }),
            });
        }

        return firebase.firestore();
    }
}
