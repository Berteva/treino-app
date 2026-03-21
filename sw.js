// Service Worker — Rest Timer Notifications
// Arquivo: sw.js (raiz do repositório GitHub)

self.addEventListener(‘install’, function(e) {
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(self.clients.claim());
});

// Receive message from main app with rest duration
self.addEventListener(‘message’, function(e) {
if (!e.data || e.data.type !== ‘START_REST_TIMER’) return;

var sec = e.data.sec;
var endTime = e.data.endTime;

// Wait until rest period ends, then notify
var delay = Math.max(0, endTime - Date.now());

setTimeout(function() {
self.registration.showNotification(‘Descanso concluído! 💪’, {
body: ‘Hora da próxima série.’,
icon: ‘/icon-192.png’,
badge: ‘/icon-192.png’,
tag: ‘rest-timer’,
renotify: true,
requireInteraction: false,
silent: false,
vibrate: [200, 100, 200]
});
}, delay);
});

// Cancel notification if user skipped timer
self.addEventListener(‘message’, function(e) {
if (!e.data || e.data.type !== ‘CANCEL_REST_TIMER’) return;
self.registration.getNotifications({ tag: ‘rest-timer’ }).then(function(notifs) {
notifs.forEach(function(n) { n.close(); });
});
});

// Open app when notification is tapped
self.addEventListener(‘notificationclick’, function(e) {
e.notification.close();
e.waitUntil(
self.clients.matchAll({ type: ‘window’, includeUncontrolled: true }).then(function(clients) {
if (clients.length > 0) {
return clients[0].focus();
}
return self.clients.openWindow(’/’);
})
);
});