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

  async getMessages() {
    const response = await this.dataService.getMessages();
    this.messages = await response.data;
    if (this.messages[0].full_name !== 'Anonymous') this.isMember = true;
  }

  addMessage() {
    this.modalService.open(this.addMessageModal);
  }

  handleJoinTheClub() {
    this.modalService.open(this.joinModal);
  }

  async createMessage() {
    try {
      await this.dataService.insertMessage(this.message);
      this.getMessages();
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    }
  }

  async removeMessage(messageId: number) {
    try {
      await this.dataService.removeMessage(messageId);
      this.getMessages();
    } catch (error) {
      console.error(error);
    }
  }

  async sumbitPasscode() {
    if (this.passcode.toUpperCase() === 'TOKYO') {
      await this.dataService.updateMembershipStatus();
      this.membershipMessage = 'You are a member now!';
      this.getMessages();
    } else this.membershipMessage = 'The passcode is not correct. Try again!';
  }

  async getUserAdminStatus() {
    const response = await this.dataService.getUserAdminStatus();
    if ((await response.data.isAdmin) == 1) this.isAdmin = true;
  }

  public selectLanguage(event: any) {
    this.translateService.use(event.target.value);
  }

  logout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userJWT');
    this.authService.setIsAuthenticated(false);
    window.location.reload();
  }
}
