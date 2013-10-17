/// <reference path="typings/persona/persona.d.ts" />
/// <reference path="typings/bootstrap/bootstrap.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />

interface JQuery {
    raty(args: any);
}

class speakr {

    allTalks = ko.observableArray<talk>();
    searchText = ko.observable<string>();
    loggedInUserName = ko.observable("");
    talkVoteUponSignIn = null;

    constructor(loggedInUserName: string) {
        this.loggedInUserName(loggedInUserName);
        this.fetchTalks();
        this.searchText
            .extend({ throttle: 250 })
            .subscribe(search => this.filterTalks(search));
       
        // Use Mozilla Persona to do logins.
        // Why logins for Speakr? So that we limit voting abuse by requiring valid email addresses.
        navigator.id.watch({
            loggedInUser: loggedInUserName,
            onlogin: (assertion: string) => {
                $.post('/Account/PersonaLogin', { assertion: assertion })
                    .done(data => this.successfulLogin(data.Email))
                    .fail(() => navigator.id.logout());
            },
            onlogout: () => {
                $.post("/Account/PersonaLogout").done(() => this.loggedInUserName(""));
            }
        });
    }

    successfulLogin(email: string) {
        this.loggedInUserName(email);

        // See if we need to vote up a talk on sign in.
        if (this.talkVoteUponSignIn) {
            this.rateTalk(this.talkVoteUponSignIn.rating, this.talkVoteUponSignIn.clickEvent);
            this.talkVoteUponSignIn = null;
        }
    }

    login() {
        navigator.id.request({
            siteName: 'Speakr',
            backgroundColor: '#317EAC',
            oncancel: () => window.location.reload()
        });
    }

    logout() {
        navigator.id.logout();
    }

    fetchTalks() {
        $.getJSON("/API/Talks/GetAll").then(result => {
            var objects = result.map(dto => new talk(dto));
            this.allTalks(objects);
        });
    }

    filterTalks(filter: string) {
        if (filter) {
            var filterLower = filter.toLowerCase();
            this.allTalks().forEach(talk => talk.isVisible(talk.matchesFilter(filterLower)));
        } else {
            this.allTalks().forEach(t => t.isVisible(true));
        }
    }

    rateTalk(rating: number, clickEvent: MouseEvent) {

        if (!this.loggedInUserName()) {
            this.talkVoteUponSignIn = { rating: rating, clickEvent: clickEvent };
            this.login();
        } else {
            var talk: talk = ko.dataFor(clickEvent.target);
            talk.youVoted(rating);

            $.post("/API/Talks/Rate", { talkId: talk.id, stars: rating })
                .fail(result => console.log("Oh noes! Unable to vote", result))
                .done(savedTalk => {
                    talk.totalRanking(savedTalk.totalRanking);
                    talk.voteCount(savedTalk.voteCount);
                });

            //if (new Date().getDate() < 19) {
            //    $('#cannotVoteYet').modal('show');
            //}
            //else {

            //}
        }
    }

    afterRender(elements: HTMLElement[], sender: talk) {

        // Setup the popover for the speaker's picture.
        $(elements).find('.speaker-image').popover({
            title: sender.author,
            content: sender.authorInfo,
            placement: 'auto top',
            delay: { show: 100, hide: 500 },
            trigger: 'hover'
        });

        // Setup the star ranking for the talk.
        $(elements)
            .find('.star-ranking')
            .raty({
                click: (score, clickEvent) => this.rateTalk(score, clickEvent),
                halfShow: true,
                score: sender.youVoted() > 0 ? sender.youVoted() : 0,
                size: 24,
                starHalf: 'content/star-half.png',
                starOff: 'content/star-off.png',
                starOn: 'content/star-on.png',
                hints: ['KMN', "No llamas, no likey.", "Decent.", "Marvellous!", "Llama-kickin' good!"]
            });
    }
}