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
        this.youLlamad = ko.observable(dto.youLlamad);
        this.llamas = ko.observable(dto.llamas);
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
        var _this = this;
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

        $.post("/API/Talks/Rate", { talkId: this.id, upVote: up }).fail(function (result) {
            return console.log("Oh noes! Unable to vote", result);
        }).done(function (savedTalk) {
            _this.ranking(savedTalk.ranking);
            _this.youUpVoted(savedTalk.youUpVoted);
            _this.youDownVoted(savedTalk.youDownVoted);
        });
    };

    talk.prototype.llamafy = function () {
        if (!this.youLlamad()) {
            this.youLlamad(true);
            this.llamas(this.llamas() + 1);

            $.post("/API/Talks/Llamafy?unicorns=7&flufferBerries=42&talkId=" + this.id);

            var audioElement = $("audio")[0];
            audioElement.play();
        }
    };
    return talk;
})();
//# sourceMappingURL=talk.js.map
