import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, CreateMenuRequest, Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'http://localhost:8081/api/menus';

  constructor(private http: HttpClient) {}

  // Get all menus
  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.baseUrl);
  }

  // Get menu by ID
  getMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/${id}`);
  }

  // Get menu by Menu ID
  getMenuByMenuId(menuId: string): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/menu-id/${menuId}`);
  }

  // Create new menu
  createMenu(menu: CreateMenuRequest): Observable<ApiResponse<Menu>> {
    return this.http.post<ApiResponse<Menu>>(this.baseUrl, menu);
  }

  // Update menu
  updateMenu(
    id: number,
    menu: CreateMenuRequest
  ): Observable<ApiResponse<Menu>> {
    return this.http.put<ApiResponse<Menu>>(`${this.baseUrl}/${id}`, menu);
  }

  // Delete menu
  deleteMenu(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  // Get vegetarian menus
  getVegMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.baseUrl}/veg`);
  }

  // Get non-vegetarian menus
  getNonVegMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.baseUrl}/non-veg`);
  }

  // Update menu status
  updateMenuStatus(
    id: number,
    status: 'AVAILABLE' | 'UNAVAILABLE'
  ): Observable<ApiResponse<Menu>> {
    return this.http.patch<ApiResponse<Menu>>(
      `${this.baseUrl}/${id}/status?status=${status}`,
      {}
    );
  }
}
