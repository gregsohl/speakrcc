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
    public youLlamad: KnockoutObservable<boolean>;
    public llamas: KnockoutObservable<number>;

    constructor(dto) {
        for (var prop in dto) {
            this[prop] = dto[prop];
        }

        this.youUpVoted = ko.observable(dto.youUpVoted);
        this.youDownVoted = ko.observable(dto.youDownVoted);
        this.ranking = ko.observable(dto.ranking);
        this.youLlamad = ko.observable(dto.youLlamad);
        this.llamas = ko.observable(dto.llamas);
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
        if (up && this.youUpVoted()) {
            return;
        }

        if (!up && this.youDownVoted()) {
            return;
        }

        var adjustment = 1;
        if (this.youDownVoted() || this.youUpVoted()) {
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

    llamafy() {
        if (!this.youLlamad()) {
            this.youLlamad(true);
            this.llamas(this.llamas() + 1);

            $.post("/API/Talks/Llamafy?unicorns=7&flufferBerries=42&talkId=" + this.id);

            var audioElement = <HTMLAudioElement>$("audio")[0];
            audioElement.play();
        }
    }
}