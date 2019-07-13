import { Component, OnInit, Input } from '@angular/core';
import { ProcessChequesService } from '../process-cheques.service';

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: []
})
export class CardHeaderComponent implements OnInit {
  reviewCount: any;
  rejectCount: any;
  successCount: any;

  constructor(private processChqeSvc: ProcessChequesService) { }

  cardList: any[];

  ngOnInit() {
    this.getChequeCounts();
  }

  getChequeCounts() {
    this.processChqeSvc.getLatestCheque('review').subscribe((cheques: any[]) => {
      this.reviewCount = cheques.length;
      this.setCardList();

    });
    this.processChqeSvc.getLatestCheque('reject').subscribe((cheques: any[]) => {
      this.rejectCount = cheques.length;
      this.setCardList();
    });
    this.processChqeSvc.getLatestCheque('success').subscribe((cheques: any[]) => {
      this.successCount = cheques.length;
      this.setCardList();
    });
  }

  setCardList() {
    this.cardList = [
      { icon: "reject", title: "To Reject", count: this.rejectCount },
      { icon: "review", title: "To Review", count: this.reviewCount },
      { icon: "success", title: "To Accept", count: this.successCount }];
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
