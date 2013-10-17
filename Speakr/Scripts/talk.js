/// <reference path="typings/knockout/knockout.d.ts" />
var talk = (function () {
    function talk(dto) {
        this.isVisible = ko.observable(true);
        for (var prop in dto) {
            this[prop] = dto[prop];
        }

        this.youVoted = ko.observable(dto.youVoted);
        this.voteCount = ko.observable(dto.voteCount);
        this.totalRanking = ko.observable(dto.totalRanking);
    }
    talk.prototype.matchesFilter = function (filter) {
        return [this.title, this.author, this.time, this.room].map(function (i) {
            return i.toLowerCase();
        }).some(function (textItem) {
            return textItem.indexOf(filter) >= 0;
        });
    };
    return talk;
})();
