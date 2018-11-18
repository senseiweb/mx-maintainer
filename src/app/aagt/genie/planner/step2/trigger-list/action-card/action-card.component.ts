import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'action-card',
    templateUrl: './action-card.component.html',
    styleUrls: ['./action-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActionCardComponent implements OnInit {
    @Input()
    cardId;

    card: any;
    board: any;

    constructor(
        private _activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        // this.board = this._activatedRoute.snapshot.data.board;
        // this.card = this.board.cards.filter((card) => {
        //     return this.cardId === card.id;
        // })[0];
    }

    isOverdue(cardDate): boolean {
        return moment() > moment(new Date(cardDate));
    }
}
