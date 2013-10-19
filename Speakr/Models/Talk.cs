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
        public DateTime DateTime { get; set; }
        public string PhotoUrl { get; set; }
        public string Room { get; set; }
        public string AuthorTwitter { get; set; }

        public int Ranking { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public int Llamas { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public bool YouLlamad { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public bool YouUpVoted { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public bool YouDownVoted { get; set; }

        [Raven.Imports.Newtonsoft.Json.JsonIgnore]
        public string Time
        {
            get { return this.DateTime.ToShortTimeString(); }
        }
    }
}