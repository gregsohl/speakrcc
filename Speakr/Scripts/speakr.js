/// <reference path="typings/persona/persona.d.ts" />
/// <reference path="typings/bootstrap/bootstrap.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
var speakr = (function () {
    function speakr() {
        var _this = this;
        this.allTalks = ko.observableArray();
        this.searchText = ko.observable();
        this.hashSpeaker = "";
        this.hashSpeaker = window.location.hash;
        this.fetchTalks();
        this.searchText.extend({ throttle: 250 }).subscribe(function (search) {
            return _this.filterTalks(search);
        });
    }
    speakr.prototype.fetchTalks = function () {
        var _this = this;
        $.getJSON("/API/Talks/GetAll").then(function (result) {
            var objects = result.map(function (dto) {
                return new talk(dto);
            });
            _this.allTalks(objects);

            if (_this.hashSpeaker && _this.hashSpeaker.length > 1) {
                _this.searchText(_this.hashSpeaker.substring(1));
                _this.hashSpeaker = null;
            }
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

    speakr.prototype.afterRender = function (elements, sender) {
        // Setup the popover for the speaker's picture.
        $(elements).find('.speaker-image').popover({
            title: sender.author,
            content: sender.authorInfo,
            placement: 'auto top',
            delay: { show: 100, hide: 250 },
            trigger: 'hover'
        });
    };
    return speakr;
})();
//# sourceMappingURL=speakr.js.map
