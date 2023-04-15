import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../message';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  getMessages() {
    return this.httpClient.get('http://127.0.0.1:8000/api/messages');
  }

  insertMessage(data: Message) {
    data.user_id = 1;
    const date = new Date();
    data.timestamp = date
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');

    console.log(data);
    return this.httpClient.post('http://127.0.0.1:8000/api/messages', data);
  }
}
