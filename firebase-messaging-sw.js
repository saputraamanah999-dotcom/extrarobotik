// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAkLcYEkg4Yp16pbUCIlH7012Ut4Xi02ks",
    authDomain: "absensii-e6e72.firebaseapp.com",
    projectId: "absensii-e6e72",
    storageBucket: "absensii-e6e72.firebasestorage.app",
    messagingSenderId: "556643295146",
    appId: "1:556643295146:web:7102ef592a2b04b29615d3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Notifikasi Baru';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.message || '',
        icon: 'https://ui-avatars.com/api/?name=Ekskul&background=00d4ff&color=fff',
        badge: 'https://ui-avatars.com/api/?name=SMK&background=00d4ff&color=fff&size=72',
        data: payload.data,
        actions: [
            {
                action: 'open',
                title: 'Buka'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    const client = clientList[0];
                    client.focus();
                    client.postMessage({
                        type: 'NOTIFICATION_CLICK',
                        data: event.notification.data
                    });
                } else {
                    clients.openWindow('/');
                }
            })
        );
    }
});
