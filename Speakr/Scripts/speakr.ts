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
	hashSpeaker = "";

    constructor() {
		this.hashSpeaker = window.location.hash;
		this.fetchTalks();
        this.searchText
            .extend({ throttle: 250 })
            .subscribe(search => this.filterTalks(search));
    }

    fetchTalks() {
        $.getJSON("/API/Talks/GetAll").then(result => {
            var objects = result.map(dto => new talk(dto));
			this.allTalks(objects);

			if (this.hashSpeaker && this.hashSpeaker.length > 1) {
				this.searchText(this.hashSpeaker.substring(1));
				this.hashSpeaker = null;
			}
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
    
    afterRender(elements: HTMLElement[], sender: talk) {

        // Setup the popover for the speaker's picture.
        $(elements).find('.speaker-image').popover({
            title: sender.author,
            content: sender.authorInfo,
            placement: 'auto top',
            delay: { show: 100, hide: 250 },
            trigger: 'hover'
        });
    }
}