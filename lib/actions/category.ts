/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/category.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Category } from '@/lib/types/category';

// ✅ Helper: ambil token dari cookies (async)
async function getAuthToken() {
  const cookieStore = await cookies(); // ✅ await di sini!
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    // Opsional: redirect ke login
    // redirect('/login');
    throw new Error('Unauthorized: Token tidak ditemukan');
  }
  return token;
}

// ✅ Helper: wrapper fetch dengan auth (async)
async function authedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken(); // ✅ await
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    const cookieStore = await cookies(); // ✅ await
    cookieStore.delete('auth_token');   // ✅ delete via instance
    redirect('/login');
  }

  return res;
}

// ✅ Action: fetch categories
export async function fetchCategoriesAction(): Promise<Category[]> {
  try {
    const res = await authedFetch('http://127.0.0.1:8000/api/categories');
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[fetchCategoriesAction]', error);
    throw new Error('Gagal mengambil data kategori');
  }
}

// ✅ Action: delete category
export async function deleteCategoryAction(id: number) {
  try {
    const res = await authedFetch(`http://127.0.0.1:8000/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      revalidatePath('/admin/asset/category');
      return { success: true };
    } else {
      const errorData = await res.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || 'Gagal menghapus kategori' 
      };
    }
  } catch (error) {
    console.error('[deleteCategoryAction]', error);
    return { 
      success: false, 
      message: 'Terjadi kesalahan jaringan' 
    };
  }
}

// ✅ Action: create category
export async function createCategoryAction(
  prevState: any,
  formData: FormData
) {
  try {
    const nama = formData.get('nama_kategori') as string;
    const deskripsi = formData.get('deskripsi') as string;

    if (!nama?.trim()) {
      return { success: false, message: 'Nama kategori wajib diisi' };
    }

    const res = await authedFetch('http://127.0.0.1:8000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nama_kategori: nama.trim(), 
        deskripsi: deskripsi?.trim() 
      }),
    });

    if (res.ok) {
      const newCategory = await res.json();
      revalidatePath('/admin/asset/category');
      return { success: true, data: newCategory };
    } else {
      const errorData = await res.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || 'Gagal menambah kategori' 
      };
    }
  } catch (error) {
    console.error('[createCategoryAction]', error);
    return { 
      success: false, 
      message: 'Terjadi kesalahan. Coba lagi.' 
    };
  }
}

// ✅ Action: update category
export async function updateCategoryAction(id: number, formData: FormData) {
  try {
    const nama = formData.get('nama_kategori') as string;
    const deskripsi = formData.get('deskripsi') as string;

    if (!nama?.trim()) {
      return { success: false, message: 'Nama kategori wajib diisi' };
    }

    const res = await authedFetch(`http://127.0.0.1:8000/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nama_kategori: nama.trim(), 
        deskripsi: deskripsi?.trim() 
      }),
    });

    if (res.ok) {
      revalidatePath('/admin/asset/category');
      return { success: true };
    } else {
      const errorData = await res.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || 'Gagal memperbarui kategori' 
      };
    }
  } catch (error) {
    console.error('[updateCategoryAction]', error);
    return { 
      success: false, 
      message: 'Terjadi kesalahan. Coba lagi.' 
    };
  }
}