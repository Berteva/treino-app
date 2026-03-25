// Service Worker — Rest Timer Notifications
// v2 — compatible with GitHub Pages subpath

self.addEventListener(‘install’, function(e) {
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(self.clients.claim());
});

var pendingTimer = null;

self.addEventListener(‘message’, function(e) {
if (!e.data) return;

if (e.data.type === ‘START_REST_TIMER’) {
// Clear any existing pending timer
if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
var delay = Math.max(0, e.data.endTime - Date.now());
pendingTimer = setTimeout(function() {
pendingTimer = null;
self.registration.showNotification(‘Descanse concluido! Próxima série 💪’, {
body: ‘Toque para voltar ao treino.’,
tag: ‘rest-timer’,
renotify: true,
requireInteraction: false,
silent: false,
vibrate: [200, 100, 200]
});
}, delay);
}

if (e.data.type === ‘CANCEL_REST_TIMER’) {
if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
self.registration.getNotifications({ tag: ‘rest-timer’ }).then(function(notifs) {
for (var i = 0; i < notifs.length; i++) notifs[i].close();
});
}
});

self.addEventListener(‘notificationclick’, function(e) {
e.notification.close();
e.waitUntil(
self.clients.matchAll({ type: ‘window’, includeUncontrolled: true }).then(function(clients) {
if (clients.length > 0) return clients[0].focus();
return self.clients.openWindow(self.registration.scope);
})
);
});