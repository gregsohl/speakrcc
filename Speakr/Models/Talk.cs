using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Models
{
    public class Talk
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string AuthorInfo { get; set; }
        public string Description { get; set; }
        public float Stars { get; set; }
        public int TotalRanking { get; set; }
        public DateTime DateTime { get; set; }
        public string PhotoUrl { get; set; }
        public string Room { get; set; }
        public int VoteCount { get; set; }
        public string AuthorTwitter { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public int YouVoted { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public string Time
        {
            get { return this.DateTime.ToShortTimeString(); }
        }
    }
}