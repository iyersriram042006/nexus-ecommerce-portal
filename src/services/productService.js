import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { db } from './firebase';
import { SEED_PRODUCTS } from '../data/seedProducts';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products from Firestore.
 * If collection is empty, gracefully returns SEED_PRODUCTS as fallback.
 */
export const fetchProducts = async () => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const prods = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (docSnap.id === 'prod-sp-01' && (data.image?.includes('1508685096489') || data.image?.includes('1579586337278'))) {
          data.image = '/images/garmin-fenix-7.jpg';
        }
        prods.push({ id: docSnap.id, ...data });
      });
      return prods;
    }
  } catch (err) {
    console.warn('Error fetching products from Firestore, using seed fallback:', err);
  }
  // Return local seed products if Firestore is empty or unreachable
  return SEED_PRODUCTS;
};

/**
 * Fetch a single product by ID.
 */
export const fetchProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (docSnap.id === 'prod-sp-01' && (data.image?.includes('1508685096489') || data.image?.includes('1579586337278'))) {
        data.image = '/images/garmin-fenix-7.jpg';
      }
      return { id: docSnap.id, ...data };
    }
  } catch (err) {
    console.warn(`Error fetching product ${productId} from Firestore:`, err);
  }
  return SEED_PRODUCTS.find((p) => p.id === productId) || null;
};

/**
 * Seed all 40 products into Firestore 'products' collection.
 */
export const seedProductsToFirestore = async () => {
  let count = 0;
  for (const product of SEED_PRODUCTS) {
    const { id, ...data } = product;
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    count++;
  }
  return count;
};

/**
 * Add a new product to Firestore.
 */
export const createProduct = async (productData) => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...productData };
};

/**
 * Update an existing product in Firestore.
 */
export const updateProduct = async (productId, productData) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: new Date().toISOString(),
  });
  return { id: productId, ...productData };
};

/**
 * Delete a product from Firestore.
 */
export const deleteProduct = async (productId) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
  return productId;
};
