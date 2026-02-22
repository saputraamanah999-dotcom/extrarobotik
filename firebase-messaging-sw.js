// ==================== FIREBASE MESSAGING SERVICE WORKER ====================
// Nama file: firebase-messaging-sw.js
// Letakkan di ROOT folder website Anda

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAzgv4PH8WDie21MhDWQyFzfuoIQnoG_z0",
    authDomain: "extrarobotik-96eff.firebaseapp.com",
    databaseURL: "https://extrarobotik-96eff-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "extrarobotik-96eff",
    storageBucket: "extrarobotik-96eff.firebasestorage.app",
    messagingSenderId: "26393167299",
    appId: "1:26393167299:web:3fe3d68fd3eaf3c9eb6976"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Logo untuk notifikasi
const APP_LOGO = 'https://raw.githubusercontent.com/saputraamanah999-dotcom/extrarobotik/main/assets/images/saputra.png';

// Handle notifikasi background (pas HP terkunci)
messaging.onBackgroundMessage((payload) => {
    console.log('📱 [SW] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || 
                              payload.data?.title || 
                              'Ekskul Robotik';
    
    const notificationBody = payload.notification?.body || 
                             payload.data?.body || 
                             payload.data?.message || 
                             'Ada notifikasi baru';
    
    const notificationOptions = {
        body: notificationBody,
        icon: APP_LOGO,
        badge: APP_LOGO,
        vibrate: [200, 100, 200],
        data: payload.data || {},
        requireInteraction: true,
        silent: false,
        actions: [
            {
                action: 'open',
                title: 'Buka'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle klik notifikasi
self.addEventListener('notificationclick', (event) => {
    console.log('📱 [SW] Notification clicked:', event);
    
    event.notification.close();
    
    // Buka aplikasi
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow('/');
        })
    );
});

// Service worker aktif
self.addEventListener('install', (event) => {
    console.log('📱 [SW] Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('📱 [SW] Activated');
    return self.clients.claim();
});
