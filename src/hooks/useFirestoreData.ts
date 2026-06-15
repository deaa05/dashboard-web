import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Product {
  itemCode:     string;
  itemName:     string;
  categoryCode: string;
  categoryName: string;
  slug:         string;
}

export interface Category {
  categoryCode: string;
  categoryName: string;
  count:        number;
}

export interface FirestoreData {
  products:    Product[];
  categories:  Category[];
  loading:     boolean;
  error:       string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useFirestoreData(): FirestoreData {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and categories in parallel
        const [productsSnap, categoriesSnap] = await Promise.all([
          getDocs(query(collection(db, "products"),   orderBy("itemName"))),
          getDocs(query(collection(db, "categories"), orderBy("categoryName"))),
        ]);

        setProducts(
          productsSnap.docs.map(doc => doc.data() as Product)
        );
        setCategories(
          categoriesSnap.docs.map(doc => doc.data() as Category)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { products, categories, loading, error };
}
