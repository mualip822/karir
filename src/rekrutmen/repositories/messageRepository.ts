/* ============================================================
   MESSAGE REPOSITORY
============================================================ */

import * as messageService from '../services/messageService';
import type { Message } from '../types/message.types';

export interface IMessageRepository {
  getMessages(): Promise<Message[]>;
  markAsRead(id: string): Promise<void>;
}

class MessageRepository implements IMessageRepository {
  async getMessages(): Promise<Message[]> {
    return await messageService.getMessages();
  }

  async markAsRead(id: string): Promise<void> {
    await messageService.markAsRead(id);
  }
}

export const messageRepository = new MessageRepository();