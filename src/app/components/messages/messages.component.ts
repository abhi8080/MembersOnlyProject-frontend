import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/message';
import { DataService } from 'src/app/service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: any;
  message = new Message();
  passcode: string = '';
  @ViewChild('messageModal') private addMessageModal: any;
  @ViewChild('joinModal') private joinModal: any;
  membershipMessage: any = null;
  isMember: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private dataService: DataService,
    private modalService: NgbModal,
    private authService: AuthService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getMessages();
    this.getUserAdminStatus();
  }

  /**
   * Retrieves messages from the data service
   */
  async getMessages(): Promise<void> {
    const response = await this.dataService.getMessages();
    this.messages = await response.data;
    if (this.messages[0].full_name !== 'Anonymous') this.isMember = true;
  }

  /**
   * Opens the add message modal
   */
  addMessage(): void {
    this.modalService.open(this.addMessageModal);
  }

  /**
   * Handles the join the club modal
   */
  handleJoinTheClub(): void {
    this.modalService.open(this.joinModal);
  }

  /**
   * Creates a new message
   */
  async createMessage(): Promise<void> {
    try {
      await this.dataService.insertMessage(this.message);
      this.getMessages();
    } catch (error: any) {
      console.error(error);
    }
  }

  /**
   * Removes a message
   * @param messageId The ID of the message to remove
   */
  async removeMessage(messageId: number): Promise<void> {
    try {
      await this.dataService.removeMessage(messageId);
      this.getMessages();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Submits the passcode to update the membership status
   */
  async sumbitPasscode(): Promise<void> {
    if (this.passcode.toUpperCase() === 'TOKYO') {
      await this.dataService.updateMembershipStatus();
      const message =
        this.translateService.currentLang == 'se-SE'
          ? 'Du är medlem nu!'
          : 'You are a member now!';
      this.membershipMessage = message;
      this.getMessages();
    } else {
      const message =
        this.translateService.currentLang == 'se-SE'
          ? 'Lösenordet är inte korrekt. Försök igen!'
          : 'The passcode is not correct. Please try again!';
      this.membershipMessage = message;
    }
  }

  /**
   * Retrieves the user's admin status
   */
  async getUserAdminStatus(): Promise<void> {
    const response = await this.dataService.getUserAdminStatus();
    if ((await response.data.isAdmin) == 1) this.isAdmin = true;
  }

  /**
   * Handles the selection of a language
   * @param event The language selection event
   */
  public selectLanguage(event: any): void {
    this.translateService.use(event.target.value);
  }

  /**
   * Logs out the user
   */
  logout(): void {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userJWT');
    this.authService.setIsAuthenticated(false);
    window.location.reload();
  }
}
