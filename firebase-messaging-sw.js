// ==================== FIREBASE MESSAGING SERVICE WORKER ====================
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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

const APP_LOGO = 'https://raw.githubusercontent.com/saputraamanah999-dotcom/extrarobotik/main/assets/images/saputra.png';

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📱 [SW] Background message:', payload);
    
    const notificationTitle = payload.notification?.title || 
                              payload.data?.title || 
                              'Ekskul Robotik';
    
    const notificationBody = payload.notification?.body || 
                             payload.data?.body || 
                             payload.data?.message || 
                             'Ada notifikasi baru';
    
    // OPTIMASI UNTUK LOCK SCREEN
    const notificationOptions = {
        body: notificationBody,
        icon: APP_LOGO,
        badge: APP_LOGO,
        vibrate: [500, 250, 500, 250, 500], // Getar lebih lama
        tag: 'robotik-' + Date.now(),
        renotify: true,
        requireInteraction: true, // Notifikasi tetap di layar sampai diklik
        silent: false,
        priority: 'high',
        
        // Android specific
        android: {
            priority: 'high',
            visibility: 'public', // PENTING: muncul di lock screen
            channelId: 'robotik_channel',
            notificationPriority: 'PRIORITY_MAX',
            sound: 'default',
            vibrate: true,
            color: '#00d4ff',
            icon: APP_LOGO
        },
        
        // Actions
        actions: [
            {
                action: 'open',
                title: '🔍 Buka Aplikasi'
            },
            {
                action: 'close',
                title: '❌ Tutup'
            }
        ],
        
        data: {
            ...payload.data,
            priority: 'high',
            timestamp: Date.now()
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('📱 [SW] Notification clicked:', event);
    
    const notification = event.notification;
    notification.close();
    
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

self.addEventListener('install', (event) => {
    console.log('📱 [SW] Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('📱 [SW] Activated');
    return self.clients.claim();
});
