/// <reference path="typings/knockout/knockout.d.ts" />

class talk {

    public title: string;
    public author: string;
    public description: string;
    public pictureUrl: string;
    public time: string;
    public room: string;
    public stars: number;
    public voteCount: KnockoutObservable<number>;
    public authorInfo: string;
    public isVisible = ko.observable(true);
    public id: string;
    public youVoted: KnockoutObservable<number>;
    public totalRanking: KnockoutObservable<number>;

    constructor(dto) {
        for (var prop in dto) {
            this[prop] = dto[prop];
        }

        this.youVoted = ko.observable(dto.youVoted);
        this.voteCount = ko.observable(dto.voteCount);
        this.totalRanking = ko.observable(dto.totalRanking);
    }

    matchesFilter(filter: string): boolean {
        return [this.title, this.author, this.time, this.room]
            .map(i => i.toLowerCase())
            .some(textItem => textItem.indexOf(filter) >= 0);
    }
}