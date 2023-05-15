import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../message';
import { User } from '../user';
import axios from 'axios';

const apiConfig = {
  BACKEND_BASEURL: 'http://127.0.0.1:8000',
};
//http://34.88.189.102
export const axiosRequest = axios.create({
  withCredentials: true,
  baseURL: `${apiConfig.BACKEND_BASEURL}/api`,
});
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  getMessages() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    return axiosRequest.get('/messages');
  }

  insertMessage(data: Message) {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    data.user_id = 1;
    const date = new Date();
    data.timestamp = date
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');

    return axiosRequest.post('/messages', data);
  }

  async createUser(data: User) {
    if (data.is_admin) data['membership_status'] = 'active';
    else data['membership_status'] = 'inactive';
    return await axiosRequest.post('/auth/register', data);
  }

  async login(username: string, password: string) {
    return await axiosRequest.post('/auth/login', {
      username,
      password,
    });
  }

  async updateMembershipStatus() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    return await axiosRequest.put(`/user/${sessionStorage.getItem('userId')}`);
  }

  async removeMessage(messageId: number) {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    const response = await axiosRequest.delete(`/messages/${messageId}`);
    return response;
  }

  async getUserAdminStatus() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    const response = await axiosRequest.get(
      `/user/${sessionStorage.getItem('userId')}`
    );
    return response;
  }
}
