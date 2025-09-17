import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  categoryId: number = 0;
  items: any[] = [];
  filteredItems: any[] = [];
  categories: { id: number, name: string }[] = [];
  searchTerm: string = '';
  errorMessage: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.dataService.getItemsByCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response.IsSuccess) {
          this.items = response.ResponseData;
          this.extractCategories(this.items);
          this.applyFilter();
        } else {
          this.errorMessage = 'Data loading failed: ' + response.Message;
        }
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.errorMessage = 'An error occurred while loading data.';
      }
    });
  }

  extractCategories(items: any[]): void {
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    this.categories = uniqueCategories.map(id => ({
      id,
      name: `Category-${id}`
    }));
  }

  onCategoryChange(): void {
    this.loadItems();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.item.toLowerCase().includes(term)
    );
  }
}
