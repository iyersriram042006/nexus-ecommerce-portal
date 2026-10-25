import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const ORDERS_COLLECTION = 'orders';
const LOCAL_ORDERS_KEY = 'nexus_local_orders';

export const createOrder = async (orderPayload) => {
  const trackingNumber = `NX-IND-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newOrder = {
    ...orderPayload,
    trackingNumber,
    status: 'Placed', // 'Placed' | 'Packed' | 'Shipped' | 'Delivered'
    timeline: [
      {
        status: 'Placed',
        title: 'Order Confirmed',
        description: 'Payment verified and sent to fulfillment hub',
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    const savedOrder = { id: docRef.id, ...newOrder };

    // Also mirror to local storage
    const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([savedOrder, ...existing]));

    return savedOrder;
  } catch (err) {
    console.warn('Firestore createOrder failed, falling back to local storage:', err);
    const localId = `ord-${Date.now()}`;
    const savedOrder = { id: localId, ...newOrder };
    const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([savedOrder, ...existing]));
    return savedOrder;
  }
};

export const fetchOrdersByUser = async (userId) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const orders = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest first
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } catch (err) {
    console.warn('Firestore fetchOrdersByUser failed, falling back to local storage:', err);
  }

  // Fallback to local storage
  const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  return localOrders
    .filter((o) => !userId || o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const fetchAllOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const orders = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } catch (err) {
    console.warn('Firestore fetchAllOrders failed, falling back to local storage:', err);
  }

  const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  return localOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const fetchOrderById = async (orderId) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (err) {
    console.warn(`Firestore fetchOrderById ${orderId} failed:`, err);
  }

  const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  return localOrders.find((o) => o.id === orderId) || null;
};

const STATUS_DESCRIPTIONS = {
  Placed: 'Order Confirmed - Payment verified and logged.',
  Packed: 'Packed & Quality Inspected at Fulfillment Center.',
  Shipped: 'Handed to Express Logistics Courier for transit.',
  Delivered: 'Delivered safely to shipping address.',
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const now = new Date().toISOString();
  const timelineItem = {
    status: newStatus,
    title: newStatus,
    description: STATUS_DESCRIPTIONS[newStatus] || `Status updated to ${newStatus}`,
    timestamp: now,
  };

  try {
    const orderDoc = await fetchOrderById(orderId);
    const existingTimeline = orderDoc?.timeline || [];
    const updatedTimeline = [...existingTimeline, timelineItem];

    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: newStatus,
      timeline: updatedTimeline,
      updatedAt: now,
    });
  } catch (err) {
    console.warn('Firestore updateOrderStatus failed, updating local storage:', err);
  }

  // Update in local storage
  const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  const updatedLocal = localOrders.map((o) => {
    if (o.id === orderId) {
      const existingTimeline = o.timeline || [];
      return {
        ...o,
        status: newStatus,
        timeline: [...existingTimeline, timelineItem],
        updatedAt: now,
      };
    }
    return o;
  });
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updatedLocal));

  return { success: true, status: newStatus };
};
