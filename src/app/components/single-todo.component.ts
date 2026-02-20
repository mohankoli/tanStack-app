import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-single-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="single-todo-container">
      <h2>🎯 Fetch Single Todo by ID</h2>
      <p class="description">Enter a todo ID (1-200) to fetch specific todo details from the API</p>
      
      <!-- Input Section -->
      <div class="input-section">
        <label for="todoId">Todo ID:</label>
        <input 
          id="todoId"
          type="number" 
          [(ngModel)]="todoId"
          (input)="onIdChange()"
          min="1" 
          max="200"
          placeholder="Enter ID (1-200)">
        <button (click)="fetchTodo()" [disabled]="!isValidId()">
          Fetch Todo
        </button>
      </div>

      <!-- Query Status -->
      @if (shouldFetch()) {
        <div class="query-status">
          @if (todoQuery.isPending()) {
            <div class="status-loading">
              <span class="spinner"></span>
              Loading todo #{{ todoId() }}...
            </div>
          }

          @if (todoQuery.isFetching() && !todoQuery.isPending()) {
            <div class="status-refetching">
              🔄 Refetching data...
            </div>
          }

          @if (todoQuery.isError()) {
            <div class="status-error">
              ❌ Error: {{ todoQuery.error().message }}
            </div>
          }

          @if (todoQuery.isSuccess()) {
            <div class="status-success">
              ✅ Data loaded successfully
              @if (todoQuery.isFetching()) {
                <span class="refetch-badge">Refreshing...</span>
              }
            </div>
          }
        </div>

        <!-- Todo Details Card -->
        @if (todoQuery.isSuccess()) {
          <div class="todo-card">
            <div class="card-header">
              <h3>Todo Details</h3>
              <span class="todo-badge" [class.completed]="todoQuery.data().completed">
                {{ todoQuery.data().completed ? '✓ Completed' : '⏳ Pending' }}
              </span>
            </div>
            
            <div class="card-body">
              <div class="detail-row">
                <span class="label">ID:</span>
                <span class="value">{{ todoQuery.data().id }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">{{ todoQuery.data().userId }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Title:</span>
                <span class="value">{{ todoQuery.data().title }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Completed:</span>
                <span class="value" [class.text-success]="todoQuery.data().completed"
                      [class.text-danger]="!todoQuery.data().completed">
                  {{ todoQuery.data().completed ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <small>🌐 Data fetched from: <code>https://jsonplaceholder.typicode.com/todos/{{ todoQuery.data().id }}</code></small>
            </div>
          </div>
        }
      } @else {
        <div class="empty-state">
          <p>👆 Enter a todo ID above and click "Fetch Todo" to get started</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .single-todo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .description {
      color: #7f8c8d;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    /* Input Section */
    .input-section {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .input-section label {
      font-weight: 600;
      color: #2c3e50;
    }

    .input-section input {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .input-section input:focus {
      outline: none;
      border-color: #3498db;
    }

    .input-section button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .input-section button:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }

    .input-section button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    /* Query Status */
    .query-status {
      margin-bottom: 1.5rem;
    }

    .status-loading,
    .status-refetching,
    .status-error,
    .status-success {
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-loading {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-refetching {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-error {
      background: #ffebee;
      color: #c62828;
    }

    .status-success {
      background: #e8f5e9;
      color: #2e7d32;
      justify-content: space-between;
    }

    .refetch-badge {
      padding: 0.25rem 0.75rem;
      background: #ff9800;
      color: white;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #e3f2fd;
      border-top: 2px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Todo Card */
    .todo-card {
      background: white;
      border: 2px solid #e1e8ed;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .todo-badge {
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .todo-badge.completed {
      background: #27ae60;
    }

    .card-body {
      padding: 2rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      font-weight: 600;
      color: #7f8c8d;
    }

    .detail-row .value {
      color: #2c3e50;
      font-weight: 500;
      text-align: right;
      max-width: 60%;
    }

    .text-success {
      color: #27ae60 !important;
      font-weight: 700;
    }

    .text-danger {
      color: #e74c3c !important;
      font-weight: 700;
    }

    .card-footer {
      background: #f8f9fa;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e1e8ed;
    }

    .card-footer small {
      color: #7f8c8d;
      font-size: 0.85rem;
    }

    .card-footer code {
      background: #e8f5e9;
      color: #27ae60;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #95a5a6;
      font-size: 1.1rem;
    }
  `]
})
export class SingleTodoComponent {
  private todoService = inject(TodoService);
  
  todoId = signal<number>(1);
  shouldFetch = signal<boolean>(false);
  
  // Create query with dynamic signals
  todoQuery = this.todoService.getTodoByIdDynamic(this.todoId, this.shouldFetch);

  onIdChange(): void {
    // Reset fetch state when ID changes
    this.shouldFetch.set(false);
  }

  fetchTodo(): void {
    if (this.isValidId()) {
      this.shouldFetch.set(true);
    }
  }

  isValidId(): boolean {
    const id = this.todoId();
    return id >= 1 && id <= 200;
  }
}
