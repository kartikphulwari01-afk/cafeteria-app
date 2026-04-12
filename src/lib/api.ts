import { MenuItem, Order, mockMenu, mockOrders } from './mockData';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private activeOrders = [...mockOrders];
  private activeMenu = [...mockMenu];

  async getMenuItems(): Promise<MenuItem[]> {
    await delay(300);
    return [...this.activeMenu];
  }

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    await delay(500);
    const newItem = { ...item, id: `m_${Date.now()}` };
    this.activeMenu.push(newItem);
    return newItem;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    await delay(400);
    this.activeMenu = this.activeMenu.map(m => m.id === id ? { ...m, ...updates } : m);
  }

  async deleteMenuItem(id: string): Promise<void> {
    await delay(400);
    this.activeMenu = this.activeMenu.filter(m => m.id !== id);
  }

  async getPopularItems(): Promise<MenuItem[]> {
    await delay(300);
    return this.activeMenu.filter(item => item.isPopular);
  }

  async placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    await delay(800);
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      status: 'placed',
      createdAt: new Date().toISOString()
    };
    this.activeOrders.push(newOrder);
    return newOrder;
  }

  async getActiveOrders(): Promise<Order[]> {
    await delay(500);
    return [...this.activeOrders];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await delay(300);
    const order = this.activeOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    await delay(500);
    return this.activeOrders.filter(o => o.userId === userId);
  }
}

export const api = new ApiService();
