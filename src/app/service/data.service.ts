import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../message';
import { User } from '../user';
import axios from 'axios';

const apiConfig = {
  BACKEND_BASEURL: 'http://127.0.0.1:8000',
};

export const axiosRequest = axios.create({
  withCredentials: true,
  baseURL: `${apiConfig.BACKEND_BASEURL}/api`,
});

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves messages from the API
   * @returns All the messages as an array.
   */
  getMessages() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    return axiosRequest.get('/messages');
  }

  /**
   * Inserts a new message to the API
   * @param data - The message data to be inserted
   * @returns The response from the API
   */
  insertMessage(data: Message) {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');

    data.user_id = sessionStorage.getItem('userId');
    const date = new Date();
    data.timestamp = date
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');

    return axiosRequest.post('/messages', data);
  }

  /**
   * Creates a new user
   * @param data - The user data to be created
   * @returns The response from the API
   */
  async createUser(data: User) {
    if (data.is_admin) {
      data['membership_status'] = 'active';
    } else {
      data['membership_status'] = 'inactive';
    }

    return await axiosRequest.post('/auth/register', data);
  }

  /**
   * Logs in a user
   * @param username - The username of the user
   * @param password - The password of the user
   * @returns The response from the API
   */
  async login(username: string, password: string) {
    return await axiosRequest.post('/auth/login', {
      username,
      password,
    });
  }

  /**
   * Updates the membership status of a user
   * @returns The response from the API
   */
  async updateMembershipStatus() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    return await axiosRequest.put(`/user/${sessionStorage.getItem('userId')}`);
  }

  /**
   * Removes a message from the API
   * @param messageId - The ID of the message to be removed
   * @returns The response from the API
   */
  async removeMessage(messageId: number) {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    const response = await axiosRequest.delete(`/messages/${messageId}`);
    return response;
  }

  /**
   * Retrieves the admin status of a user
   * @returns The response including the admin status of the user
   */
  async getUserAdminStatus() {
    axiosRequest.defaults.headers.common['Authorization'] =
      'Bearer ' + sessionStorage.getItem('userJWT');
    const response = await axiosRequest.get(
      `/user/${sessionStorage.getItem('userId')}`
    );
    return response;
  }
}
