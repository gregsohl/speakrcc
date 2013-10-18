using Speakr.Data;
using Speakr.Models;
using Speakr.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Web;
using System.Web.Mvc;

namespace Speakr.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // Cheap way to track a user. We did do full auth with Mozilla Persona,
            // but we pulled this code out and instead did simple session tracking.
            var sessionCookieName = "SpeakrSession";
            var sessionCookie = Request.Cookies[sessionCookieName];
            if (sessionCookie == null || string.IsNullOrEmpty(sessionCookie.Value))
            {
                var sessionId = Guid.NewGuid().ToString();
                var cookie = new HttpCookie(sessionCookieName, sessionId);
                cookie.Expires = DateTime.Now.AddYears(3);
                Response.SetCookie(cookie);

                var user = new User { SessionId = sessionId };
                using (var session = RavenInstance.Db.OpenSession())
                {
                    session.Store(user);
                    session.SaveChanges();
                }
            }

            return View();
        }

        public RssActionResult ActivitySummary()
        {
            using (var session = RavenInstance.Db.OpenSession())
            {
                var talkFeedbackItems = session.Query<UserActivity>()
                    .OrderByDescending(f => f.Time)
                    .Take(100)
                    .AsEnumerable()
                    .GroupBy(g => g.TalkId);

                var latestTalkFeedbacks = new List<UserActivity>();
                foreach (var groupedFeedback in talkFeedbackItems)
                {
                    latestTalkFeedbacks.Add(groupedFeedback.OrderByDescending(t => t.Time).FirstOrDefault());
                }

                var feedItems = from feedback in latestTalkFeedbacks
                                select new SyndicationItem(
                                    title: "New user activity on Speakr: " + feedback.Id,
                                    content: feedback.Content,
                                    itemAlternateLink: new Uri("http://speakr.cc/?" + feedback.Id),
                                    id: feedback.Id,
                                    lastUpdatedTime: new DateTimeOffset(feedback.Time));

                var feed = new SyndicationFeed("Speakr Activity", "The latest activity on Speakr", new Uri("http://speakr.cc"), feedItems) { Language = "en-US" };
                return new RssActionResult { Feed = feed };
            }
        }

        public RssActionResult Leaderboard()
        {
            using (var session = RavenInstance.Db.OpenSession())
            {
                // See if there are any rated talks.
                var topTalk = session
                    .Query<Talk>()
                    .OrderByDescending(d => d.Ranking)
                    .ThenBy(t => t.DateTime)
                    .FirstOrDefault();

                var leaderboard = session.Query<Leaderboard>().FirstOrDefault();
                var hasLeaderboardChanged = false;
                if (leaderboard == null)
                {
                    if (topTalk.Ranking > 0)
                    {
                        leaderboard = new Leaderboard { Ranking = topTalk.Ranking, TalkId = topTalk.Id };
                        hasLeaderboardChanged = true;
                        session.Store(leaderboard);
                        session.SaveChanges();
                    }
                }
                else
                {
                    // See if the leaderboard needs to be changed.
                    hasLeaderboardChanged = topTalk.Id != leaderboard.TalkId && topTalk.Ranking > leaderboard.Ranking;
                    if (hasLeaderboardChanged)
                    {
                        leaderboard.TalkId = topTalk.Id;
                        leaderboard.Ranking = topTalk.Ranking;
                    }
                }

                var items = hasLeaderboardChanged && topTalk.Ranking > 2 ? new [] { topTalk } : new Talk[] { };
                var feedItems = from talk in items
                                select new SyndicationItem(
                                    title: string.Format("{0} takes the lead at +{1}", talk.Title, talk.Ranking),
                                    content: string.Format("Highest ranked talk at #tccc15: \"{0}\" (+{1}) by {2}",
                                        talk.Title, 
                                        talk.Ranking, 
                                        talk.Author),
                                    itemAlternateLink: new Uri("http://speakr.cc/?" + (talk.Id + talk.Ranking).GetHashCode().ToString()),
                                    id: (talk.Id + talk.Ranking.ToString()).GetHashCode().ToString(),
                                    lastUpdatedTime: new DateTimeOffset(DateTime.Now));

                var feed = new SyndicationFeed("Speakr Leaderboard", "The top rated talk on Speakr", new Uri("http://speakr.cc"), feedItems) { Language = "en-US" };
                return new RssActionResult { Feed = feed };
            }
        }
    }
}