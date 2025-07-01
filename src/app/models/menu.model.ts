export interface Menu {
  id: number;
  menuId: string;
  menuName: string;
  description: string;
  price: number;
  menuType: 'VEG' | 'NON_VEG';
  category: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  status: 'AVAILABLE' | 'UNAVAILABLE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuRequest {
  menuName: string;
  description: string;
  price: number;
  menuType: 'VEG' | 'NON_VEG';
  category: 'BREAKFAST' | 'LUNCH' | 'DINNER';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
