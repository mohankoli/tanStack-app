import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list.component';
import { SingleTodoComponent } from './components/single-todo.component';

type TabType = 'list' | 'single';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TodoListComponent, SingleTodoComponent],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <h1>🚀 Angular TanStack Query Examples</h1>
        <p class="tagline">Learn Angular Query with real API examples</p>
      </header>

      <!-- Tab Navigation -->
      <nav class="tabs">
        <button 
          class="tab-button"
          [class.active]="activeTab() === 'list'"
          (click)="setActiveTab('list')">
          📋 All Todos
          <span class="tab-description">Background refetch every 10s</span>
        </button>
        
        <button 
          class="tab-button"
          [class.active]="activeTab() === 'single'"
          (click)="setActiveTab('single')">
          🎯 Single Todo
          <span class="tab-description">Fetch by ID on demand</span>
        </button>
      </nav>

      <!-- Tab Content -->
      <main class="tab-content">
        @if (activeTab() === 'list') {
          <app-todo-list />
        }
        
        @if (activeTab() === 'single') {
          <app-single-todo />
        }
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>
          💡 <strong>TanStack Query Features:</strong>
          Automatic caching, background refetching, query invalidation, and more!
        </p>
        <p class="api-info">
          🌐 API: <a href="https://jsonplaceholder.typicode.com" target="_blank">JSONPlaceholder</a>
        </p>
      </footer>
    </div>
  `,
  styles: [`
    /* App Container */
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    /* Header */
    .app-header {
      text-align: center;
      color: white;
      margin-bottom: 2rem;
    }

    .app-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .tagline {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    /* Tab Navigation */
    .tabs {
      display: flex;
      gap: 1rem;
      max-width: 900px;
      margin: 0 auto 2rem;
      flex-wrap: wrap;
    }

    .tab-button {
      flex: 1;
      min-width: 200px;
      padding: 1.25rem 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      border: 3px solid transparent;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .tab-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      background: white;
    }

    .tab-button.active {
      background: white;
      border-color: #3498db;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(52, 152, 219, 0.4);
    }

    .tab-description {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-weight: 400;
    }

    .tab-button.active .tab-description {
      color: #3498db;
      font-weight: 500;
    }

    /* Tab Content */
    .tab-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      max-width: 900px;
      margin: 0 auto;
      min-height: 500px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Footer */
    .app-footer {
      text-align: center;
      color: white;
      margin-top: 3rem;
      padding: 2rem;
    }

    .app-footer p {
      margin: 0.5rem 0;
      opacity: 0.9;
    }

    .app-footer strong {
      font-weight: 700;
    }

    .api-info {
      font-size: 0.95rem;
    }

    .api-info a {
      color: #3498db;
      text-decoration: none;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      transition: all 0.2s;
    }

    .api-info a:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.05);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2rem;
      }

      .tabs {
        flex-direction: column;
      }

      .tab-button {
        min-width: auto;
      }
    }
  `],
})
export class App {
  activeTab = signal<TabType>('list');

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }
}
