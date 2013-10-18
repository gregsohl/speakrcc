/// <reference path="typings/knockout/knockout.d.ts" />
var talk = (function () {
    function talk(dto) {
        this.isVisible = ko.observable(true);
        for (var prop in dto) {
            this[prop] = dto[prop];
        }

        this.youUpVoted = ko.observable(dto.youUpVoted);
        this.youDownVoted = ko.observable(dto.youDownVoted);
        this.ranking = ko.observable(dto.ranking);
    }
    talk.prototype.matchesFilter = function (filter) {
        return this.id == filter || [this.title, this.author, this.time, this.room, this.authorTwitter].map(function (i) {
            return i.toLowerCase();
        }).some(function (textItem) {
            return textItem.indexOf(filter) >= 0;
        });
    };

    talk.prototype.upVote = function () {
        this.vote(true);
    };

    talk.prototype.downVote = function () {
        this.vote(false);
    };

    talk.prototype.vote = function (up) {
        $("#cannotVoteYet").modal();
    };
    return talk;
})();
