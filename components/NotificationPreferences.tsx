'use client';

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function isPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export default function NotificationPreferences() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'enabled' | 'not-subscribed' | 'blocked' | 'unsupported' | 'error'>('not-subscribed');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) {
      setSubscriptionStatus('unsupported');
      return;
    }

    setPermission(Notification.permission);

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.getSubscription();
        setSubscriptionStatus(subscription ? 'enabled' : 'not-subscribed');
      } catch (error) {
        setSubscriptionStatus('error');
        console.error('Error checking push subscription:', error);
      }
    })();
  }, []);

  const enableNotifications = async () => {
    if (!isPushSupported()) {
      setSubscriptionStatus('unsupported');
      setMessage('Tu navegador no soporta notificaciones push.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      let currentPermission = Notification.permission;

      if (currentPermission === 'default') {
        currentPermission = await Notification.requestPermission();
      }

      setPermission(currentPermission);

      if (currentPermission !== 'granted') {
        setSubscriptionStatus('blocked');
        setMessage('Permiso de notificaciones denegado. Activa las notificaciones en la configuración del navegador.');
        return;
      }

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await saveSubscription(existingSubscription);
        setSubscriptionStatus('enabled');
        setMessage('Notificaciones habilitadas.');
        return;
      }

      const vapidResponse = await fetch('/api/notifications/vapid');
      if (!vapidResponse.ok) {
        throw new Error('No se pudo cargar la clave pública de VAPID');
      }

      const { publicKey } = await vapidResponse.json();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await saveSubscription(subscription);
      setSubscriptionStatus('enabled');
      setMessage('Notificaciones habilitadas correctamente.');
    } catch (error) {
      console.error('Error habilitando notificaciones:', error);
      setSubscriptionStatus('error');
      setMessage('No se pudo habilitar las notificaciones. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const saveSubscription = async (subscription: PushSubscription) => {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription }),
    });
  };

  const sendTestNotification = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Error enviando notificación de prueba');
      }
      setMessage('Notificación de prueba enviada. Revisa tu dispositivo.');
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
      setMessage(error instanceof Error ? error.message : 'Error enviando notificación de prueba');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = () => {
    switch (subscriptionStatus) {
      case 'enabled':
        return 'Notificaciones habilitadas';
      case 'not-subscribed':
        return 'Notificaciones disponibles, aún no activadas';
      case 'blocked':
        return 'Permiso de notificaciones bloqueado';
      case 'unsupported':
        return 'Notificaciones no compatibles en este navegador';
      case 'error':
        return 'Error verificando estado de notificaciones';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recordatorio de racha</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Activa una notificación diaria para recordarte completar la racha antes de las 22:00.
          </p>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Estado: {getStatusText()}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={enableNotifications}
          disabled={loading || subscriptionStatus === 'unsupported' || subscriptionStatus === 'enabled'}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {subscriptionStatus === 'enabled' ? 'Notificaciones activadas' : 'Activar notificaciones'}
        </button>
        <button
          type="button"
          onClick={sendTestNotification}
          disabled={loading || subscriptionStatus !== 'enabled'}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          Enviar prueba
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          {message}
        </div>
      )}
    </div>
  );
}
