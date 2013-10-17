/// <reference path="typings/persona/persona.d.ts" />
/// <reference path="typings/bootstrap/bootstrap.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
var speakr = (function () {
    function speakr(loggedInUserName) {
        var _this = this;
        this.allTalks = ko.observableArray();
        this.searchText = ko.observable();
        this.loggedInUserName = ko.observable("");
        this.talkVoteUponSignIn = null;
        this.loggedInUserName(loggedInUserName);
        this.fetchTalks();
        this.searchText.extend({ throttle: 250 }).subscribe(function (search) {
            return _this.filterTalks(search);
        });

        // Use Mozilla Persona to do logins.
        // Why logins for Speakr? So that we limit voting abuse by requiring valid email addresses.
        navigator.id.watch({
            loggedInUser: loggedInUserName,
            onlogin: function (assertion) {
                $.post('/Account/PersonaLogin', { assertion: assertion }).done(function (data) {
                    return _this.successfulLogin(data.Email);
                }).fail(function () {
                    return navigator.id.logout();
                });
            },
            onlogout: function () {
                $.post("/Account/PersonaLogout").done(function () {
                    return _this.loggedInUserName("");
                });
            }
        });
    }
    speakr.prototype.successfulLogin = function (email) {
        this.loggedInUserName(email);

        if (this.talkVoteUponSignIn) {
            this.rateTalk(this.talkVoteUponSignIn.rating, this.talkVoteUponSignIn.clickEvent);
            this.talkVoteUponSignIn = null;
        }
    };

    speakr.prototype.login = function () {
        navigator.id.request({
            siteName: 'Speakr',
            backgroundColor: '#317EAC',
            oncancel: function () {
                return window.location.reload();
            }
        });
    };

    speakr.prototype.logout = function () {
        navigator.id.logout();
    };

    speakr.prototype.fetchTalks = function () {
        var _this = this;
        $.getJSON("/API/Talks/GetAll").then(function (result) {
            var objects = result.map(function (dto) {
                return new talk(dto);
            });
            _this.allTalks(objects);
        });
    };

    speakr.prototype.filterTalks = function (filter) {
        if (filter) {
            var filterLower = filter.toLowerCase();
            this.allTalks().forEach(function (talk) {
                return talk.isVisible(talk.matchesFilter(filterLower));
            });
        } else {
            this.allTalks().forEach(function (t) {
                return t.isVisible(true);
            });
        }
    };

    speakr.prototype.rateTalk = function (rating, clickEvent) {
        if (!this.loggedInUserName()) {
            this.talkVoteUponSignIn = { rating: rating, clickEvent: clickEvent };
            this.login();
        } else {
            var talk = ko.dataFor(clickEvent.target);
            talk.youVoted(rating);

            $.post("/API/Talks/Rate", { talkId: talk.id, stars: rating }).fail(function (result) {
                return console.log("Oh noes! Unable to vote", result);
            }).done(function (savedTalk) {
                talk.totalRanking(savedTalk.totalRanking);
                talk.voteCount(savedTalk.voteCount);
            });
            //if (new Date().getDate() < 19) {
            //    $('#cannotVoteYet').modal('show');
            //}
            //else {
            //}
        }
    };

    speakr.prototype.afterRender = function (elements, sender) {
        var _this = this;
        // Setup the popover for the speaker's picture.
        $(elements).find('.speaker-image').popover({
            title: sender.author,
            content: sender.authorInfo,
            placement: 'auto top',
            delay: { show: 100, hide: 500 },
            trigger: 'hover'
        });

        // Setup the star ranking for the talk.
        $(elements).find('.star-ranking').raty({
            click: function (score, clickEvent) {
                return _this.rateTalk(score, clickEvent);
            },
            halfShow: true,
            score: sender.youVoted() > 0 ? sender.youVoted() : 0,
            size: 24,
            starHalf: 'content/star-half.png',
            starOff: 'content/star-off.png',
            starOn: 'content/star-on.png',
            hints: ['KMN', "No llamas, no likey.", "Decent.", "Marvellous!", "Llama-kickin' good!"]
        });
    };
    return speakr;
})();
