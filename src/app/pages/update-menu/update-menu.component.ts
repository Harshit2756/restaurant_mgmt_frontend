import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMenuRequest, Menu } from '../../models/menu.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-update-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-menu.component.html',
  styleUrl: './update-menu.component.css',
})
export class UpdateMenuComponent implements OnInit {
  menuForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  menuId: number = 0;
  currentMenu: Menu | null = null;

  menuTypes = [
    { value: 'VEG', label: 'Vegetarian' },
    { value: 'NON_VEG', label: 'Non-Vegetarian' },
  ];

  categories = [
    { value: 'BREAKFAST', label: 'Breakfast' },
    { value: 'LUNCH', label: 'Lunch' },
    { value: 'DINNER', label: 'Dinner' },
  ];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.menuForm = this.fb.group({
      menuName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          this.nameValidator,
        ],
      ],
      description: ['', [Validators.maxLength(500), this.descriptionValidator]],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(10000),
          this.priceValidator,
        ],
      ],
      menuType: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.menuId = +params['id'];
      if (this.menuId) {
        this.loadMenuData();
      }
    });
  }

  loadMenuData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.menuService.getMenuById(this.menuId).subscribe({
      next: (menu) => {
        this.currentMenu = menu;
        this.populateForm(menu);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load menu data';
        this.isLoading = false;
      },
    });
  }

  populateForm(menu: Menu) {
    this.menuForm.patchValue({
      menuName: menu.menuName,
      description: menu.description,
      price: menu.price,
      menuType: menu.menuType,
      category: menu.category,
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const menuData: CreateMenuRequest = this.menuForm.value;

      this.menuService.updateMenu(this.menuId, menuData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          // Redirect to view menu after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/view-menu']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || 'Failed to update menu item';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/view-menu']);
  }

  private markFormGroupTouched() {
    Object.keys(this.menuForm.controls).forEach((key) => {
      const control = this.menuForm.get(key);
      control?.markAsTouched();
    });
  }

  // Custom Validators
  nameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const value = control.value.trim();

    // Check for only numbers
    if (/^\d+$/.test(value)) {
      return { onlyNumbers: true };
    }

    // Check for excessive special characters
    if (/[^a-zA-Z0-9\s&'-]/g.test(value)) {
      return { invalidCharacters: true };
    }

    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(value)) {
      return { multipleSpaces: true };
    }

    return null;
  }

  descriptionValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const value = control.value.trim();

    // If description is provided, it should be at least 10 characters
    if (value.length > 0 && value.length < 10) {
      return { tooShort: true };
    }

    return null;
  }

  priceValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const value = parseFloat(control.value);

    // Check if it's a valid number
    if (isNaN(value)) {
      return { invalidNumber: true };
    }

    // Check for more than 2 decimal places
    const decimalPlaces = (control.value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { tooManyDecimals: true };
    }

    return null;
  }

  getFieldError(fieldName: string): string {
    const field = this.menuForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;

      // Required validation
      if (errors['required']) {
        switch (fieldName) {
          case 'menuName':
            return 'Menu name is required';
          case 'price':
            return 'Price is required';
          case 'menuType':
            return 'Please select a menu type';
          case 'category':
            return 'Please select a category';
          default:
            return `${fieldName} is required`;
        }
      }

      // Menu Name specific validations
      if (fieldName === 'menuName') {
        if (errors['minlength'])
          return 'Menu name must be at least 2 characters long';
        if (errors['maxlength'])
          return 'Menu name cannot exceed 100 characters';
        if (errors['onlyNumbers'])
          return 'Menu name cannot contain only numbers';
        if (errors['invalidCharacters'])
          return "Menu name contains invalid characters (only letters, numbers, spaces, &, ', - allowed)";
        if (errors['multipleSpaces'])
          return 'Menu name cannot have multiple consecutive spaces';
      }

      // Description specific validations
      if (fieldName === 'description') {
        if (errors['maxlength'])
          return 'Description cannot exceed 500 characters';
        if (errors['tooShort'])
          return 'Description must be at least 10 characters if provided';
      }

      // Price specific validations
      if (fieldName === 'price') {
        if (errors['min']) return 'Price must be at least $0.01';
        if (errors['max']) return 'Price cannot exceed $10,000.00';
        if (errors['invalidNumber']) return 'Please enter a valid price';
        if (errors['tooManyDecimals'])
          return 'Price can have maximum 2 decimal places';
      }
    }
    return '';
  }
}
