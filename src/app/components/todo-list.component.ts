import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <!-- Header -->
      <header class="header">
        <h1>📝 Todo List with TanStack Query</h1>
        <p class="subtitle">Hover over any todo to see detailed information</p>
      </header>
      
      <!-- Loading State -->
      @if (todosQuery.isPending()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading todos...</p>
        </div>
      }
      
      <!-- Error State -->
      @if (todosQuery.isError()) {
        <div class="error">
          <p>❌ Error: {{ todosQuery.error().message }}</p>
        </div>
      }
      
      <!-- Success State -->
      @if (todosQuery.isSuccess()) {
        <!-- Status Bar -->
        <div class="status-bar">
          <div class="status-info">
            @if (todosQuery.isFetching()) {
              <span class="fetching">🔄 Refreshing in background...</span>
            } @else {
              <span class="success">✅ Data is up to date</span>
            }
            <span class="timer">
              ⏱️ Next refresh in: <strong class="countdown">{{ countdown() }}s</strong>
            </span>
          </div>
          <span class="count">Total: {{ todosQuery.data().length }} todos</span>
        </div>
        
        <!-- Todo List -->
        <div class="todo-list">
          @for (todo of todosQuery.data(); track todo.id) {
            <div 
              class="todo-item" 
              [class.completed]="todo.completed"
              (mouseenter)="onTodoHover(todo.id)"
              (mouseleave)="onTodoLeave()">
              
              <input type="checkbox" [checked]="todo.completed" disabled>
              <span class="todo-id">{{ todo.id }}</span>
              <span class="todo-title">{{ todo.title }}</span>
              
              @if (todo.completed) {
                <span class="badge badge-completed">✓ Done</span>
              } @else {
                <span class="badge badge-pending">⏳ Pending</span>
              }
              
              <!-- Popover -->
              @if (hoveredTodoId() === todo.id && todoDetailQuery) {
                <div class="popover">
                  @if (todoDetailQuery.isPending()) {
                    <div class="popover-loading">
                      <span class="spinner-small"></span>
                      Loading details...
                    </div>
                  }
                  
                  @if (todoDetailQuery.isSuccess()) {
                    <div class="popover-content">
                      <h3>Todo Details</h3>
                      <div class="detail-row">
                        <strong>ID:</strong> 
                        <span>{{ todoDetailQuery.data().id }}</span>
                      </div>
                      <div class="detail-row">
                        <strong>User ID:</strong> 
                        <span>{{ todoDetailQuery.data().userId }}</span>
                      </div>
                      <div class="detail-row">
                        <strong>Title:</strong> 
                        <span>{{ todoDetailQuery.data().title }}</span>
                      </div>
                      <div class="detail-row">
                        <strong>Status:</strong> 
                        <span [class.text-success]="todoDetailQuery.data().completed"
                              [class.text-pending]="!todoDetailQuery.data().completed">
                          {{ todoDetailQuery.data().completed ? 'Completed' : 'Pending' }}
                        </span>
                      </div>
                      <div class="api-info">
                        🌐 Fetched from API
                      </div>
                    </div>
                  }
                  
                  @if (todoDetailQuery.isError()) {
                    <div class="popover-error">
                      ❌ Failed to load details
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    /* Container & Layout */
    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .header h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    /* Loading & Error States */
    .loading {
      text-align: center;
      padding: 3rem;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    .spinner-small {
      display: inline-block;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      color: #e74c3c;
      background: #fadbd8;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }
    
    /* Status Bar */
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      gap: 1rem;
    }
    
    .status-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .fetching {
      color: #3498db;
      font-weight: 600;
    }
    
    .success {
      color: #27ae60;
      font-weight: 600;
    }
    
    .timer {
      color: #7f8c8d;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .countdown {
      display: inline-block;
      min-width: 20px;
      padding: 0.25rem 0.5rem;
      background: #3498db;
      color: white;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 700;
      text-align: center;
      animation: pulse 1s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    .count {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    /* Todo List */
    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .todo-item {
      position: relative;
      padding: 1rem;
      background: white;
      border: 1px solid #e1e8ed;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .todo-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
      border-color: #3498db;
    }
    
    .todo-item.completed {
      background: #f8f9fa;
      opacity: 0.8;
    }
    
    .todo-item.completed .todo-title {
      text-decoration: line-through;
      color: #95a5a6;
    }
    
    .todo-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      flex-shrink: 0;
    }
    
    .todo-id {
      display: inline-block;
      min-width: 40px;
      padding: 0.35rem 0.6rem;
      background: #3498db;
      color: white;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: bold;
      text-align: center;
      flex-shrink: 0;
    }
    
    .todo-title {
      flex: 1;
      color: #2c3e50;
      font-size: 1rem;
      line-height: 1.4;
    }
    
    /* Badges */
    .badge {
      padding: 0.35rem 0.85rem;
      border-radius: 14px;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .badge-completed {
      background: #27ae60;
      color: white;
    }
    
    .badge-pending {
      background: #f39c12;
      color: white;
    }
    
    /* Popover */
    .popover {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 0.5rem;
      background: white;
      border: 2px solid #3498db;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 1000;
      min-width: 300px;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    .popover-loading,
    .popover-error {
      padding: 1rem;
      text-align: center;
      color: #7f8c8d;
    }
    
    .popover-error {
      color: #e74c3c;
    }
    
    .popover-content {
      padding: 1.25rem;
    }
    
    .popover-content h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #ecf0f1;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .detail-row:last-of-type {
      border-bottom: none;
    }
    
    .detail-row strong {
      color: #7f8c8d;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .detail-row span {
      color: #2c3e50;
      font-size: 0.9rem;
      text-align: right;
      max-width: 60%;
    }
    
    .text-success {
      color: #27ae60 !important;
      font-weight: 600;
    }
    
    .text-pending {
      color: #f39c12 !important;
      font-weight: 600;
    }
    
    .api-info {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #e8f5e9;
      border-radius: 6px;
      text-align: center;
      font-size: 0.8rem;
      color: #27ae60;
      font-weight: 600;
    }
  `]
})
export class TodoListComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  
  // Main todos query with background refetching
  todosQuery = this.todoService.getTodos();
  
  // Track hovered todo ID
  hoveredTodoId = signal<number | null>(null);
  
  // Query for individual todo details
  todoDetailQuery: ReturnType<typeof this.todoService.getTodoById> | null = null;
  
  // Countdown timer
  countdown = signal<number>(10);
  private countdownInterval?: number;
  private readonly REFETCH_INTERVAL = 10; // 10 seconds
  
  ngOnInit(): void {
    this.startCountdown();
  }
  
  ngOnDestroy(): void {
    this.stopCountdown();
  }
  
  /**
   * Start the countdown timer
   */
  private startCountdown(): void {
    this.countdown.set(this.REFETCH_INTERVAL);
    
    this.countdownInterval = window.setInterval(() => {
      const current = this.countdown();
      
      if (current <= 1) {
        // Reset to 10 when it reaches 0
        this.countdown.set(this.REFETCH_INTERVAL);
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }
  
  /**
   * Stop the countdown timer
   */
  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  
  /**
   * Handle mouse enter on todo item
   * Fetches detailed information from API
   */
  onTodoHover(todoId: number): void {
    this.hoveredTodoId.set(todoId);
    this.todoDetailQuery = this.todoService.getTodoById(todoId);
  }
  
  /**
   * Handle mouse leave from todo item
   */
  onTodoLeave(): void {
    this.hoveredTodoId.set(null);
    this.todoDetailQuery = null;
  }
}
