/// <reference path="typings/knockout/knockout.d.ts" />

class talk {

    public title: string;
    public author: string;
    public description: string;
    public pictureUrl: string;
    public time: string;
    public room: string;
    public stars: number;
    public authorInfo: string;
    public isVisible = ko.observable(true);
    public id: string;
    public youUpVoted: KnockoutObservable<boolean>;
    public youDownVoted: KnockoutObservable<boolean>;
    public ranking: KnockoutObservable<number>;

    constructor(dto) {
        for (var prop in dto) {
            this[prop] = dto[prop];
        }

        this.youUpVoted = ko.observable(dto.youUpVoted);
        this.youDownVoted = ko.observable(dto.youDownVoted);
        this.ranking = ko.observable(dto.ranking);
    }

    matchesFilter(filter: string): boolean {
        return [this.title, this.author, this.time, this.room]
            .map(i => i.toLowerCase())
            .some(textItem => textItem.indexOf(filter) >= 0);
    }

    upVote() {
        this.vote(true);
    }

    downVote() {
        this.vote(false);
    }

    vote(up: boolean) {

        var adjustment = 1;
        if (up && this.youDownVoted() || !up && this.youUpVoted()) {
            adjustment = 2;
        }

        this.youUpVoted(up);
        this.youDownVoted(!up);

        this.ranking(this.ranking() + (adjustment * (up ? 1 : -1)));

        $.post("/API/Talks/Rate", { talkId: this.id, upVote: up })
            .fail(result => console.log("Oh noes! Unable to vote", result))
            .done(savedTalk => {
                this.ranking(savedTalk.ranking);
                this.youUpVoted(savedTalk.youUpVoted);
                this.youDownVoted(savedTalk.youDownVoted);
            });
    }
}