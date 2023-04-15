import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/message';
import { DataService } from 'src/app/service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: any;
  message = new Message();
  @ViewChild('content') private content: any;

  constructor(
    private dataService: DataService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {
    this.dataService.getMessages().subscribe((res) => {
      this.messages = res;
    });
  }

  openModal() {
    this.modalService.open(this.content);
  }

  createMessage() {
    this.dataService.insertMessage(this.message).subscribe(() => {
      this.getMessages();
    });
  }
}
