// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAoeSN1lDb-1sfhRvvLZey3s4w49QEVC8k",
  authDomain: "todocheck-e5295.firebaseapp.com",
  projectId: "todocheck-e5295",
  storageBucket: "todocheck-e5295.firebasestorage.app",
  messagingSenderId: "774333929403",
  appId: "1:774333929403:web:511ef39c0299ca6f16d69e"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body: body || '',
    icon: icon || '/todocheck/icons/Icon-192.png',
    badge: '/todocheck/icons/Icon-192.png',
    vibrate: [200, 100, 200],
    tag: payload.data?.taskId || 'todocheck',
    data: payload.data,
    actions: [
      { action: 'open', title: '✅ Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('todocheck') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/todocheck/');
    })
  );
});