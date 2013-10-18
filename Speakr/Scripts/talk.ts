/// <reference path="typings/knockout/knockout.d.ts" />

class talk {

	public title: string;
	public author: string;
	public authorTwitter: string;
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
        return this.id == filter || [this.title, this.author, this.time, this.room, this.authorTwitter]
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
		$("#cannotVoteYet").modal();
    }
}