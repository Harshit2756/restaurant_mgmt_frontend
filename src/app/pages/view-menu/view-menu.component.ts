import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Menu } from '../../models/menu.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-menu.component.html',
  styleUrl: './view-menu.component.css',
})
export class ViewMenuComponent implements OnInit {
  menus: Menu[] = [];
  vegMenus: Menu[] = [];
  nonVegMenus: Menu[] = [];
  filteredVegMenus: Menu[] = [];
  filteredNonVegMenus: Menu[] = [];
  isLoading = false;
  errorMessage = '';
  menuToDelete: Menu | null = null;
  showDeleteModal = false;
  viewMode: 'table' | 'grid' = 'table';

  // Vegetarian Filters
  vegSearchTerm = '';
  vegSelectedCategory = '';
  vegSelectedStatus = '';

  // Non-Vegetarian Filters
  nonVegSearchTerm = '';
  nonVegSelectedCategory = '';
  nonVegSelectedStatus = '';

  categories = [
    { value: '', label: 'All Categories' },
    { value: 'BREAKFAST', label: '🌅 Breakfast' },
    { value: 'LUNCH', label: '☀️ Lunch' },
    { value: 'DINNER', label: '🌙 Dinner' },
  ];

  statuses = [
    { value: '', label: 'All Status' },
    { value: 'AVAILABLE', label: '✅ Available' },
    { value: 'UNAVAILABLE', label: '❌ Unavailable' },
  ];

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.isLoading = true;
    this.errorMessage = '';

    this.menuService.getAllMenus().subscribe({
      next: (menus) => {
        this.menus = menus;
        this.separateMenusByType();
        this.applyVegFilters();
        this.applyNonVegFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load menu items. Please try again later.';
        this.isLoading = false;
        console.error('Error loading menus:', error);
      },
    });
  }

  separateMenusByType() {
    this.vegMenus = this.menus.filter((menu) => menu.menuType === 'VEG');
    this.nonVegMenus = this.menus.filter((menu) => menu.menuType === 'NON_VEG');
  }

  // Vegetarian Menu Filters
  applyVegFilters() {
    this.filteredVegMenus = this.vegMenus.filter((menu) => {
      const matchesSearch =
        menu.menuName
          .toLowerCase()
          .includes(this.vegSearchTerm.toLowerCase()) ||
        menu.description
          .toLowerCase()
          .includes(this.vegSearchTerm.toLowerCase());
      const matchesCategory =
        !this.vegSelectedCategory || menu.category === this.vegSelectedCategory;
      const matchesStatus =
        !this.vegSelectedStatus || menu.status === this.vegSelectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  onVegSearchChange() {
    this.applyVegFilters();
  }

  onVegFilterChange() {
    this.applyVegFilters();
  }

  clearVegFilters() {
    this.vegSearchTerm = '';
    this.vegSelectedCategory = '';
    this.vegSelectedStatus = '';
    this.applyVegFilters();
  }

  // Non-Vegetarian Menu Filters
  applyNonVegFilters() {
    this.filteredNonVegMenus = this.nonVegMenus.filter((menu) => {
      const matchesSearch =
        menu.menuName
          .toLowerCase()
          .includes(this.nonVegSearchTerm.toLowerCase()) ||
        menu.description
          .toLowerCase()
          .includes(this.nonVegSearchTerm.toLowerCase());
      const matchesCategory =
        !this.nonVegSelectedCategory ||
        menu.category === this.nonVegSelectedCategory;
      const matchesStatus =
        !this.nonVegSelectedStatus || menu.status === this.nonVegSelectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  onNonVegSearchChange() {
    this.applyNonVegFilters();
  }

  onNonVegFilterChange() {
    this.applyNonVegFilters();
  }

  clearNonVegFilters() {
    this.nonVegSearchTerm = '';
    this.nonVegSelectedCategory = '';
    this.nonVegSelectedStatus = '';
    this.applyNonVegFilters();
  }

  // Common methods
  editMenu(menu: Menu) {
    this.router.navigate(['/update-menu', menu.id]);
  }

  deleteMenu(menu: Menu) {
    this.menuToDelete = menu;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.menuToDelete) {
      this.menuService.deleteMenu(this.menuToDelete.id).subscribe({
        next: (response) => {
          this.loadMenus(); // Reload the list
          this.closeDeleteModal();
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Failed to delete menu item. Please try again.';
          this.closeDeleteModal();

          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        },
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.menuToDelete = null;
  }

  toggleStatus(menu: Menu) {
    const newStatus = menu.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    this.menuService.updateMenuStatus(menu.id, newStatus).subscribe({
      next: (response) => {
        menu.status = newStatus;
        this.applyVegFilters();
        this.applyNonVegFilters();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Failed to update menu status. Please try again.';

        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },
    });
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'BREAKFAST':
        return 'bi bi-sunrise';
      case 'LUNCH':
        return 'bi bi-sun';
      case 'DINNER':
        return 'bi bi-moon-stars';
      default:
        return 'bi bi-clock';
    }
  }

  getTypeIcon(type: string): string {
    return type === 'VEG'
      ? 'bi bi-circle-fill text-success'
      : 'bi bi-circle-fill text-danger';
  }

  getStatusIcon(status: string): string {
    return status === 'AVAILABLE'
      ? 'bi bi-check-circle-fill'
      : 'bi bi-x-circle-fill';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'AVAILABLE' ? 'badge bg-success' : 'badge bg-danger';
  }

  getTypeBadgeClass(type: string): string {
    return type === 'VEG' ? 'badge bg-success' : 'badge bg-warning';
  }

  trackByMenuId(index: number, menu: Menu): number {
    return menu.id;
  }
}
