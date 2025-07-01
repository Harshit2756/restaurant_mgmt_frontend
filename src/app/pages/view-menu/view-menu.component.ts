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
  filteredMenus: Menu[] = [];
  isLoading = false;
  errorMessage = '';
  menuToDelete: Menu | null = null;
  showDeleteModal = false;
  viewMode: 'table' | 'grid' = 'table';

  // Filters
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  selectedStatus = '';

  categories = [
    { value: '', label: 'All Categories' },
    { value: 'BREAKFAST', label: '🌅 Breakfast' },
    { value: 'LUNCH', label: '☀️ Lunch' },
    { value: 'DINNER', label: '🌙 Dinner' },
  ];

  types = [
    { value: '', label: 'All Types' },
    { value: 'VEG', label: '🥗 Vegetarian' },
    { value: 'NON_VEG', label: '🍗 Non-Vegetarian' },
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
        this.applyFilters();
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

  applyFilters() {
    this.filteredMenus = this.menus.filter((menu) => {
      const matchesSearch =
        menu.menuName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        menu.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        !this.selectedCategory || menu.category === this.selectedCategory;
      const matchesType =
        !this.selectedType || menu.menuType === this.selectedType;
      const matchesStatus =
        !this.selectedStatus || menu.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

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
        this.applyFilters();
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
