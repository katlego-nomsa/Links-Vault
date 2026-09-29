export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type LinkDraft = Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
