import { Component, OnInit } from '@angular/core';
import { ProcessChequesService } from '../process-cheques.service';

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: []
})
export class CardHeaderComponent implements OnInit {
  reviewCount: any;
  reviewCheques: any[];
  rejectCount: any;
  rejectCheques: any[];
  successCount: any;
  successCheques: any[];
  processedCheques: any;

  constructor(private processChequeSvc: ProcessChequesService) { }

  cardList: any[];

  ngOnInit() {
    this.getChequeCounts();
  }

  getChequeCounts() {
    this.processChequeSvc.getAllCheques().then(res => {
      this.processedCheques = res;
      this.reviewCheques = this.processedCheques['reviewCheques'];
      this.rejectCheques = this.processedCheques['rejectedCheques'];
      this.successCheques = this.processedCheques['successfulCheques']

      this.reviewCount = this.reviewCheques.length;
      this.rejectCount = this.rejectCheques.length;
      this.successCount = this.successCheques.length;

      this.cardList = [
        { icon: "reject", title: "To Reject", count: this.rejectCount },
        { icon: "review", title: "To Review", count: this.reviewCount },
        { icon: "success", title: "To Accept", count: this.successCount }];
    });
  }

  checkIcon(card) {
    switch (card.icon) {
      case 'reject':
        return 'times-circle';
      case 'success':
        return 'check-circle';
      case 'review':
        return 'ellipsis-h';
    }
  }

}
