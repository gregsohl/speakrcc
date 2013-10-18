using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Models
{
    public class UserActivity
    {
        public string Id { get; set; }
        public DateTime Time { get; set; }
        public string Content { get; set; }
        public string TalkId { get; set; }
        public string TalkAuthor { get; set; }

        public static UserActivity From(TalkRating rating, Talk talk, User user)
        {
            return new UserActivity
            {
                TalkId = rating.TalkId,
                Time = DateTime.Now,
                TalkAuthor = talk.Author,
                Content = string.Format("\"{0}\" was thumbed-up ({1}) at #tccc15 http://speakr.cc/#{2}",
                    talk.Title,
                    talk.Ranking > 0 ? "+" + talk.Ranking.ToString() : talk.Ranking.ToString(),
                    talk.Id)
            };
        }
    }
}